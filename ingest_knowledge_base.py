"""Upload Gold Standard PDFs to S3 and start a Bedrock Knowledge Base ingestion job.

Create the S3 bucket, Knowledge Base, and data source in the AWS console first.
This script only syncs documents into an existing Knowledge Base.
"""

import logging
import os
import time
import zipfile
from pathlib import Path
from urllib.parse import urlparse

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

ZIP_FILE_NAME = "Gold_Standard.zip"
EXTRACT_TO_DIRECTORY = "gold_standard_docs"
POLL_SECONDS = 15
MAX_WAIT_SECONDS = 60 * 30


def _required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise ValueError(f"{name} is not set. Add it to your .env file.")
    return value


def parse_s3_uri(s3_uri: str) -> tuple[str, str]:
    parsed = urlparse(s3_uri)
    if parsed.scheme != "s3" or not parsed.netloc:
        raise ValueError(f"BEDROCK_S3_URI must look like s3://bucket/prefix/, got: {s3_uri}")
    prefix = parsed.path.lstrip("/")
    if prefix and not prefix.endswith("/"):
        prefix = f"{prefix}/"
    return parsed.netloc, prefix


def unzip_local_file(zip_filename: str, extract_dir: str) -> bool:
    if not os.path.exists(zip_filename):
        logging.error("'%s' not found in the project directory.", zip_filename)
        return False

    if os.path.exists(extract_dir):
        logging.info("Directory '%s' already exists. Skipping extraction.", extract_dir)
        return True

    logging.info("Unzipping '%s' to '%s'...", zip_filename, extract_dir)
    os.makedirs(extract_dir, exist_ok=True)
    with zipfile.ZipFile(zip_filename, "r") as zip_ref:
        zip_ref.extractall(extract_dir)

    logging.info("Unzip complete.")
    return True


def upload_pdfs(s3_client, source_dir: Path, bucket: str, prefix: str) -> int:
    pdfs = list(source_dir.rglob("*.pdf"))
    if not pdfs:
        logging.error("No PDF files found under '%s'.", source_dir)
        return 0

    uploaded = 0
    for file_path in pdfs:
        relative = file_path.relative_to(source_dir).as_posix()
        key = f"{prefix}{relative}"
        logging.info("Uploading s3://%s/%s", bucket, key)
        s3_client.upload_file(str(file_path), bucket, key)
        uploaded += 1

    logging.info("Uploaded %s PDF(s) to s3://%s/%s", uploaded, bucket, prefix)
    return uploaded


def wait_for_ingestion(agent_client, knowledge_base_id: str, data_source_id: str, ingestion_job_id: str) -> str:
    deadline = time.time() + MAX_WAIT_SECONDS
    status = "STARTING"

    while time.time() < deadline:
        job = agent_client.get_ingestion_job(
            knowledgeBaseId=knowledge_base_id,
            dataSourceId=data_source_id,
            ingestionJobId=ingestion_job_id,
        )["ingestionJob"]
        status = job["status"]
        logging.info("Ingestion job %s status: %s", ingestion_job_id, status)

        if status in {"COMPLETE", "FAILED", "STOPPED"}:
            failure = job.get("failureReasons") or []
            if failure:
                logging.error("Ingestion failure reasons: %s", failure)
            return status

        time.sleep(POLL_SECONDS)

    raise TimeoutError(
        f"Ingestion job {ingestion_job_id} did not finish within {MAX_WAIT_SECONDS} seconds "
        f"(last status: {status}). Check the Bedrock console."
    )


def main() -> None:
    region = os.getenv("AWS_REGION", "us-east-1")
    knowledge_base_id = _required_env("BEDROCK_KNOWLEDGE_BASE_ID")
    data_source_id = _required_env("BEDROCK_DATA_SOURCE_ID")
    bucket, prefix = parse_s3_uri(_required_env("BEDROCK_S3_URI"))

    if not unzip_local_file(ZIP_FILE_NAME, EXTRACT_TO_DIRECTORY):
        return

    s3_client = boto3.client("s3", region_name=region)
    agent_client = boto3.client("bedrock-agent", region_name=region)

    uploaded = upload_pdfs(s3_client, Path(EXTRACT_TO_DIRECTORY), bucket, prefix)
    if not uploaded:
        return

    logging.info("Starting Knowledge Base ingestion job...")
    try:
        start = agent_client.start_ingestion_job(
            knowledgeBaseId=knowledge_base_id,
            dataSourceId=data_source_id,
        )
    except ClientError as exc:
        logging.error("Failed to start ingestion job: %s", exc)
        raise

    ingestion_job_id = start["ingestionJob"]["ingestionJobId"]
    logging.info("Started ingestion job %s", ingestion_job_id)

    status = wait_for_ingestion(agent_client, knowledge_base_id, data_source_id, ingestion_job_id)
    if status != "COMPLETE":
        raise RuntimeError(f"Ingestion job ended with status {status}.")

    logging.info("Knowledge Base ingest completed successfully.")


if __name__ == "__main__":
    main()

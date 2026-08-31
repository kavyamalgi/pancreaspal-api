"""Create the DynamoDB table used for chat conversation memory.

Run once per AWS account/region. Safe to re-run: existing tables are left unchanged.
"""

import logging
import os

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

DEFAULT_TABLE_NAME = "pancreaspal-conversations"


def main() -> None:
    region = os.getenv("AWS_REGION", "us-east-1")
    table_name = (os.getenv("DYNAMODB_CONVERSATION_TABLE") or DEFAULT_TABLE_NAME).strip()

    client = boto3.client("dynamodb", region_name=region)
    try:
        client.describe_table(TableName=table_name)
        logging.info("Table '%s' already exists in %s.", table_name, region)
        return
    except ClientError as exc:
        if exc.response.get("Error", {}).get("Code") != "ResourceNotFoundException":
            raise

    logging.info("Creating table '%s' in %s (on-demand)...", table_name, region)
    client.create_table(
        TableName=table_name,
        KeySchema=[
            {"AttributeName": "patient_id", "KeyType": "HASH"},
            {"AttributeName": "turn_id", "KeyType": "RANGE"},
        ],
        AttributeDefinitions=[
            {"AttributeName": "patient_id", "AttributeType": "S"},
            {"AttributeName": "turn_id", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    waiter = client.get_waiter("table_exists")
    waiter.wait(TableName=table_name)
    logging.info("Table '%s' is ACTIVE.", table_name)


if __name__ == "__main__":
    main()

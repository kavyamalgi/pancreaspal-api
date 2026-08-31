from datetime import datetime
import io
import logging
import os
import uuid
from pathlib import Path

import boto3
from boto3.dynamodb.conditions import Key
import pypdf

# --- Configuration ---
PATIENT_FILES_DIR = Path("patient_files")
PATIENT_FILES_DIR.mkdir(exist_ok=True)

MAX_CONVERSATION_TURNS = 20

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


class PatientService:
    def __init__(self, table=None):
        if table is not None:
            self._table = table
            return

        table_name = os.getenv("DYNAMODB_CONVERSATION_TABLE", "").strip()
        if not table_name:
            raise ValueError(
                "DYNAMODB_CONVERSATION_TABLE is not set. Add it to your .env file. See .env.example."
            )

        region = os.getenv("AWS_REGION", "us-east-1")
        dynamodb = boto3.resource("dynamodb", region_name=region)
        self._table = dynamodb.Table(table_name)
        logging.info(
            "PatientService using DynamoDB table %s in region %s",
            table_name,
            region,
        )

    def save_pdf_as_text(self, patient_id: str, file_content: bytes) -> bool:
        """Extracts text from an uploaded PDF and saves it as a .txt file."""
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""

            file_path = PATIENT_FILES_DIR / f"{patient_id}.txt"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Successfully processed PDF for patient {patient_id}, text length: {len(text)}")
            return True
        except Exception as e:
            print(f"Failed to process PDF for patient {patient_id}: {e}")
            return False

    def get_patient_history_text(self, patient_id: str) -> str | None:
        """Reads the full text history from a patient's .txt file."""
        file_path = PATIENT_FILES_DIR / f"{patient_id}.txt"
        if not file_path.exists():
            return None

        return file_path.read_text(encoding="utf-8")

    def append_to_patient_history(self, patient_id: str, new_text: str) -> bool:
        """Appends a new note to the patient's history .txt file."""
        file_path = PATIENT_FILES_DIR / f"{patient_id}.txt"
        if not file_path.exists():
            return False

        with open(file_path, "a", encoding="utf-8") as f:
            f.write(f"\n\n--- Appended Note ---\n{new_text}")
        return True

    def get_conversation_history(self, patient_id: str) -> list[dict]:
        """Retrieve the most recent conversation turns for a patient from DynamoDB."""
        response = self._table.query(
            KeyConditionExpression=Key("patient_id").eq(patient_id),
            ScanIndexForward=False,
            Limit=MAX_CONVERSATION_TURNS,
        )
        items = list(reversed(response.get("Items") or []))
        turns = [
            {
                "user_query": item.get("user_query", ""),
                "agent_response": item.get("agent_response", ""),
                "timestamp": item.get("timestamp", ""),
            }
            for item in items
        ]
        logging.info("Loaded %s conversation turn(s) for patient %s", len(turns), patient_id)
        return turns

    def add_to_conversation_history(self, patient_id: str, user_query: str, agent_response: str) -> None:
        """Persist a user/assistant turn in DynamoDB."""
        timestamp = datetime.now().isoformat()
        turn_id = f"TURN#{timestamp}#{uuid.uuid4()}"
        self._table.put_item(
            Item={
                "patient_id": patient_id,
                "turn_id": turn_id,
                "user_query": user_query,
                "agent_response": agent_response,
                "timestamp": timestamp,
            }
        )
        logging.info("Stored conversation turn for patient %s", patient_id)

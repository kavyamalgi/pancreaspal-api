from dotenv import load_dotenv
from rag_service import RAGService

load_dotenv()

rag = RAGService()

response = rag.process_query(
    patient_history="Patient is a 45-year-old with type 2 diabetes.",
    conversation_history=["Patient reports feeling shaky and sweaty."],
    query="What could these symptoms indicate?"
)

print(response)
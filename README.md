PancreasPal API

PancreasPal is an AI-powered clinical support assistant designed to help newly diagnosed Type 1 diabetes patients and medical professionals by providing evidence-based, context-aware responses using patient data and trusted medical literature.

This API supports:

📄 PDF uploads for patient history
🧠 Conversation memory per patient
🔍 Retrieval-Augmented Generation (RAG) for grounded medical responses
🚀 Getting Started

These instructions will help you run PancreasPal locally for development and research.

📋 Prerequisites
Python 3.10+
An Anthropic API key (Claude)
⚙️ Installation
1. Clone the Repository
git clone https://github.com/your-username/pancreaspal-api.git
cd pancreaspal-api
2. Create and Activate Virtual Environment
python3 -m venv venv
source venv/bin/activate
3. Install Dependencies
pip install -r requirements.txt
🔐 Environment Setup

Create a .env file in the root directory:

echo 'ANTHROPIC_API_KEY="your-anthropic-api-key-here"' > .env
📂 Add Your Data

Place your dataset (e.g., Gold_Standard.zip) in the root directory.

This dataset should contain:

Medical textbooks
Research papers
Verified diabetes-related documents
🧠 Build Vector Database

Run:

python build_db.py

This step:

Extracts your documents
Converts PDFs → text
Splits into chunks
Generates embeddings (local HuggingFace model)
Stores them in FAISS

You should see a folder created:

faiss_diseases_db/
▶️ Running the Application

Start the FastAPI server:

python -m uvicorn main:app --reload

Server runs at:

http://127.0.0.1:8000
📡 API Endpoints
Health Check
GET /
Upload Patient PDF
POST /api/v1/patients/upload
Append to Patient History
POST /api/v1/patients/{patient_id}/append
Query Patient (RAG)
POST /api/v1/patients/{patient_id}/query
🧠 Model Architecture
LLM: Claude (Anthropic)
Embeddings: sentence-transformers/all-MiniLM-L6-v2
Vector Store: FAISS
Framework: FastAPI + LangChain
🔄 System Workflow
Upload patient PDF → stored as text
Medical dataset → embedded + stored in FAISS
Query includes:
Patient history
Conversation memory
Retrieved medical context
Claude generates grounded response
⚠️ Important Notes
You must run build_db.py before starting the API
Ensure Gold_Standard.zip is in the root directory
Ensure .env contains your Anthropic API key
If FAISS DB is missing, the app will fail on startup
🧪 Testing the System

You can test quickly with:

curl http://127.0.0.1:8000/

Expected response:

{"status": "Medical RAG API is running."}
🛠 Tech Stack
Python
FastAPI
LangChain
FAISS
Sentence Transformers
Claude (Anthropic API)
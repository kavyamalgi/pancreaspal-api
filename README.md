# PancreasPal API

PancreasPal is an AI-powered clinical support assistant for newly diagnosed Type 1 diabetes patients and healthcare professionals. It combines patient-specific PDF history uploads, conversation memory, and Retrieval-Augmented Generation (RAG) with trusted clinical sources.

## Project Structure

- `main.py` - FastAPI backend application entry point
- `build_db.py` - Builds local FAISS vector database from `Gold_Standard.zip`
- `rag_service.py` - RAG service using LangChain, FAISS, and Anthropic Claude
- `patient_service.py` - PDF ingestion, patient history storage, and conversation memory
- `requirements.txt` - Backend Python dependencies
- `pancreaspal-ui/` - React frontend application
- `patient_files/` - Generated patient history text files
- `faiss_diseases_db/` - Built FAISS vector database
- `gold_standard_docs/` - Extracted medical source documents

## Requirements

- Python 3.12
- Node.js 16+ (for frontend)
- npm or yarn
- Anthropic API key stored in `ANTHROPIC_API_KEY`

## Backend Setup

### 1. Create and activate a Python virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the repository root with:

```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### 4. Prepare the medical source data

The backend uses a local FAISS database built from `Gold_Standard.zip`.

Place `Gold_Standard.zip` in the repository root if it is not already present.

### 5. Build the FAISS vector database

```bash
python build_db.py
```

This script will:

- unzip `Gold_Standard.zip` into `gold_standard_docs/`
- read each PDF file
- split document text into chunks
- generate embeddings using `sentence-transformers/all-MiniLM-L6-v2`
- save the FAISS database to `faiss_diseases_db/`

> If `faiss_diseases_db/` already exists and is valid, you can skip this step.

## Running the Backend

Start the FastAPI server with:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

`http://127.0.0.1:8000`

## Frontend Setup

The React UI lives in `pancreaspal-ui/`.

### 1. Install frontend dependencies

```bash
cd pancreaspal-ui
npm install
```

### 2. Configure frontend environment

Create a `.env.local` file inside `pancreaspal-ui/`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PancreasPal
```

### 3. Start the frontend

```bash
npm run dev
```

The UI will usually run at `http://localhost:3000`.

## Backend API Endpoints

### Health check

```http
GET /
```

Response:

```json
{ "status": "Medical RAG API is running." }
```

### Upload patient PDF

```http
POST /api/v1/patients/upload
Content-Type: multipart/form-data
```

Form field:

- `file` - a PDF document containing patient history

Response:

```json
{
  "patient_id": "<uuid>",
  "filename": "file.pdf",
  "info": "File processed. Use the patient_id for queries."
}
```

### Append patient history

```http
POST /api/v1/patients/{patient_id}/append
Content-Type: application/json
```

Body:

```json
{ "text": "New clinical note or follow-up information." }
```

### Query patient agent

```http
POST /api/v1/patients/{patient_id}/query
Content-Type: application/json
```

Body:

```json
{ "query": "What is the best insulin dosing strategy for this patient?" }
```

Response example:

```json
{
  "answer": "...",
  "sources": [
    { "source": "...", "url": null, "title": "..." }
  ]
}
```

## How it works

1. Upload a patient PDF.
2. The backend extracts text and saves it to `patient_files/<patient_id>.txt`.
3. The RAG service loads the FAISS vector store from `faiss_diseases_db/`.
4. A query combines patient history, conversation memory, and retrieved medical context.
5. Anthropic Claude generates the final answer.

## Notes and Troubleshooting

- `ANTHROPIC_API_KEY` must be present in `.env` before starting the backend.
- `faiss_diseases_db/` must exist before starting the API, or `main.py` will fail.
- If `build_db.py` cannot find `Gold_Standard.zip`, place it in the repository root.
- Check CORS settings in `main.py` if the frontend cannot connect.

## Quick test

With the backend running:

```bash
curl http://127.0.0.1:8000/
```

Expected output:

```json
{"status":"Medical RAG API is running."}
```

## Development notes

- Backend: `FastAPI`, `LangChain`, `FAISS`, `Anthropic Claude`
- Embeddings model: `sentence-transformers/all-MiniLM-L6-v2`
- Frontend: React + Vite + Tailwind CSS

## Useful directories

- `patient_files/` - saved patient text history
- `faiss_diseases_db/` - stored vector DB used by RAG
- `gold_standard_docs/` - extracted PDFs from `Gold_Standard.zip`
- `pancreaspal-ui/` - frontend application

---

## License

This project is provided without an explicit license. Add a license file if you plan to share or distribute it.

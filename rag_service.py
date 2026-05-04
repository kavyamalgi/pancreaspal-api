import os
import logging
from typing import List, Dict, Any, Optional

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain.chains import RetrievalQA

VECTOR_DB_PATH = "faiss_diseases_db"
EMBEDDING_MODEL_NAME = "NeuML/pubmedbert-base-embeddings"
LLM_MODEL_NAME = "claude-sonnet-4-6"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


class RAGService:
    def __init__(self):
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

        if not self.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not found. Please ensure it's in your .env file.")

        logging.info("Initializing RAG Service...")
        self.embeddings = self._initialize_embeddings()
        self.vector_db = self._load_vector_db()
        self.llm = self._initialize_llm()
        self.rag_chain = self._create_rag_chain()
        logging.info("RAG Service Initialized Successfully.")

    def _initialize_embeddings(self):
        return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

    def _initialize_llm(self) -> ChatAnthropic:
        return ChatAnthropic(
            model=LLM_MODEL_NAME,
            anthropic_api_key=self.anthropic_api_key,
            temperature=0.2,
            max_tokens=1024
        )

    def _load_vector_db(self) -> FAISS:
        if not os.path.exists(VECTOR_DB_PATH):
            raise FileNotFoundError(
                f"Vector DB not found at '{VECTOR_DB_PATH}'. Run build_db.py first."
            )

        logging.info(f"Loading vector DB from {VECTOR_DB_PATH}...")
        return FAISS.load_local(
            VECTOR_DB_PATH,
            self.embeddings,
            allow_dangerous_deserialization=True
        )

    def _create_rag_chain(self) -> Optional[RetrievalQA]:
        retriever = self.vector_db.as_retriever(search_kwargs={"k": 5})
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
    


    def _get_filtered_docs(self, query: str):
        docs_and_scores = self.vector_db.similarity_search_with_score(query, k=10)

        print("\n🔍 RAW RETRIEVAL RESULTS:")
        for i, (doc, score) in enumerate(docs_and_scores):
            print("hello")
            print(f"\n--- Candidate {i+1} | Score: {score} ---")
            print(doc.page_content[:500])
            print("last line")
            print("Metadata:", doc.metadata)

        # For FAISS L2 distance, LOWER score is usually better
        threshold = 1.0

        filtered_docs = [
            doc for doc, score in docs_and_scores
            if score <= threshold
        ]

        top_docs = filtered_docs[:3]

        print("\n✅ FINAL CHUNKS SENT TO LLM:")
        for i, doc in enumerate(top_docs):
            print(f"\n--- Final Chunk {i+1} ---")
            print(doc.page_content[:500])
            print("Metadata:", doc.metadata)

        return top_docs
    

    def format_output(self, raw_user_answer):
        """
        Uses the LLM to reformat the raw answer into a simpler format.
        """

        prompts_for_formatting = (
            "Take this raw_user_answer and organize it in an easy to read format "
            "at a 6th grade level without emojis. Address the user directly and " 
            "do not use third person pronouns.\n\n"
            f"raw_user_answer:\n{raw_user_answer}"
        )

        formatted_response = self.llm.invoke(prompts_for_formatting)

        return formatted_response.content

    def process_query(self, patient_history: str, conversation_history: List[str], query: str) -> Dict[str, Any]:
        if not self.rag_chain:
            return {"error": "RAG chain not initialized."}

        formatted_history = "\n".join(
            f"User: {turn['user_query']}\nAssistant: {turn['agent_response']}"
            for turn in conversation_history
        )
        structured_query = (
            f"Static Patient History:\n{patient_history}\n\n"
            f"Ongoing Conversation History:\n{formatted_history}\n\n"
            f"Clinician's Latest Request:\n{query}\n\n"
            f"Task:\nBased on all the information, provide a concise and clinically relevant answer."
        )

        try:
            logging.info("Invoking RAG chain...")
            #raw_outputs = self.rag_chain.invoke({"query": structured_query})
            docs = self._get_filtered_docs(structured_query)

            context = "\n\n".join([doc.page_content for doc in docs])

            response = self.llm.invoke(
                f"""
            Use ONLY the context below to answer the user's question.

            Context:
            {context}

            Question:
            {structured_query}
            """
            )

            return {
                "answer": response.content,
                "debug_chunks": [
                    {
                        "content": doc.page_content,
                        "source": doc.metadata.get("source"),
                        "page": doc.metadata.get("page")
                    }
                    for doc in docs
                ]
            }

            
            
              
            
            sources = []
            for doc in raw_outputs.get("source_documents", []):
                meta = doc.metadata
                sources.append({
                    "source": meta.get("source"),
                    "url": meta.get("url"),
                    "title": meta.get("title", meta.get("doc_id"))
                })

            raw_answer = raw_outputs.get("result", "")
            formatted_answer = self.format_output(raw_answer)

            return {
                "answer": formatted_answer,
                "sources": sources
            }
        
        except Exception as e:
            logging.error(f"RAG chain invocation failed: {e}")
            return {"error": f"Failed to process query: {e}"}
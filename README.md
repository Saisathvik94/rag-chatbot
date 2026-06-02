## Youtube RAG Chatbot
A **Retrieval-Augmented Generation (RAG) chatbot** that allows users to ask questions about the content of two YouTube videos. The application extracts video transcripts and metadata, converts them into vector embeddings, stores them in a **Qdrant vector database**, and retrieves relevant information to generate accurate, context-aware answers using **Google Gemini**.

### Features
- Analyze and compare two YouTube videos
- Extract video transcripts and metadata using YouTube Data API.
- Fetch video metadata (title, channel name, views, likes, etc.)
- Chunk and embed transcript content using LangChain
- Store embeddings in Qdrant Vector Database
- Perform semantic similarity search
- Generate context-aware answers using Gemini
- Local vector database deployment using Docker Desktop

### Tech Stack

**Backend**
- TypeScript
- Node.js
- Express.js

**AI & RAG**
- LangChain
- Google Gemini API
- Google Gemini Embeddings

**Data Sources**
- YouTube Data API
- YouTube Transcript API

**Vector Database**
- Qdrant
- Docker Desktop

### Key Concepts Implemented
**Retrieval-Augmented Generation (RAG)**

Combines information retrieval and Large Language Models to generate more accurate and grounded responses.

**Chunking**

Splits large transcripts into smaller pieces for efficient retrieval and processing.

**Embeddings**

Converts text into numerical vectors that capture semantic meaning.

**Vector Search**

Finds relevant content based on meaning rather than exact keyword matches.

**Semantic Retrieval**

Retrieves contextually relevant information from stored transcripts and metadata.
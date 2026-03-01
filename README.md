# EduCache
### Offline-First AI Learning Infrastructure for Bharat

EduCache is an AI-powered offline-first learning system designed for low-connectivity regions.  
It extracts knowledge once using cloud AI, stores it as structured semantic data, and enables fully offline reasoning without requiring an embedded LLM.

Built for Bharat-scale constraints.

---

## Problem

Students in rural and low-connectivity areas lose learning continuity when the internet fails.

Existing EdTech solutions:
- Require constant internet
- Depend on heavy video/PDF downloads
- Stop functioning offline
- Cache static content (GBs of storage)
- Offer no distributed learning capability

---

## Solution

EduCache stores **logic, not content**.

Instead of caching videos or PDFs, EduCache:
- Uses AI once to extract structured knowledge
- Stores concepts as compact semantic JSON objects
- Reconstructs answers offline using rule-based templates
- Works peer-to-peer without internet

Storage comparison (1000 concepts):
- Video cache: ~50GB  
- EduCache: ~2MB  

---

## Core Architecture

### 1. AI-Powered Knowledge Extraction (Online Phase)
- Uses OpenAI / Gemini APIs
- Converts unstructured content into structured JSON
- One-time extraction
- Stored permanently on device

### 2. Semantic Knowledge Caching
Each concept stored as:
```json
{
  "topic": "Photosynthesis",
  "definition": "...",
  "inputs": ["CO2", "Water", "Sunlight"],
  "outputs": ["Glucose", "Oxygen"],
  "analogy": "...",
  "process_flow": [...]
}
```

- ~2KB per concept
- Entire syllabus fits in MBs
- Fast retrieval

Supported answer modes:

- Concept explanation
- Process flow
- Analogy-based learning
- Exam-oriented summary

## Federated Rural Swarm Mode

In zero-connectivity classrooms:

- Devices form a local mesh network (Bluetooth / WiFi)
- Students share cached concepts peer-to-peer
- The classroom becomes a distributed knowledge base
- Learning continues without internet access

### Use Cases

- Rural schools
- Disaster zones
- Field training environments
- Defense operations


---

## Teacher-in-the-Loop Sync

- Teachers preload the syllabus once
- Students receive cached concepts instantly
- Sync occurs via local file transfer or QR-based mechanism
- Reduces repeated API calls
- Ensures consistent structured knowledge across devices

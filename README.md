# Real-Time Chat + Smart Tagging Input (@, # Autocomplete)

### **Tech Stack → Next.js, Redux, Node.js, Socket.io**

This project demonstrates a WhatsApp-style chat interface with:

- ✔ Real-time messages (via WebSocket)
- ✔ Dynamic tagging (@, #)
- ✔ Live autocomplete from backend
- ✔ Highlighted mentions
- ✔ Full message tokenization (text + tags)
- ✔ Modular frontend + backend architecture

---

## 🔧 Tech Stack & Architecture

---

## **Frontend (Next.js)**

**State Management:** Redux Toolkit  
**Real-time:** Socket.io-client  
**API Communication:** REST API (fetch / axios)  
**Chat Input:** A controlled input overlaid with a highlighted preview layer  

### **Tagging Engine Features**

- Detects `@` or `#`
- Tracks cursor position
- Extracts current word
- Sends keyword to backend
- Displays dropdown
- Arrow key navigation + click select
- Replaces typed word on selection
- Highlights selected tags

---

## **Backend (Node + Express)**

- REST route: `GET /suggestions?q=keyword`
- Real-time messaging via Socket.io
- Database choices: Postgres / MySQL / MongoDB / Prisma
- Modular API + Socket architecture

---

## 🚀 How to Run Locally

### **Backend Setup**

```
cd backend
npm install
npm run dev
```
### **Frontend Setup**

```
cd frontend
npm install
npm run dev
```

                         ┌──────────────────────────┐
                         │        FRONTEND          │
                         │       (Next.js)          │
                         ├──────────────────────────┤
                         │ Chat UI (React)          │
                         │ ChatInput + Tag Engine   │
                         │ Highlight Overlay Layer  │
                         │ Redux Store              │
                         │ Socket.io Client         │
                         └─────────────┬────────────┘
                                       │
                       REST (axios/fetch)     WebSocket (Socket.io)
                                       │
                                       ▼
      ┌──────────────────────────────────────────────────────────────┐
      │                         BACKEND                               │
      │                   Node.js + Express                           │
      ├──────────────────────────────┬────────────────────────────────┤
      │ REST API Layer               │ WebSocket Server (Socket.io)   │
      │ `/suggestions?q=`           │ Broadcast Messages              │
      │ Controllers                 │ Receive Messages                │
      │ Services                    │ Emit Events                    │
      └───────────────┬─────────────┴───────────────┬────────────────┘
                      │                               │
                      │                               │
                      ▼                               ▼
         ┌────────────────────┐            ┌──────────────────────────┐
         │  Autocomplete      │            │ Real-Time Messaging      │
         │ Suggestion Engine  │            │ Queue / Message Handler  │
         └─────────┬──────────┘            └─────────────┬────────────┘
                   │                                      │
                   ▼                                      ▼
       ┌────────────────────────┐             ┌─────────────────────────┐
       │   DATABASE LAYER       │             │     DATABASE LAYER      │
       │ Postgres / MySQL /     │             │ Chats Collection/Table  │
       │ MongoDB (via Prisma)   │             │ Users / Sessions        │
       │ suggestions table       │             │ Conversations           │
       └────────────────────────┘             └─────────────────────────┘


 ## 🚀 Tagging Engine Flow
 

User                      Frontend                   Backend
 │                          │                           │
 │ Type "@akha"             │                           │
 │────────────────────────► │                           │
 │                          │ Detect current word       │
 │                          │ Trigger = '@'             │
 │                          │ searchWord = 'akha'       │
 │                          │ Debounce 250ms            │
 │                          │───────────┬────────────── │
 │                                      │               │
 │                          │  GET /suggestions?q=akha  │
 │                          │──────────────────────────► │
 │                          │                           │ Query DB
 │                          │                           │ Return ["Akhand", ...]
 │                          │ ◄──────────────────────────│
 │ Dropdown opens           │                           │
 │────────────────────────► │                           │
 │ Select "Akhand"          │                           │
 │────────────────────────► │ Replace '@akh' → '@Akhand'│
 │                          │ Render highlight layer     │
 │                          │                           │


 ## 🚀 WebSocket Message Flow Diagram


User A                     Server                    User B
  │                          │                          │
  │  sendMessage("Hi")       │                          │
  ├─────────────────────────►│                          │
  │                          │ socket.on("message")     │
  │                          │ Save to DB               │
  │                          │ Broadcast to room        │
  │                          │───────────────┬──────────│
  │                          │               │          │
  │             ◄────────────┤ emit("message", {...})   │
  │                          │               └─────────►│ receive message
  │ message rendered         │                          │ message rendered



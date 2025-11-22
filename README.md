Real-Time Chat + Smart Tagging Input (@, # Autocomplete)

Tech Stack → Next.js, Redux, Node.js, Socket.io

This project demonstrates a whatsapp-style chat interface with:

✔ Real-time messages (via WebSocket)
✔ Dynamic tagging (@, #)
✔ Live autocomplete from backend
✔ Highlighted mentions
✔ Full message tokenization (text + tags)
✔ Modular frontend + backend architecture
🔧 Tech Stack & Architecture
Frontend (Next.js)

State Management: Redux Toolkit

Real-time: Socket.io-client

API Communication: REST API (fetch / axios)

Chat Input: A controlled <input> overlaid with a highlighted preview layer

Tagging engine:

Detects @ or #

Sends keyword to backend

Displays dropdown

Replaces word on selection

Highlights selected tags

Backend (Node + Express)

REST route: GET /suggestions?q=keyword

Real-time WS: Socket.io

DB: Postgres / MySQL / Mongo / Prisma 

🚀 How to Run Locally

Backend Setup
cd backend
npm install
npm run dev


Server runs at http://localhost:5050

Frontend Setup
cd frontend
npm install
npm run dev


App runs at http://localhost:3000

🧠 Tagging / Autocomplete Algorithm
Step-by-step:
1. User types into <input>

We track cursor position

Extract the current word:

hello @akha| <-- cursor here
currentWord = "@akha"

2. Detect trigger characters
if currentWord startsWith("@" or "#")
   triggerChar = "@" or "#"
   searchWord = currentWord.slice(1)

3. Debounce search
debounce(searchWord, 250 ms)

4. Fetch suggestions
GET /suggestions?q=akha
→ ["Akhand", "Akshay", "Akhil"]

5. Show dropdown

Arrow keys navigate

Enter selects

Clicking selects

6. Replace typed word

Replace the exact substring between space boundaries:

Before:  "hello @akh| there"
Replace: "hello @Akhand  there"

7. Highlight selected tags

Value:

hello @Akhand nice work


Highlight layer:

hello <span class="highlight">@Akhand</span> nice work

8. Tokenize on send
Input: "hello @Akhand #react"
Tokens:

[
  { type: "text", value: "hello " },
  { type: "tag", label: "Akhand", trigger: "@" },
  { type: "text", value: " " },
  { type: "tag", label: "react", trigger: "#" },
]


Used for:
✔ rendering
✔ saving in DB
✔ sending via WebSocket

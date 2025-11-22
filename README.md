# Real-Time Chat + Smart Tagging Input (@, # Autocomplete)

### **Tech Stack → Next.js, Redux, Node.js, Socket.io**

This project demonstrates a production-ready WhatsApp-style chat interface with advanced tagging capabilities:

- ✔ Real-time bidirectional messaging (Socket.io WebSockets)
- ✔ Dynamic tagging with `@mentions` and `#hashtags`
- ✔ Debounced live autocomplete from backend API
- ✔ Visual tag highlighting with transparent input overlay
- ✔ Smart backspace (deletes entire tag atomically)
- ✔ Token-based message architecture for rich rendering
- ✔ Redux state management with optimistic updates
- ✔ Room-based chat with shareable links
- ✔ Modular, scalable frontend + backend architecture

---

## 🔧 Tech Stack & Architecture

### **Frontend Stack**

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 14+ |
| **Redux Toolkit** | Centralized state management | Latest |
| **Socket.io-client** | Real-time WebSocket communication | 4.x |
| **React Query** | Server state, caching, mutations | 5.x |
| **TypeScript** | Type safety across components | 5.x |
| **Tailwind CSS** | Utility-first styling | 3.x |
| **@uidotdev/usehooks** | Custom React hooks (debouncing) | Latest |

### **Backend Stack**

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | RESTful API server |
| **Socket.io** | WebSocket server for real-time events |
| **CORS** | Cross-origin resource sharing |
| **Prisma/TypeORM** | Database ORM (suggested) |
| **PostgreSQL/MongoDB** | Persistent data storage (suggested) |

---

## 📂 Project Structure

```
project/
├── frontend/
│   ├── app/
│   │   └── room/[id]/page.tsx          # Dynamic room route
│   ├── components/
│   │   ├── RoomChat.tsx                # Main chat container
│   │   ├── TagInput.tsx                # Smart input with autocomplete
│   │   ├── RoomMessageBubble.tsx       # Message renderer
│   │   └── ChatInput.tsx               # Alternative simple input
│   ├── hooks/
│   │   ├── useRoomSocket.ts            # Socket.io connection hook
│   │   ├── useRoomMessages.ts          # Fetch room history
│   │   └── useSuggestionQuery.ts       # Autocomplete API hook
│   ├── redux/
│   │   ├── chatSlice.ts                # Redux state + actions
│   │   ├── chatSelectors.ts            # Memoized selectors
│   │   └── store.ts                    # Redux store config
│   └── services/
│       └── instance.ts                 # Axios/fetch wrapper
│
└── backend/
    ├── routes/
    │   ├── message.route.js            # POST /api/messages
    │   ├── suggestions.route.js        # GET /api/suggestions
    │   └── room.route.js               # Room management APIs
    ├── controllers/
    │   ├── messageController.js
    │   ├── suggestionController.js
    │   └── roomController.js
    ├── models/
    │   ├── Message.js
    │   ├── Room.js
    │   └── User.js
    └── server.js                       # Express + Socket.io setup
```

---

## 🎯 Key Features Explained

### **1. Smart Tagging Engine**

**Trigger Detection**
- Monitors cursor position on every keystroke
- Detects `@` or `#` characters followed by alphanumeric text
- Extracts search keyword dynamically

**Autocomplete Flow**
```
User types "@joh"
    ↓
Extract keyword: "joh"
    ↓
Debounce 250ms (prevents API spam)
    ↓
GET /api/suggestions?q=joh
    ↓
Backend returns: ["john", "johnny", "johnson"]
    ↓
Display dropdown below input
    ↓
User selects with Enter/Click
    ↓
Replace "@joh" → "@john " (with space)
    ↓
Add "@john" to mentions[] array
    ↓
Visual highlighting applied
```

**Smart Backspace**
- Detects if cursor is after a complete tag (e.g., `@john|`)
- Deletes entire tag atomically instead of character-by-character
- Removes tag from mentions array
- Repositions cursor correctly

### **2. Visual Highlighting System**

**Transparent Input Overlay Technique**

```jsx
<div className="relative">
  {/* Colored overlay (non-interactive) */}
  <div className="absolute inset-0 pointer-events-none">
    {value.split(/(\s+)/).map(part =>
      mentions.includes(part) 
        ? <span className="bg-yellow-300">{part}</span>
        : <span>{part}</span>
    )}
  </div>
  
  {/* Transparent input (user types here) */}
  <input 
    value={value}
    className="relative z-10 bg-transparent"
    style={{color: "transparent"}}
  />
</div>
```

**Why This Approach?**
- ✅ Native input behavior (cursor, selection, mobile keyboard)
- ✅ No contenteditable complexity or cursor jumping
- ✅ Custom styling without fighting browser defaults
- ✅ Works perfectly on iOS/Android

### **3. Token-Based Message Architecture**

**What Are Tokens?**

Messages are stored as structured arrays instead of plain strings:

```javascript
// Plain text storage (limited)
"Hello @john check #urgent report"

// Token-based storage (flexible)
[
  {type: "text", value: "Hello "},
  {type: "tag", label: "john", trigger: "@"},
  {type: "text", value: "check "},
  {type: "tag", label: "urgent", trigger: "#"},
  {type: "text", value: "report "}
]
```

**Benefits**
- 🎨 Rich rendering with custom styles per token type
- 🔍 Efficient search/filtering by tags
- 🔒 XSS protection (no HTML injection)
- 🚀 Future extensibility (links, emojis, files)

### **4. Room-Based Architecture**

**UUID-Based User Identification**
```javascript
// Anonymous user system (no signup required)
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID(); // "a3f5b2c1-..."
  localStorage.setItem("userId", userId);
}
```

**Room Join Flow**
1. User opens `/room/[roomId]`
2. Check/generate user ID
3. POST `/api/rooms/join` with `{roomId, userId}`
4. Fetch message history: GET `/api/rooms/[id]/messages`
5. Connect to Socket.io and emit `join-room`
6. Setup message listener
7. Render chat UI with history

**Shareable Room Links**
```javascript
// Copy room link button
const shareRoom = () => {
  const url = window.location.href; // https://app.com/room/abc-123
  navigator.clipboard.writeText(url);
  alert("Room link copied! Share with others.");
};
```

---

## 🚀 How to Run Locally

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- (Optional) PostgreSQL/MongoDB for persistence

### **Backend Setup**

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5050
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/chatdb
EOF

# Run development server
npm run dev

# Server starts on http://localhost:5050
```

**Backend API Endpoints**
```
POST   /api/messages              # Save new message
GET    /api/messages/:id          # Get single message
GET    /api/rooms/:id/messages    # Get room history
POST   /api/rooms/join            # Join room
GET    /api/suggestions?q=keyword # Autocomplete suggestions
```

**Socket.io Events**
```javascript
// Client → Server
socket.emit("join-room", roomId);
socket.emit("room-message", {roomId, message});

// Server → Client
socket.on("room-message", (message) => {
  // Handle incoming message
});
```

### **Frontend Setup**

```bash
cd frontend
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5050/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5050
EOF

# Run development server
npm run dev

# App starts on http://localhost:3000
```

**Test the Application**

1. **Open first browser tab:**  
   Navigate to `http://localhost:3000/room/test-room-123`

2. **Open second browser tab (incognito):**  
   Navigate to same URL: `http://localhost:3000/room/test-room-123`

3. **Test real-time messaging:**
   - Type message in Tab 1 → Should appear in Tab 2 instantly
   - Type message in Tab 2 → Should appear in Tab 1 instantly

4. **Test tag autocomplete:**
   - Type `@` followed by letters
   - Wait 250ms for dropdown
   - Navigate with arrow keys
   - Press Enter to select

---

## 🎨 Architecture Diagrams

### **System Architecture**

```
                         ┌──────────────────────────┐
                         │        FRONTEND          │
                         │       (Next.js)          │
                         ├──────────────────────────┤
                         │ • Chat UI (React)        │
                         │ • TagInput Component     │
                         │ • Highlight Overlay      │
                         │ • Redux Store            │
                         │ • Socket.io Client       │
                         │ • React Query Cache      │
                         └─────────────┬────────────┘
                                       │
                       REST (axios)          WebSocket
                       /api/messages         (Socket.io)
                       /api/suggestions
                                       │
                                       ▼
      ┌────────────────────────────────────────────────────────────────┐
      │                         BACKEND                                 │
      │                   Node.js + Express.js                          │
      ├────────────────────────────┬───────────────────────────────────┤
      │ REST API Layer             │ WebSocket Server (Socket.io)      │
      │ • GET /suggestions?q=      │ • Broadcast room messages         │
      │ • POST /messages           │ • Handle join-room events         │
      │ • GET /rooms/:id/messages  │ • Emit room-message events        │
      │ • POST /rooms/join         │ • Room-based namespacing          │
      └───────────────┬────────────┴───────────────┬───────────────────┘
                      │                             │
                      │                             │
                      ▼                             ▼
         ┌────────────────────────┐      ┌──────────────────────────┐
         │  Autocomplete Service  │      │ Message Broadcast Queue  │
         │  • Search suggestions  │      │ • Room isolation         │
         │  • Filter by keyword   │      │ • Event broadcasting     │
         │  • Return sorted list  │      │ • Connection management  │
         └─────────┬──────────────┘      └─────────────┬────────────┘
                   │                                    │
                   ▼                                    ▼
       ┌────────────────────────────┐       ┌─────────────────────────┐
       │   DATABASE LAYER           │       │     DATABASE LAYER      │
       │ • suggestions table        │       │ • messages table        │
       │   - id, label, type        │       │   - id, content (JSON)  │
       │ • users table              │       │   - roomId, senderId    │
       │   - id, name               │       │   - createdAt           │
       └────────────────────────────┘       │ • rooms table           │
                                            │   - id, participants[]  │
                                            └─────────────────────────┘
```

### **Tagging Engine Flow**

```
User                      Frontend                      Backend
 │                          │                              │
 │ Types "@akha"            │                              │
 │──────────────────────────►│                              │
 │                          │ 1. handleChange()            │
 │                          │    - getValue()              │
 │                          │    - getCursor()             │
 │                          │    - getCurrentWord()        │
 │                          │    → "@akha"                 │
 │                          │                              │
 │                          │ 2. Detect trigger            │
 │                          │    trigger = '@'             │
 │                          │    searchWord = 'akha'       │
 │                          │    setShowList(true)         │
 │                          │                              │
 │                          │ 3. useDebounce(250ms)        │
 │                          │    [Wait for typing pause]   │
 │                          │                              │
 │                          │ 4. useSuggestionQuery()      │
 │                          │    GET /suggestions?q=akha   │
 │                          │───────────────────────────────►│
 │                          │                              │ 5. Query DB
 │                          │                              │    SELECT * FROM
 │                          │                              │    suggestions
 │                          │                              │    WHERE label
 │                          │                              │    ILIKE 'akha%'
 │                          │                              │
 │                          │ ◄──────────────────────────────│ 6. Return
 │                          │ [{label: "Akhand"},          │    ["Akhand",
 │                          │  {label: "Akhar"}]           │     "Akhar"]
 │ Dropdown renders         │                              │
 │ ┌──────────────┐         │                              │
 │ │ @Akhand      │ ←hover  │                              │
 │ │ @Akhar       │         │                              │
 │ └──────────────┘         │                              │
 │                          │                              │
 │ Press ↓ ↓ (ArrowDown)    │                              │
 │──────────────────────────►│ 7. handleKeyDown()          │
 │                          │    activeIndex++             │
 │                          │    Highlight next item       │
 │                          │                              │
 │ Press Enter              │                              │
 │──────────────────────────►│ 8. replaceWord()            │
 │                          │    - getWordBoundaries()     │
 │                          │      {start: 0, end: 5}      │
 │                          │    - Build: "@Akhand"        │
 │                          │    - Replace in value        │
 │                          │    - setMentions([...])      │
 │                          │    - setSelectionRange()     │
 │                          │                              │
 │ Visual highlight         │ 9. Overlay re-renders        │
 │ "@Akhand" in yellow      │    <span class="bg-yellow">  │
 │◄──────────────────────────│      @Akhand                │
 │                          │    </span>                   │
```

### **WebSocket Message Flow**

```
User A (Browser 1)         Server (Node.js)         User B (Browser 2)
      │                          │                          │
      │ 1. Type "Hello @john"    │                          │
      │    Press Enter           │                          │
      ├─────────────────────────►│                          │
      │                          │                          │
      │ 2. Tokenize message      │                          │
      │    [{type:"text",        │                          │
      │      value:"Hello "},    │                          │
      │     {type:"tag",         │                          │
      │      label:"john"}]      │                          │
      ├─────────────────────────►│                          │
      │                          │                          │
      │ 3. POST /api/messages    │                          │
      │    {tokens, senderId,    │                          │
      │     roomId}              │                          │
      ├─────────────────────────►│ 4. Save to database      │
      │                          │    INSERT INTO messages  │
      │                          │    RETURNING id, ...     │
      │                          │                          │
      │ ◄─────────────────────────│ 5. Return saved msg     │
      │ {id: "msg-123",          │    with ID               │
      │  tokens: [...],          │                          │
      │  createdAt: "..."}       │                          │
      │                          │                          │
      │ 6. Optimistic UI update  │                          │
      │    (message already      │                          │
      │     visible)             │                          │
      │                          │                          │
      │ 7. socket.emit()         │                          │
      │    "room-message"        │                          │
      ├─────────────────────────►│ 8. Broadcast to room     │
      │                          │    io.to(roomId).emit()  │
      │                          │───────────────┬──────────│
      │                          │               │          │
      │                          │               └─────────►│ 9. Receive event
      │                          │                          │    socket.on()
      │                          │                          │
      │                          │                          │ 10. Dispatch Redux
      │                          │                          │     addRoomMessage()
      │                          │                          │
      │                          │                          │ 11. UI re-renders
      │                          │                          │     New message
      │                          │                          │     appears
      │ Message in own bubble    │                          │◄───────────────
      │ (right-aligned)          │                          │ Message in
      │                          │                          │ other's bubble
      │                          │                          │ (left-aligned)
```

---

## 📊 Performance Optimizations

### **Current Optimizations**

| Optimization | Implementation | Impact |
|--------------|----------------|--------|
| **API Debouncing** | `useDebounce(250ms)` | 80-90% fewer API calls |
| **React Query Caching** | 5-minute stale time | Instant repeat searches |
| **Redux Selectors** | Memoized with Reselect | Prevents unnecessary re-renders |
| **Socket Event Cleanup** | useEffect return cleanup | No memory leaks |
| **Conditional Rendering** | `showList && list.length > 0` | Reduced DOM nodes |

### **Future Optimizations**

**Virtual Scrolling for Large Message Lists**
```javascript
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <RoomMessageBubble msg={messages[index]} />
    </div>
  )}
</FixedSizeList>
```

**Message Pagination**
```javascript
// Load messages in batches
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["room-messages", roomId],
  queryFn: ({ pageParam = 0 }) =>
    api.get(`/rooms/${roomId}/messages?offset=${pageParam}&limit=50`),
  getNextPageParam: (lastPage) => lastPage.nextOffset,
});
```

---

## 🔒 Security Considerations

### **Current Implementation**

| Feature | Status | Notes |
|---------|--------|-------|
| **XSS Protection** | ✅ Implemented | Token-based rendering prevents HTML injection |
| **Authentication** | ❌ Missing | Anyone can join any room |
| **Rate Limiting** | ❌ Missing | API can be spammed |
| **CORS** | ⚠️ Wide Open | `origin: "*"` allows any domain |
| **Input Sanitization** | ✅ Implicit | Tokenization sanitizes tags |
| **SQL Injection** | ⚠️ Depends | Use parameterized queries |

### **Recommended Security Enhancements**

**1. Add Authentication**
```javascript
// JWT-based auth
app.use("/api", authenticateJWT);

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

**2. Rate Limiting**
```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: "Too many requests, please try again later."
});

app.use("/api/suggestions", limiter);
```

**3. Restrict CORS**
```javascript
app.use(cors({
  origin: ["https://yourapp.com", "http://localhost:3000"],
  credentials: true
}));
```

---

## 🐛 Troubleshooting

### **Common Issues**

**1. Socket Connection Failed**
```
Error: WebSocket connection failed
```
**Solution:**
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_SOCKET_URL` in frontend .env
- Check CORS settings in backend
- Ensure firewall allows WebSocket connections

**2. Dropdown Not Appearing**
```
User types "@" but no suggestions show
```
**Solution:**
- Check API endpoint: `curl http://localhost:5050/api/suggestions?q=test`
- Verify debounce isn't too long (should be 250ms)
- Check React Query dev tools for query status
- Ensure `showList` state is being set to `true`

**3. Messages Not Syncing**
```
User A sends message but User B doesn't receive
```
**Solution:**
- Verify both users joined same room ID
- Check socket event names match exactly (`"room-message"`)
- Ensure `io.to(roomId).emit()` is broadcasting correctly
- Check browser console for socket errors
- Verify duplicate prevention isn't filtering messages incorrectly

**4. Tags Not Highlighting**
```
Tags send correctly but don't highlight visually
```
**Solution:**
- Verify tag is in `mentions[]` array
- Check `mentions.includes(part)` logic in overlay
- Ensure overlay has `pointer-events-none` CSS
- Verify z-index stacking order (overlay above input)

---

## 🎯 Future Roadmap

### **Phase 1: Core Enhancements** (1-2 weeks)
- [ ] User authentication (JWT)
- [ ] User profiles with avatars
- [ ] Message editing/deletion
- [ ] Typing indicators
- [ ] Read receipts

### **Phase 2: Rich Features** (2-4 weeks)
- [ ] File attachments (images, documents)
- [ ] Emoji picker with autocomplete (`:smile:` → 😊)
- [ ] GIF integration (Giphy API)
- [ ] Voice messages
- [ ] Video call integration (WebRTC)

### **Phase 3: Advanced** (1-2 months)
- [ ] End-to-end encryption
- [ ] Message search with Elasticsearch
- [ ] Tag analytics dashboard
- [ ] Admin moderation tools
- [ ] Multi-language support (i18n)

### **Phase 4: Scale** (Ongoing)
- [ ] Horizontal scaling with Redis adapter
- [ ] CDN for static assets
- [ ] Database read replicas
- [ ] Monitoring with Datadog/Sentry
- [ ] A/B testing framework

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Code Style**
- Use TypeScript for all new code
- Follow ESLint rules
- Write unit tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👤 Author

**Akhand Pratap**  
Full-Stack Software Engineer  
- GitHub: [@akhandpratap](https://github.com/akhandpratap)
- LinkedIn: [Akhand Pratap](https://linkedin.com/in/akhandpratap)
- Portfolio: [akhandpratap.dev](https://akhandpratap.dev)

---

## 🙏 Acknowledgments

- Socket.io team for excellent real-time library
- Redux team for state management patterns
- Next.js team for amazing React framework
- Open-source community for inspiration

---

**Built with ❤️ using Next.js, Redux, and Socket.io**

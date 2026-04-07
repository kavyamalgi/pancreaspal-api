# ⚡ Quick Start Guide - PancreasPal Chatbot UI

Get started with the chatbot interface in 5 minutes!

---

## 📋 Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:8000`

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd pancreaspal-ui
npm install
```

### Step 2: Configure Environment (30 sec)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
```

### Step 3: Start Development Server (1 min)
```bash
npm run dev
```

### Step 4: Open in Browser (30 sec)
Navigate to: **http://localhost:3000**

### Step 5: Test the Interface (2 min)

1. **Upload PDF**: Click "📎 Upload PDF" and select a test file
2. **Ask Question**: Type "What are the symptoms?" and click Send
3. **View FAQ**: Click "📚 FAQ" link at bottom

---

## ✅ What You Should See

| Screen | Expected Result |
|--------|-----------------|
| Initial Load | Chat interface with upload option |
| After PDF Upload | "✓ Patient ID: xxx..." message |
| After Sending Message | User message appears immediately |
| AI Response | AI response with sources appears |
| FAQ Page | 6 disclaimer items displayed |

---

## 🔌 Backend Connection

Before testing, ensure your backend is running:

```bash
# In another terminal
cd pancreaspal-api-main/pancreaspal-api-main
python -m uvicorn main:app --reload
```

**Health check:**
```bash
curl http://localhost:8000/
# Should return: {"status": "Medical RAG API is running."}
```

---

## 📁 Project Structure

```
pancreaspal-ui/
├── src/
│   ├── components/      # UI components
│   ├── pages/          # Page components (Chat, FAQ)
│   ├── context/        # State management (Zustand)
│   ├── services/       # API client
│   ├── App.jsx         # Main app
│   └── index.js        # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Build config
└── README.md           # Full documentation
```

---

## 🎯 Component Overview

| Component | Located In | Purpose |
|-----------|-----------|---------|
| Header | `components/Header.jsx` | Navigation bar |
| ChatPage | `pages/ChatPage.jsx` | Main chat |
| MessageList | `components/MessageList.jsx` | Messages |
| FAQPage | `pages/FAQPage.jsx` | FAQ items |

---

## 🔑 Key Features

✅ PDF patient file upload
✅ Real-time chat with AI
✅ Medical source citations
✅ FAQ and disclaimers
✅ Responsive mobile design

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `.env.local` | API URL and settings |
| `vite.config.js` | Build configuration |
| `tailwind.config.js` | CSS styling |
| `package.json` | Dependencies |

---

## 🧪 Quick Tests

### Test 1: Component Loads
```bash
npm run dev
# Check http://localhost:3000
```

### Test 2: API Connection
- Upload PDF → Should show "✓ Patient ID: ..."
- If error: Backend might not be running

### Test 3: Chat Works
- Type message → Click Send → Should see response

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- --port 3001
```

### Issue: Module not found
```bash
npm install
npm run dev
```

### Issue: API not responding
```bash
# Check backend is running
curl http://localhost:8000/
```

---

## 🔄 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

---

## 📚 Documentation

- **Full Setup**: See `SETUP_AND_DEPLOYMENT.md`
- **Backend Integration**: See `BACKEND_INTEGRATION_GUIDE.md`
- **Component Details**: See `COMPONENT_ARCHITECTURE.md`
- **Project Overview**: See `README.md`

---
   - For production: Implement backend database

---

## ✨ Next Steps

1. **Verify everything loads** ✓
2. **Check backend integration** (see `BACKEND_INTEGRATION_GUIDE.md`)
3. **Update API endpoints** (in `apiService.js`)
4. **Test full workflow** (upload → query)
5. **Build for production** (`npm run build`)

---

## 🚀 Ready to Deploy?

### Local Testing
```bash
npm run build
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build: `npm run build`
2. Upload `dist/` folder to Netlify

---

## 💡 Pro Tips

1. **Use DevTools** (F12) to debug:
   - Console for errors
   - Network tab to see API calls

2. **Monitor Backend**:
   - Watch terminal running uvicorn
   - Check for request logs

3. **Test on Mobile**:
   - Access `http://<your-ip>:3000` on phone
   - Ensures responsive design works

4. **Browser Sync**:
   - Edit files → auto-refreshes
   - Check DevTools for errors

---

## ❓ FAQ

**Q: Can I use this without a backend?**
A: Yes! It comes with mock API responses. Connect to real backend when ready.

**Q: How do I change colors?**
A: Edit `tailwind.config.js` and `config.js`

**Q: Where are messages stored?**
A: Currently in browser memory. Connect to backend DB for persistence.

**Q: How do I add new pages?**
A: Create `.jsx` file in `src/pages/`, add route in `App.jsx`

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend terminal
3. Read `README.md` for full docs
4. See `COMPONENT_ARCHITECTURE.md` for component details
5. Review `BACKEND_INTEGRATION_GUIDE.md` for API setup

---

**Ready?** Start with:
```bash
npm install && npm run dev
```

Then visit: **http://localhost:3000**

🎉 **You're all set!**

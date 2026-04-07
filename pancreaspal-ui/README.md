# PancreasPal UI - React Chatbot Frontend

A modern, responsive React-based chatbot interface for interacting with the PancreasPal Medical RAG API.

## 📋 Features

✅ **Interactive Chat** - Real-time conversation with medical AI
✅ **PDF Upload** - Patient history management
✅ **Message History** - Conversation tracking
✅ **Source Attribution** - Displays medical sources cited by the AI
✅ **FAQ Page** - Comprehensive disclaimer and usage guidelines
✅ **Responsive Design** - Mobile-friendly interface with Tailwind CSS
✅ **State Management** - Zustand for lightweight, scalable store

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide Icons** - Icon library
- **date-fns** - Date formatting

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Clone and navigate to the project**
   ```bash
   cd pancreaspal-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Update `VITE_API_URL` to match your backend API endpoint

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── ChatInput.jsx
│   ├── MessageList.jsx
│   └── Disclaimer.jsx
├── pages/              # Full page components
│   ├── ChatPage.jsx
│   └── FAQPage.jsx
├── context/            # Zustand stores
│   └── chatStore.js
├── services/           # API integration
│   └── apiService.js
├── hooks/              # Custom React hooks
│   └── useChat.js
├── App.jsx             # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## 🔌 API Integration

The frontend connects to the PancreasPal FastAPI backend at `http://localhost:8000`.

### Configured Endpoints

- `POST /api/v1/patients/upload` - Upload patient PDF
- `POST /api/v1/patients/{patient_id}/query` - Query with RAG
- `POST /api/v1/patients/{patient_id}/append` - Append to history

### Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Ask Pancreas AI
```

## � State Management

### Chat Store (Zustand)
- Manages user login/logout
- Stores JWT token
- Persists session

### Chat Store (Zustand)
- Manages conversations
- Tracks current message thread
- Stores per-user chat history

## 🎨 Styling

- **Color Scheme**: Medical Blue (#1e54b7), Medical Orange (#ff6f00)
- **Framework**: Tailwind CSS
- **Responsive**: Mobile-first design

## 🔄 Component Flow

```
App
├── Header
├── Routes
│   ├── ChatPage (/)
│   │   ├── Upload Section
│   │   ├── MessageList
│   │   └── ChatInput
│   └── FAQPage (/faq)
└── Disclaimer Footer
```

## 💬 Chat Flow

1. User uploads patient PDF → generates `patient_id`
2. User asks medical question
3. Frontend sends query to backend API
4. Backend retrieves patient history + performs RAG search
5. Claude generates response with sources
6. Frontend displays message + citations

## 🐛 Debugging

### Enable console logging
Add to `config.js`:
```javascript
const DEBUG = true;
```

### Common Issues

1. **CORS errors**: Ensure backend has CORS enabled for frontend origin
2. **API not responding**: Check backend is running at correct URL
3. **Messages not sending**: Verify patient ID is set before querying

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📧 Support for Backend Integration

To fully connect with the PancreasPal API, update:

1. **Patient Endpoints**
   - `POST /api/v1/patients/upload`
   - `POST /api/v1/patients/{patient_id}/query`

2. **Enable CORS** on backend:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 📄 License

MIT

## 🤝 Contributing

Submit issues and pull requests to improve the chatbot interface!

---

**Last Updated**: April 2024

# Chatty

https://chatty.azimb.com

A sleek, local-first AI chatbot UI powered by OpenAI's GPT-4o.  
Built with **React**, **TypeScript**, and **Vite**.


## 🧠 Features

- 💬 Real-time streaming chat with GPT-4o
- ✨ Clean, modern UI with Markdown + code highlighting
- 🔒 Password-protected access (client-side only)
- 💾 Local chat history (via `localStorage`)
- 🧼 Clear Chat and Logout functionality
- 🌐 Deployed easily with Vercel or Netlify


## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/chatty.git
cd chatty
npm install
```

### 2. Add environment variables

Create a `.env` file at the root:

```env
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_APP_PASSWORD=your-password-here
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.


## 🛠 Development

- Code is located in `src/`
- Main entry: `src/App.tsx`
- Chat UI component: `src/components/ChatWindow.tsx`
- Messages: `src/components/MessageBubble.tsx`
- Markdown rendering via `react-markdown`

To modify the UI or add features, start with `App.tsx` or the component files in `/components`.


## 🗺️ Roadmap (Ideas)

- 🔐 Server-side auth (currently just client-side password)
- 🗃️ Export chat history to file
- 📁 File uploads + document Q&A
- 🧠 Switch between models (GPT-3.5, GPT-4o, Claude, etc.)
- 🌍 i18n/localization support
- 📱 Responsive mobile improvements
- 🧩 Plugin/tool support (retrieval, browsing, etc.)

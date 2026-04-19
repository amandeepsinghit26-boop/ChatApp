import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import { useNavigate } from "react-router";
import {
  Menu,
  MessageSquare,
  Plus,
  FolderOpen,
  AlertCircle,
  Settings,
  LogOut,
  Search,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
const Dashboard = () => {
  const [open, setOpen] = useState(false)
  const chat = useChat();
  const auth = useAuth();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initalizeSocketConnection();
    chat.fetchChats();
    
  }, []);

  //Logout handler
  const handleLogout = () => {
    auth.handleLogout();
    navigate("/login");
  };

  const messages = chats[currentChatId]?.messages ?? [];

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top:
        messagesContainerRef.current.scrollHeight -
        messagesContainerRef.current.clientHeight,
      behavior: "smooth",
    });
  }, [messages.length, currentChatId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    chat.handleSendMessage({ message: input, chatId: currentChatId });
    setInput("");

    // Simulate AI response after a short delay
    //   setTimeout(() => {
    //     const aiMessage = {
    //       id: messages.length + 2,
    //       type: 'ai',
    //       text: 'This is a sample AI response. Connect this to your actual API endpoint for real responses.',
    //     }
    //     setMessages((prev) => [...prev, aiMessage])
    //   }, 500)
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex">
      {/* Sidebar */}
 {open && (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
    />
  )}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900/95 border-r border-slate-700/50 p-4 flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            Fi
          </div>
          <span className="font-semibold text-lg">Findora</span>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4">
            <Plus size={18} />
            New Chat
          </button>

          {/* Chat History Section */}
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Chat History
          </div>

          {/* Chat Items */}
          <div className="space-y-2">
            {Object.entries(chats).map(([chatId, chat]) => (
              <ChatItem
                key={chatId}
                title={chat.title}
                onClick={() => openChat(chatId)}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-slate-700" />

          {/* Pin Section */}
          <div className="mt-6 mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Pinned
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold mb-2">New AI features</p>
              <p className="text-xs text-slate-300 mb-3">
                Check out the latest features introduced by Logolupium.
              </p>
              <button className="w-full py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition">
                View Plan
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-400 to-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold"> {user?.username || user?.email || "User"}</p>
                <p className="text-xs text-slate-400">Freemium</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center my-9 gap-2 py-2 text-red-400 hover:bg-red-950/20 rounded-lg transition text-sm font-semibold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-black flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-[100vw] h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="flex mt-0 items-center justify-between mb-[0.65vw]">
            <button onClick={()=> setOpen(true)} className="text-2xl text-slate-400 hover:text-white cursor-pointer transition">☰</button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50">
              <span className="text-sm">Model 2.5</span>
              <span className="text-slate-400">⚙</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="border-slate-700/50 rounded-2xl p-6 backdrop-blur flex flex-col h-full overflow-hidden">
            {/* Messages Area */}

            <div
              ref={messagesContainerRef}
              className="messages flex-1 overflow-y-auto mb-6 space-y-4 pr-4"
            >
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs  lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : " text-slate-100  "
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <h1 className="text-4xl font-light text-white text-center">
                    What's on your mind today?
                  </h1>
                </div>
              )}
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/60 border sticky border-slate-700/50 rounded-xl p-4"
            >
              <div className="flex items-end justify-center px-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message AI chat..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
                  >
                    <Search size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>

            {!chats[currentChatId] ||
              chats[currentChatId].messages.length === 0}
          </div>
        </div>
      </main>
    </div>
  );
};
const NavItem = ({ icon, label, active = false }) => (
  <button
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
      active
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span className="truncate">{label}</span>
  </button>
);

const ChatItem = ({ title, onClick, icon, active = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition text-left group ${
      active
        ? "bg-blue-600/40 text-blue-200 border border-blue-500/50"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span className="truncate text-xs">{title}</span>
  </button>
);

const ActionButton = ({ icon, label }) => (
  <button className="flex flex-col items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-700/50 transition group">
    <span className="text-xl">{icon}</span>
    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition text-center line-clamp-2">
      {label}
    </span>
  </button>
);

export default Dashboard;

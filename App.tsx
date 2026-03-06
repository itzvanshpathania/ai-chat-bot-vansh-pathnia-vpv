import { useRef, useEffect, useState } from 'react';
import { Menu, Bot } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { getSuggestions } from './utils/aiResponses';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { TypingIndicator } from './components/TypingIndicator';

export function App() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    isTyping,
    sendMessage,
    createChat,
    deleteChat,
    clearAllChats,
    setActiveSessionId,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages, isTyping]);

  // Get suggestions based on last bot message
  const lastBotMessage = [...activeSession.messages]
    .reverse()
    .find((m) => m.role === 'assistant');
  const suggestions = lastBotMessage ? getSuggestions(lastBotMessage.content) : [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={createChat}
        onDeleteChat={deleteChat}
        onClearAll={clearAllChats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-lg px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Nova AI</h2>
                <p className="text-[10px] text-green-500 font-medium">
                  {isTyping ? '✍️ Typing...' : '🟢 Online'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-medium text-violet-600 border border-violet-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
              </span>
              AI Powered
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-3xl py-4">
            {activeSession.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            onSend={sendMessage}
            isTyping={isTyping}
            suggestions={suggestions}
          />
        </div>
      </div>
    </div>
  );
}

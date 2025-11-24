"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Trash2, FileText, Bot, User, Sparkles } from "lucide-react";

type ChatbotProps = {
  isDark?: boolean;
  moves?: string | string[];
};

export default function Chatbot({ isDark = true, moves }: ChatbotProps) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Sou seu assistente de xadrez. Analiso posições e tiro dúvidas. Como posso ajudar?", createdAt: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
      fullName: 'Carregando ...',
      username: "Carregando ...",
      email: 'Carregando ...',
      level:  'Carregando ...',
    });

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        setFormData({
          fullName: data.full_name ?? 'Carregando ...',
          username: data.username ?? 'Carregando ...',
          email: data.email ?? 'Carregando ...',
          level: data.level ?? 'Carregando ...',
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadUserInfo();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { sender: formData.fullName, text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { sender: "bot", text: "", createdAt: new Date().toISOString() }]);

      let finalMessagePayload = text;
      if (moves) {
        const movesStr = Array.isArray(moves) ? moves.join(" ") : moves;
        finalMessagePayload = `${formData.fullName}: Contexto do Jogo (PGN/Moves): [${movesStr}]. \n\nPergunta do usuário: ${text}`;
      }

      const response = await fetch("/api/chat/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessagePayload }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro API: ${errorData}`);
      }
      
      if (!response.body) throw new Error("Sem corpo de resposta");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botText += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          newMessages[lastMsgIndex] = { ...newMessages[lastMsgIndex], text: botText };
          return newMessages;
        });
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsgIndex = newMessages.length - 1;
        newMessages[lastMsgIndex] = { 
            ...newMessages[lastMsgIndex], 
            text: " Desculpe, tive um problema técnico ao processar sua jogada." 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  function handleClearChat() {
    setMessages([{ sender: "bot", text: "Chat limpo. Nova análise?", createdAt: new Date().toISOString() }]);
  }

  function handleOpenStudy() {
    if (!moves) return;
    setMessages((prev) => [...prev, { sender: 'system', text: `Contexto do jogo carregado.`, createdAt: new Date().toISOString() }]);
  }

  const BotAvatar = () => (
    <div className={`w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center mr-3 shadow-sm ${isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
      <Bot size={18} />
    </div>
  );

  const UserAvatar = () => (
    <div className={`w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center ml-3 shadow-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
      <User size={18} />
    </div>
  );

  return (
    <aside className={`w-96 h-full flex flex-col border-l transition-colors duration-300 font-sans ${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* Header Elegante */}
      <div className={`flex items-center justify-between px-5 py-4 border-b backdrop-blur-sm ${isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-white/80'}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr">
            <img src="logo/logo-chess.svg" width={200} height={200} />
          </div>
          <h3 className="text-sm font-bold">Neural Gambit AI</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {moves && (moves.length > 0) && (
            <button onClick={handleOpenStudy} title="Verificar Contexto" className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <FileText size={16} />
            </button>
          )}
          <button onClick={handleClearChat} title="Limpar conversa" className={`p-2 rounded-full transition ${isDark ? 'hover:bg-red-900/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-500 hover:text-red-600'}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Área de Chat */}
      <div ref={listRef} className={`flex-1 overflow-y-auto p-5 space-y-6 ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
        {messages.map((m, index) => {
            const isUser = m.sender === 'user';
            const isSystem = m.sender === 'system';
            
            if (isSystem) {
               return (
                 <div key={index} className="flex justify-center my-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      {m.text}
                    </span>
                 </div>
               )
            }

            return (
                <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start items-end'} group`}>
                    {/* Avatar do Bot (lado esquerdo) */}
                    {!isUser && <BotAvatar />}

                    <div className={`
                        relative max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-sm
                        ${isUser 
                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' 
                            : (isDark ? 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm border border-slate-700/50' : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-200')
                        }
                    `}>
                        <div className="whitespace-pre-wrap break-words">
                            {m.text}
                        </div>
                        <div className={`text-[10px] mt-1.5 text-right opacity-60 select-none ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {/* Avatar do Usuário (lado direito) */}
                    {isUser && <UserAvatar />}
                </div>
            );
        })}

        {/* Indicador de Digitação (Typing Indicator) */}
        {isLoading && messages[messages.length - 1].text === "" && (
            <div className="flex justify-start items-end animate-in fade-in duration-300">
                <BotAvatar />
                <div className={`px-5 py-4 rounded-2xl rounded-bl-sm ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Área de Input */}
      <div className={`p-4 border-t ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`relative flex items-center rounded-xl overflow-hidden transition-all ring-1 ${isDark ? 'bg-slate-900 ring-slate-700 focus-within:ring-indigo-500' : 'bg-gray-50 ring-gray-200 focus-within:ring-indigo-500'}`}>
          <input
            type="text"
            disabled={isLoading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isLoading ? "A IA está analisando..." : "Pergunte sobre o lance..."}
            className={`w-full pl-4 pr-12 py-3.5 text-sm bg-transparent outline-none placeholder-opacity-60 
                ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}
                ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-lg transition-all transform active:scale-95
                ${!input.trim() || isLoading 
                    ? 'text-slate-500 cursor-not-allowed opacity-50' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                }
            `}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
            <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Pode cometer erros. Verifique táticas importantes.
            </span>
        </div>
      </div>
    </aside>
  );
}
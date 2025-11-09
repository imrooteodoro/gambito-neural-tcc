"use client";

// Importe os ícones necessários para este componente
import { Bot, User, Send } from 'lucide-react';

export default function ChatSidebar() {
  return (
    // Este é o MESMO código que estava na page.tsx
    <aside className="w-[400px] flex-col bg-slate-800 border-l border-slate-700 flex-shrink-0 hidden lg:flex">
        
      {/* Header do Chat */}
      <div className="flex items-center gap-3 h-16 p-4 border-b border-slate-700">
        <Bot size={20} className="text-purple-400" />
        <h2 className="text-lg font-semibold">Chat Neural Gambit</h2>
      </div>

      {/* Histórico da Conversa (Scrollável) */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* Mensagem da IA */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex-shrink-0 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="p-3 bg-slate-700 rounded-lg rounded-tl-none">
            <p className="text-sm">
              Olá! Estou pronto para analisar sua partida. Qual é o seu primeiro movimento?
            </p>
          </div>
        </div>

        {/* Mensagem do Usuário */}
        <div className="flex flex-row-reverse gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
            <User size={18} />
          </div>
          <div className="p-3 bg-indigo-600 rounded-lg rounded-tr-none">
            <p className="text-sm">
              Joguei e4. O que você acha?
            </p>
          </div>
        </div>
        
      </div>

      {/* Input do Chat (Footer do Chat) */}
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
          <input 
            type="text" 
            placeholder="Pergunte sobre sua jogada..."
            className="flex-1 bg-transparent px-2 text-sm placeholder-slate-400 outline-none"
          />
          <button className="p-2 bg-purple-600 rounded-md hover:bg-purple-500 transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
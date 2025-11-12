"use client";

import { Bot, User, Send } from 'lucide-react';

export default function ChatSidebar({ isDark = true }: { isDark?: boolean }) {
  return (
    <aside className={`w-[400px] flex-col border-l flex-shrink-0 hidden lg:flex transition-colors duration-300 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
        
      {/* Header do Chat */}
      <div className={`flex items-center gap-3 h-16 p-4 border-b transition-colors duration-300 ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <Bot size={20} className="text-purple-400" />
        <h2 className="text-lg font-semibold">Chat Neural Gambit</h2>
      </div>

      {/* Histórico da Conversa (Scrollável) */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* Mensagem da IA */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex-shrink-0 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className={`p-3 rounded-lg rounded-tl-none transition-colors duration-300 ${
            isDark ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <p className="text-sm">
              Olá! Estou pronto para analisar sua partida. Qual é o seu primeiro movimento?
            </p>
          </div>
        </div>

        {/* Mensagem do Usuário */}
        <div className="flex flex-row-reverse gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="p-3 bg-indigo-600 rounded-lg rounded-tr-none">
            <p className="text-sm text-white">
              Joguei e4. O que você acha?
            </p>
          </div>
        </div>

        {/* Mensagem da IA */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex-shrink-0 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className={`p-3 rounded-lg rounded-tl-none transition-colors duration-300 ${
            isDark ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <p className="text-sm">
              Excelente abertura! O movimento e4 controla o centro e libera o bispo e a dama. É uma das aberturas mais populares no xadrez.
            </p>
          </div>
        </div>
        
      </div>

      {/* Input do Chat (Footer do Chat) */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
      }`}>
        <div className={`flex items-center gap-2 rounded-lg p-2 transition-colors duration-300 ${
          isDark ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <input 
            type="text" 
            placeholder="Pergunte sobre sua jogada..."
            className={`flex-1 bg-transparent px-2 text-sm outline-none transition-colors duration-300 ${
              isDark ? 'placeholder-slate-400' : 'placeholder-slate-500'
            }`}
          />
          <button className="p-2 bg-purple-600 rounded-md hover:bg-purple-500 transition-all">
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
}
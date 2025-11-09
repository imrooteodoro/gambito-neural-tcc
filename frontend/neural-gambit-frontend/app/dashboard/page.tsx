"use client";

import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';

// Importando ícones do Lucide
import { 
  Menu, 
  LayoutDashboard, 
  Settings, 
  User, 
  Bot, 
  Send, 
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Estado para controlar a sidebar da esquerda (agora começa fechada)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* =================================================================
      * 1. HEADER GLOBAL (Novo)
      * Toca a tela de lado a lado, como pedido.
      ================================================================= */}
      <header className="flex items-center justify-between h-16 px-4 w-full bg-slate-900 border-b border-slate-700 flex-shrink-0 z-10">
        
        {/* Lado Esquerdo: Hamburger e Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">♞</span>
            <span className="text-xl font-bold hidden sm:block">Neural Gambit</span>
          </Link>
        </div>

        {/* Título Central (Opcional, bom para UX) */}
        <h1 className="text-xl font-semibold hidden md:block">
          Análise de Partida
        </h1>

        {/* Lado Direito: Ícones de Usuário */}
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
            <Bell size={20} />
          </button>
          <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
            SN
          </span>
        </div>
      </header>

      {/* =================================================================
      * 2. CORPO PRINCIPAL (Abaixo do Header)
      * Contém as 3 colunas
      ================================================================= */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- Sidebar da Esquerda (Colapsável) --- */}
        <aside 
          className={`
            flex flex-col bg-slate-800 border-r border-slate-700
            transition-all duration-300 ease-in-out flex-shrink-0
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* Links de Navegação */}
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-purple-700 text-white font-semibold">
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Meu Estudo</span>}
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700">
              <User size={20} />
              {sidebarOpen && <span>Perfil</span>}
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700">
              <Settings size={20} />
              {sidebarOpen && <span>Configurações</span>}
            </a>
          </nav>

          {/* Perfil do Usuário (Footer da Sidebar) */}
          <div className="p-4 border-t border-slate-700">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <img 
                src="https://via.placeholder.com/40" 
                alt="Avatar" 
                className="w-10 h-10 rounded-full" 
              />
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">Seu Nome</p>
                  <p className="text-xs text-slate-400 truncate">seu@email.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* --- Conteúdo Central (Tabuleiro) --- */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          <p className="text-slate-400 pt-6 text-center text-sm">
            Faça seu movimento. A IA irá analisar...
          </p>
          
          {/* Container para centralizar o tabuleiro e impedir scroll */}
          <div className="flex-1 flex justify-center items-center p-4 overflow-hidden">
            <div className="max-w-lg w-full rounded-lg overflow-hidden shadow-2xl shadow-black/50">
              <Chessboard 
                id="MainChessboard" 
              />
            </div>
          </div>
        </main>

        {/* --- Sidebar da Direita (Chat AI) --- */}
        {/* Adicionei 'hidden lg:flex' para esconder o chat em telas menores, melhorando a responsividade */}
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

      </div>
    </div>
  );
}
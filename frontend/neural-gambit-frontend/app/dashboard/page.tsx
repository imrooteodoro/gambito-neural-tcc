"use client";

import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import Link from 'next/link';
import { 
  Menu, 
  LayoutDashboard, 
  Settings, 
  User, 
  Bell,
  BarChart3
} from 'lucide-react';

// 1. IMPORTAÇÕES ATUALIZADAS (camelCase)
import ProfilePage from './profilePage'; 
import ChatSidebar from './chatSidebar'; 
import StatisticsPage from './statisticsPage'; 
import SettingsPage from './settingsPage'; // <-- NOVO COMPONENTE IMPORTADO

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'settings' | 'statistics'>('dashboard');

  // ... (código do ChessboardView) ...
  const ChessboardView = () => (
    <>
      <p className="text-slate-400 pt-6 text-center text-sm">
        Faça seu movimento. A IA irá analisar...
      </p>
      <div className="flex-1 flex justify-center items-center p-4 overflow-hidden">
        <div className="max-w-lg w-full rounded-lg overflow-hidden shadow-2xl shadow-black/50">
          <Chessboard id="MainChessboard" />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* --- Header Global (sem alterações) --- */}
      <header className="flex items-center justify-between h-16 px-4 w-full bg-slate-900 border-b border-slate-700 flex-shrink-0 z-10">
        {/* ... (código do header) ... */}
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
        <h1 className="text-xl font-semibold hidden md:block">
          {activeView === 'dashboard' && 'Análise de Partida'}
          {activeView === 'profile' && 'Meu Perfil'}
          {activeView === 'settings' && 'Configurações'}
          {activeView === 'statistics' && 'Minhas Estatísticas'}
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
            <Bell size={20} />
          </button>
          <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
            SN
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- Sidebar da Esquerda (sem alterações) --- */}
        <aside 
          className={`
            flex flex-col bg-slate-800 border-r border-slate-700
            transition-all duration-300 ease-in-out flex-shrink-0
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* ... (código dos botões do menu) ... */}
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full ${activeView === 'dashboard' ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-slate-700'}`}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Meu Estudo</span>}
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full ${activeView === 'profile' ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-slate-700'}`}
            >
              <User size={20} />
              {sidebarOpen && <span>Perfil</span>}
            </button>
            <button
              onClick={() => setActiveView('statistics')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full ${activeView === 'statistics' ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-slate-700'}`}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>Estatísticas</span>}
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full ${activeView === 'settings' ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-slate-700'}`}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </nav>

          {/* ... (código do footer da sidebar) ... */}
           <div className="p-4 border-t border-slate-700">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <img src="https://via.placeholder.com/40" alt="Avatar" className="w-10 h-10 rounded-full" />
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">Seu Nome</p>
                  <p className="text-xs text-slate-400 truncate">seu@email.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* --- Conteúdo Central --- */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          
          {/* 2. RENDERIZAÇÃO ATUALIZADA */}
          {activeView === 'dashboard' && <ChessboardView />}
          {activeView === 'profile' && <ProfilePage />}
          {activeView === 'statistics' && <StatisticsPage />}
          
          {/* TRECHO SUBSTITUÍDO: O placeholder foi removido */}
          {activeView === 'settings' && <SettingsPage />}

        </main>

        {/* --- Sidebar da Direita (Chat) --- */}
        {activeView === 'dashboard' && <ChatSidebar />}

      </div>
    </div>
  );
}
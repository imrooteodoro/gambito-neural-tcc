"use client";

import React, { useState, useEffect } from 'react';
import {
  Menu,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  BarChart3,
  Sun,
  Moon,
  BookOpen
} from 'lucide-react';

import ChessBoard from '@/components/dashboard/board/boardComponent';
import StatisticsPage from '@/components/dashboard/statisticsPage';
import ProfilePage from '@/components/dashboard/profilePage';
import SettingsPage from '@/components/dashboard/settingsPage';
import StudiesPage from '@/components/dashboard/studiesPage';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    } transition-colors duration-300`}>

      <header className={`flex items-center justify-between h-16 px-4 w-full ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      } border-b flex-shrink-0 z-10 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            } p-2 rounded-full transition-all duration-200`}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">♞</span>
            <span className="text-xl font-bold hidden sm:block">Neural Gambit</span>
          </div>
        </div>

        <h1 className="text-xl font-semibold hidden md:block">
          {activeView === 'dashboard' && ' Dashboard de Estudos'}
          {activeView === 'profile' && 'Meu Perfil'}
          {activeView === 'settings' && 'Configurações'}
          {activeView === 'statistics' && "Estatísticas"}
          {activeView === 'studies' && "Meus Estudos"}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-slate-200 hover:bg-slate-300 text-indigo-600'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={`${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          } p-2 rounded-full transition-all duration-200`}>
            <Bell size={20} />
          </button>

          <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
            SN
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside
          className={`
            flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-r
            transition-all duration-300 ease-in-out flex-shrink-0
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${
                activeView === 'dashboard'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Jogar</span>}
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${
                activeView === 'profile'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <User size={20} />
              {sidebarOpen && <span>Perfil</span>}
            </button>

            <button
              onClick={() => setActiveView('statistics')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${
                activeView === 'statistics'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>Estatísticas</span>}
            </button>

            <button
              onClick={() => setActiveView('studies')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${
                activeView === 'studies'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <BookOpen size={20} />
              {sidebarOpen && <span>Estudos</span>}
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${
                activeView === 'settings'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </nav>

          <div className={`p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'} border-t transition-colors duration-300`}>
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                SN
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">Seu Nome</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>seu@email.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden ${
          isDark ? 'bg-slate-950' : 'bg-slate-50'
        } transition-colors duration-300`}>
          {activeView === 'dashboard' && <ChessBoard isDark={isDark} />}
          {activeView === 'profile' && <ProfilePage isDark={isDark} />}
          {activeView === 'statistics' && <StatisticsPage isDark={isDark} />}
          {activeView === 'settings' && <SettingsPage isDark={isDark} />}
          {activeView === 'studies' && <StudiesPage isDark={isDark} />}
        </main>

      </div>
    </div>
  );
}
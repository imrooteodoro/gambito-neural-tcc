"use client";
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900'
    } flex flex-col relative overflow-hidden transition-colors duration-500`}>
      
      {/* Fundo de grade */}
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]'
          : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'
      } bg-[size:50px_50px]`}></div>
      
      {/* Peças flutuantes */}
      <div className={`absolute top-20 left-10 text-6xl ${isDark ? 'opacity-10' : 'opacity-5'} animate-bounce transition-opacity duration-500`}>♜</div>
      <div className={`absolute bottom-20 right-10 text-6xl ${isDark ? 'opacity-10' : 'opacity-5'} animate-pulse transition-opacity duration-500`}>♞</div>
      <div className={`absolute top-1/2 right-20 text-5xl ${isDark ? 'opacity-10' : 'opacity-5'} animate-bounce transition-opacity duration-500`} style={{animationDelay: '1s'}}>♝</div>
      <div className={`absolute bottom-1/3 left-20 text-5xl ${isDark ? 'opacity-10' : 'opacity-5'} animate-pulse transition-opacity duration-500`} style={{animationDelay: '2s'}}>♛</div>

      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto animate-[slideDown_0.6s_ease-out]">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <span className="text-4xl animate-[float_3s_ease-in-out_infinite]">♞</span>
          <span className="text-2xl font-bold">Neural Gambit</span>
        </div>
        
        {/* Links de Navegação */}
        <div className="flex items-center gap-4">
          <Link href="/login" className={`text-sm font-medium ${
            isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          } transition-all px-4 py-2 rounded-lg`}>
            Fazer Login
          </Link>

          <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0">
            Criar Conta
          </Link>

          {/* Toggle de Tema */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-300 ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-slate-200 hover:bg-slate-300 text-indigo-600'
            }`}
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Seção Hero */}
      <main className="flex-1 flex items-center justify-center text-center p-8 relative z-10">
        <div className="max-w-3xl flex flex-col items-center animate-[slideUp_0.8s_ease-out]">
          
          {/* Badge */}
          <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6 shadow-lg">
            ✨ POWERED BY AI
          </span>

          {/* Título */}
          <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-white via-slate-100 to-purple-300'
              : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-700'
          }`}>
            Domine o Xadrez com seu Mestre Pessoal de IA
          </h1>
          
          {/* Subtítulo */}
          <p className={`text-lg md:text-xl ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } max-w-2xl mb-10 transition-colors duration-500`}>
            O Neural Gambit usa IA generativa e NLP para analisar suas partidas, 
            ensinar táticas e levar seu jogo para o próximo nível. 
            De iniciante a especialista.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-base tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0">
              Começar Agora
            </Link>

            <Link href="/features" className={`w-full sm:w-auto py-4 px-8 rounded-xl font-semibold text-base backdrop-blur-sm transition-all duration-500 ${
              isDark
                ? 'bg-slate-700 bg-opacity-50 text-white border border-slate-600 hover:bg-slate-600'
                : 'bg-white bg-opacity-70 text-slate-900 border border-slate-300 hover:bg-slate-100'
            }`}>
              Saber Mais
            </Link>
          </div>
        </div>
      </main>

      {/* Animações */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
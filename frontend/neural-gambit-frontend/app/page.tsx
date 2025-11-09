"use client";
import React from 'react';
import Link from 'next/link'; // Importe o Link do Next.js para navegação

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
      
      {/* Fundo de grade e peças flutuantes
        (Reutilizados da sua SignupPage)
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce">♜</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse">♞</div>
      <div className="absolute top-1/2 right-20 text-5xl opacity-10 animate-bounce" style={{animationDelay: '1s'}}>♝</div>
      <div className="absolute bottom-1/3 left-20 text-5xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}>♛</div>

      {/* Barra de Navegação (Navbar) 
      */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto animate-[slideDown_0.6s_ease-out]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-4xl animate-[float_3s_ease-in-out_infinite]">♞</span>
          <span className="text-2xl font-bold">Neural Gambit</span>
        </Link>
        
        {/* Links de Navegação */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-all px-4 py-2 rounded-lg">
            Fazer Login
          </Link>
          {/* Botão de CTA principal, com o mesmo estilo do signup */}
          <Link 
            href="/signup" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0"
          >
            Criar Conta
          </Link>
        </div>
      </nav>

      {/* Seção "Hero" Principal
      */}
      <main className="flex-1 flex items-center justify-center text-center p-8 relative z-10">
        <div className="max-w-3xl flex flex-col items-center animate-[slideUp_0.8s_ease-out]">
          
          {/* Badge "Powered by AI" (Reutilizado) */}
          <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6">
            ✨ POWERED BY AI
          </span>

          {/* Título Principal (H1) */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-300">
            Domine o Xadrez com seu Mestre Pessoal de IA
          </h1>
          
          {/* Subtítulo (Descrição) */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
            O Neural Gambit usa IA generativa e NLP para analisar suas partidas, 
            ensinar táticas e levar seu jogo para o próximo nível. 
            De iniciante a especialista.
          </p>

          {/* Botões de Ação (CTAs) */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* CTA Primário (link para /signup) */}
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-base tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0"
            >
              Começar Agora
            </Link>
            {/* CTA Secundário (Ex: para uma página de "funcionalidades") */}
            <Link 
              href="/features" 
              className="w-full sm:w-auto bg-slate-700 bg-opacity-50 text-white py-4 px-8 rounded-xl font-semibold text-base backdrop-blur-sm border border-slate-600 hover:bg-slate-600 transition-all"
            >
              Saber Mais
            </Link>
          </div>
        </div>
      </main>

      {/* CSS para as novas animações
        (A `slideUp` e `float` você já tinha)
      */}
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
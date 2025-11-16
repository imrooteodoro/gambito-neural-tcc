"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Ícones para as funcionalidades
import { SquareEqual, Brain, Award, GraduationCap, Zap } from 'lucide-react';

export default function FeaturesPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
      
      {/* Fundo de grade e peças flutuantes (Idêntico ao Login/Signup) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-20 left-10 text-6xl opacity-10">♜</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10">♞</div>
      
      {/* Barra de Navegação Simples */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-4xl">♞</span>
          <span className="text-2xl font-bold">Neural Gambit</span>
        </Link>
        <Link 
          href="/signup" 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0"
        >
          Criar Conta Grátis
        </Link>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 relative z-10">
        <div className="max-w-4xl w-full">
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-300">
            Aprenda, Analise, Vença.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            O futuro do treinamento de xadrez está aqui. Conheça as ferramentas que a IA oferece.
          </p>

          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Card 1: Análise de Partidas */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all shadow-xl">
              <div className="bg-purple-600 p-3 w-min rounded-lg mb-4">
                <SquareEqual size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Análise de IA em Tempo Real</h3>
              <p className="text-slate-400">
                Carregue suas partidas e receba análises detalhadas. A IA aponta erros, identifica imprecisões e sugere os melhores lances.
              </p>
            </div>

            {/* Card 2: Chatbot Terapêutico */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all shadow-xl">
              <div className="bg-indigo-600 p-3 w-min rounded-lg mb-4">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mestre de Xadrez Pessoal</h3>
              <p className="text-slate-400">
                Converse com o nosso Chatbot. Faça perguntas sobre aberturas complexas, táticas específicas ou receba lições interativas sob demanda.
              </p>
            </div>

            {/* Card 3: Estatísticas de Desempenho */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-yellow-500 transition-all shadow-xl">
              <div className="bg-yellow-600 p-3 w-min rounded-lg mb-4">
                <Award size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Estatísticas e Progresso</h3>
              <p className="text-slate-400">
                Acompanhe seu Rating (ELO), veja sua taxa de vitória por cor (brancas/pretas) e monitore seu progresso nas suas aberturas favoritas.
              </p>
            </div>

            {/* Card 4: Plano de Estudo */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 transition-all shadow-xl md:col-span-2">
              <div className="bg-green-600 p-3 w-min rounded-lg mb-4">
                <GraduationCap size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Planos de Estudo Personalizados</h3>
              <p className="text-slate-400">
                Com base no seu nível atual e seus erros mais comuns, a IA cria um currículo de treinamento focado em melhorar suas fraquezas, desde o básico até o nível de GM.
              </p>
            </div>
            
            {/* Card 5: Velocidade */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 transition-all shadow-xl">
              <div className="bg-red-600 p-3 w-min rounded-lg mb-4">
                <Zap size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Desempenho Otimizado</h3>
              <p className="text-slate-400">
                Tecnologia de ponta garante que suas análises e o chatbot respondam instantaneamente.
              </p>
            </div>

          </div>

          {/* CTA Final */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-4">Pronto para Dominar o Tabuleiro?</h2>
            <Link 
              href="/signup" 
              className="inline-block w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-semibold text-lg tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/50 transition-all"
            >
              Comece a Jogar Agora
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
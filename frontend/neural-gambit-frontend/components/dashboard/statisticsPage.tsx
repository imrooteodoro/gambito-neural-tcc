"use client";

import React from 'react';
// Importe os componentes do Recharts
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Trophy, Zap, CheckCircle } from 'lucide-react';

// --- Dados Fictícios (Substitua pelos seus dados) ---

// 1. Desempenho ao longo do tempo (Rating)
const ratingData = [
  { name: 'Jan', rating: 800 },
  { name: 'Fev', rating: 850 },
  { name: 'Mar', rating: 920 },
  { name: 'Abr', rating: 900 },
  { name: 'Mai', rating: 1050 },
  { name: 'Jun', rating: 1100 },
];

// 2. Taxa de Vitória (Brancas vs. Pretas)
const winRateData = [
  { name: 'Partidas de Brancas', vitorias: 40, derrotas: 20, empates: 10 },
  { name: 'Partidas de Pretas', vitorias: 30, derrotas: 25, empates: 15 },
];

// 3. Aberturas Favoritas (Gráfico de Pizza)
const openingsData = [
  { name: 'Defesa Siciliana', value: 25 },
  { name: 'Gambito da Dama', value: 18 },
  { name: 'Ruy López', value: 15 },
  { name: 'Outras', value: 42 },
];
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042'];

// --- Componente da Página ---

export default function StatisticsPage({ isDark = true }: { isDark?: boolean }) {
  return (
    <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Minhas Estatísticas
      </h1>

      {/* Seção de Destaques (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <Trophy className="w-10 h-10 text-yellow-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Taxa de Vitória
            </p>
            <p className="text-2xl font-bold">58%</p>
          </div>
        </div>
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <Zap className="w-10 h-10 text-purple-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Rating Atual
            </p>
            <p className="text-2xl font-bold">1100</p>
          </div>
        </div>
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <CheckCircle className="w-10 h-10 text-green-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total de Partidas
            </p>
            <p className="text-2xl font-bold">158</p>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Desempenho ao Longo do Tempo */}
        <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-4">Desempenho (Rating)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={ratingData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#334155' : '#e2e8f0'} 
                />
                <XAxis 
                  dataKey="name" 
                  stroke={isDark ? '#94a3b8' : '#64748b'} 
                />
                <YAxis 
                  stroke={isDark ? '#94a3b8' : '#64748b'} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? 'none' : '1px solid #e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Vitórias/Derrotas */}
        <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-4">Resultado (Brancas vs. Pretas)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={winRateData} layout="vertical">
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#334155' : '#e2e8f0'} 
                />
                <XAxis 
                  type="number" 
                  stroke={isDark ? '#94a3b8' : '#64748b'} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke={isDark ? '#94a3b8' : '#64748b'} 
                  width={120} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? 'none' : '1px solid #e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Legend />
                <Bar dataKey="vitorias" stackId="a" fill="#82ca9d" />
                <Bar dataKey="derrotas" stackId="a" fill="#ff8042" />
                <Bar dataKey="empates" stackId="a" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Aberturas (Exemplo) */}
         <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-4">Aberturas Favoritas</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={openingsData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  label
                >
                  {openingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? 'none' : '1px solid #e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
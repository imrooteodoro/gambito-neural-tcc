"use client";

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Trophy, Zap, CheckCircle, Loader2, Brain } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

interface DashboardStats {
  kpis: {
    winRate: string;
    currentRating: number;
    totalGames: number;
  };
  ratingData: any[];
  winRateData: any[];
  openingsData: any[];
}

// Adicionei ": React.ReactNode" para evitar o erro "Cannot find namespace JSX"
export default function StatisticsPage({ isDark = true }: { isDark?: boolean }): React.ReactNode {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/studies/statistics');
        
        if (!response.ok) throw new Error('Falha ao carregar dados');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar as estatísticas.');
      } finally {
        // Pequeno delay para apreciar a animação :)
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchData();
  }, []);

  // --- TELA DE CARREGAMENTO (Nova Animação) ---
  if (loading) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center h-full transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="flex flex-col items-center animate-pulse">
          {/* Ícone girando */}
          <Loader2 className="w-12 h-12 mb-4 animate-spin text-purple-500" />
          
          {/* Título do App */}
          <h2 className="text-2xl font-bold mb-2 tracking-wide">
            Neural Gambit
          </h2>
          
          {/* Texto de Status */}
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Carregando os dados...
          </p>
        </div>
      </div>
    );
  }

  // --- Tratamento de Erro ---
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="text-red-500 mb-2">
          <Zap className="w-12 h-12" />
        </div>
        <p className="text-xl font-bold mb-2">Ops!</p>
        <p className="text-sm opacity-70">{error}</p>
      </div>
    );
  }

  // Se não houver dados após carregar
  if (!stats) return null;

  return (
    <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Minhas Estatísticas
      </h1>

      {/* Seção de Destaques (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1 */}
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <Trophy className="w-10 h-10 text-yellow-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Taxa de Vitória
            </p>
            <p className="text-2xl font-bold">{stats.kpis.winRate}</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <Zap className="w-10 h-10 text-purple-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Rating Atual
            </p>
            <p className="text-2xl font-bold">{stats.kpis.currentRating}</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-6 rounded-lg border flex items-center gap-4 transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <CheckCircle className="w-10 h-10 text-green-400" />
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total de Partidas
            </p>
            <p className="text-2xl font-bold">{stats.kpis.totalGames}</p>
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
              <LineChart data={stats.ratingData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#334155' : '#e2e8f0'} 
                />
                <XAxis 
                  dataKey="name" 
                  stroke={isDark ? '#94a3b8' : '#64748b'} 
                />
                <YAxis 
                  domain={['auto', 'auto']}
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
              <BarChart data={stats.winRateData} layout="vertical">
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
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? 'none' : '1px solid #e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Legend />
                <Bar dataKey="vitorias" stackId="a" fill="#82ca9d" name="Vitórias" />
                <Bar dataKey="derrotas" stackId="a" fill="#ff8042" name="Derrotas" />
                <Bar dataKey="empates" stackId="a" fill="#8884d8" name="Empates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Aberturas */}
         <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-4">Aberturas Favoritas</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={stats.openingsData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  // CORREÇÃO: Usando (percent || 0) para evitar undefined
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {stats.openingsData.map((entry: any, index: number) => (
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

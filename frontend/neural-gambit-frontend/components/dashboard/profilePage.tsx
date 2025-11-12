"use client";

import React, { useState } from 'react';
// Ícones para a página
import { User, Mail, KeySquare, Upload, Save, Trash2, Shield } from 'lucide-react';

export default function ProfilePage({ isDark = true }: { isDark?: boolean }) {
  const [formData, setFormData] = useState({
    fullName: 'Seu Nome',
    username: 'seunome',
    email: 'seu@email.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil atualizado!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Senha atualizada!');
  };

  return (
    <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Meu Perfil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna da Esquerda: Avatar */}
        <div className="md:col-span-1">
          <div className={`p-6 rounded-lg shadow-lg border flex flex-col items-center transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <img 
              src="https://via.placeholder.com/150"
              alt="Avatar"
              className="w-36 h-36 rounded-full mb-4 border-4 border-purple-500"
            />
            <h2 className="text-xl font-semibold">{formData.fullName}</h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              @{formData.username}
            </p>
            <button className={`mt-4 w-full flex items-center justify-center gap-2 text-sm py-2 px-4 rounded-lg transition-all ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}>
              <Upload size={16} />
              Mudar Foto
            </button>
          </div>
        </div>

        {/* Coluna da Direita: Formulários */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Card: Informações Pessoais */}
          <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <User /> Informações Pessoais
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-4 outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 focus:ring-purple-900/50' 
                      : 'bg-white border-slate-300 focus:ring-purple-200'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="username" className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-4 outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 focus:ring-purple-900/50' 
                      : 'bg-white border-slate-300 focus:ring-purple-200'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all cursor-not-allowed ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-400' 
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          {/* Card: Segurança (Mudar Senha) */}
          <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Shield /> Segurança
            </h3>
            <div className="space-y-4">
               <div>
                <label htmlFor="currentPassword" className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-4 outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 focus:ring-purple-900/50' 
                      : 'bg-white border-slate-300 focus:ring-purple-200'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-4 outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 focus:ring-purple-900/50' 
                      : 'bg-white border-slate-300 focus:ring-purple-200'
                  }`}
                />
              </div>
               <div className="flex justify-end pt-4">
                <button
                  onClick={handleUpdatePassword}
                  className={`flex items-center justify-center gap-2 text-sm py-3 px-6 rounded-lg font-semibold transition-all ${
                    isDark 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                  }`}
                >
                  <KeySquare size={18} />
                  Atualizar Senha
                </button>
              </div>
            </div>
          </div>

          {/* Card: Zona de Perigo */}
          <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark ? 'bg-slate-900/50 border-red-900/50' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-red-400">
              Zona de Perigo
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Esta ação é irreversível. Todos os seus dados, partidas e análises serão permanentemente excluídos.
            </p>
            <button className="bg-red-700 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center gap-2">
              <Trash2 size={18} />
              Deletar Minha Conta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
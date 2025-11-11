"use client";

import React, { useState } from 'react';
// Ícones para a página
import { User, Mail, KeySquare, Upload, Save, Trash2, Shield } from 'lucide-react';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'Seu Nome',
    username: 'seunome',
    email: 'seu@email.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-bold mb-8 text-white">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna da Esquerda: Avatar */}
        <div className="md:col-span-1">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 flex flex-col items-center">
            <img 
              src="https://via.placeholder.com/150"
              alt="Avatar"
              className="w-36 h-36 rounded-full mb-4 border-4 border-purple-500"
            />
            <h2 className="text-xl font-semibold">{formData.fullName}</h2>
            <p className="text-sm text-slate-400">@{formData.username}</p>
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-sm py-2 px-4 rounded-lg transition-all">
              <Upload size={16} />
              Mudar Foto
            </button>
          </div>
        </div>

        {/* Coluna da Direita: Formulários */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Card: Informações Pessoais */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3"><User /> Informações Pessoais</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-400 mb-2">Nome Completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-900/50 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-400 mb-2">Nome de Usuário</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-900/50 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-400 mb-2">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled // Geralmente e-mail é mais díficil de mudar
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl outline-none transition-all text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Card: Segurança (Mudar Senha) */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3"><Shield /> Segurança</h3>
            <form className="space-y-4">
               <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-400 mb-2">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-900/50 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-400 mb-2">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-900/50 outline-none transition-all"
                />
              </div>
               <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-sm py-3 px-6 rounded-lg font-semibold transition-all"
                >
                  <KeySquare size={18} />
                  Atualizar Senha
                </button>
              </div>
            </form>
          </div>

          {/* Card: Zona de Perigo */}
          <div className="bg-slate-900/50 p-6 rounded-lg shadow-lg border border-red-900/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-red-400">Zona de Perigo</h3>
            <p className="text-sm text-slate-400 mb-4">
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
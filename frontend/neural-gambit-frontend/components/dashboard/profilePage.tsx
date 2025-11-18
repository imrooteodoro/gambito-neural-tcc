"use client";

import React, { useEffect, useState } from 'react';
import { User, Mail, KeySquare, Upload, Save, Trash2, Shield } from 'lucide-react';

export default function ProfilePage({ isDark = true }: { isDark?: boolean }) {
  const [formData, setFormData] = useState({
    fullName: 'Carregando ...',
    username: "Carregando ...",
    email: 'Carregando ...',
    level:  'Carregando ...',
  });

  // ESTADO DE LOADING CORRETO
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();

        setFormData({
          fullName: data.full_name ?? 'Carregando ...',
          username: data.username ?? 'Carregando ...',
          email: data.email ?? 'Carregando ...',
          level: data.level ?? 'Carregando ...',
        });
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }

    loadUser();
  }, []);

  // FUNÇÃO DELETE FUNCIONANDO
  async function handleDelete() {
    if (!confirm("Tem certeza que deseja deletar sua conta?")) return;

    setLoading(true);

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Erro ao deletar: " + data.error);
        console.error("Erro:", data);
        return;
      }

      alert("Conta deletada com sucesso!");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Erro ao deletar conta.");
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Coluna da Esquerda */}
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

        {/* Coluna da Direita */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Informações Pessoais */}
          <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <User /> Informações Pessoais
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-semibold mb-2">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 rounded-xl bg-slate-900/10 cursor-not-allowed"
                />

                <label className="block text-sm font-semibold mb-2 mt-4">Level</label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Shield /> Segurança
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Senha Atual</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nova Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleUpdatePassword}
                  className="flex items-center justify-center gap-2 bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold"
                >
                  <KeySquare size={18} />
                  Atualizar Senha
                </button>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className={`p-6 rounded-lg shadow-lg border ${
            isDark ? 'bg-slate-900/50 border-red-900/50' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-red-400">
              Zona de Perigo
            </h3>

            <p className="text-sm mb-4">
              Esta ação é irreversível. Todos os seus dados, partidas e análises serão permanentemente excluídos.
            </p>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2"
            >
              <Trash2 size={18} />
              {loading ? "Deletando..." : "Deletar Minha Conta"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

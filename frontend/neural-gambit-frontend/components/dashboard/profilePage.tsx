"use client";

import React, { useEffect, useState } from 'react';
import { User, Mail, KeySquare, Upload, Save, Trash2, Shield, X } from 'lucide-react';

export default function ProfilePage({ isDark = true }: { isDark?: boolean }) {
  const [formData, setFormData] = useState({
    fullName: 'Carregando ...',
    username: "Carregando ...",
    email: 'Carregando ...',
    level:  'Carregando ...',
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

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

  async function handleDeleteConfirm() {
    setLoading(true);

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Erro ao deletar: " + data.error);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar conta.");
    } finally {
      setLoading(false);
    }
  }

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
    <>
      {/* ========================= */}
      {/*        MODAL DELETE       */}
      {/* ========================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-red-700/40">
            
            {/* Fechar */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
              <Trash2 /> Deletar Conta
            </h2>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Esta ação <strong className="text-red-400">não pode ser desfeita</strong>.<br/>
              Para confirmar, digite abaixo:
            </p>

            <p className="mt-3 font-mono text-sm bg-slate-800 py-2 px-3 rounded border border-slate-700">
              delete <span className="text-purple-400">{formData.username}</span>
            </p>

            <input
              type="text"
              placeholder="Digite exatamente aqui..."
              className="mt-4 w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none text-white"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />

            <button
              onClick={handleDeleteConfirm}
              disabled={deleteInput !== `delete ${formData.username}` || loading}
              className={`mt-6 w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
                ${deleteInput === `delete ${formData.username}` && !loading
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-red-900 cursor-not-allowed text-slate-500"
                }`}
            >
              {loading ? "Deletando..." : <><Trash2 size={18}/> Confirmar Exclusão</>}
            </button>

          </div>
        </div>
      )}

      {/* ========================= */}
      {/*   RESTO DA SUA PÁGINA    */}
      {/* ========================= */}

      <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <h1 className="text-3xl font-bold mb-8">
          Meu Perfil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Coluna Esquerda */}
          <div className="md:col-span-1">
            <div className={`p-6 rounded-lg shadow-lg border flex flex-col items-center ${
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
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="md:col-span-2 space-y-8">

            {/* Informações Pessoais */}
            <div className={`p-6 rounded-lg shadow-lg border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xl font-bold flex items-center gap-3">
                <User /> Informações Pessoais
              </h3>

              <div className="space-y-4 mt-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none"
                />

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 rounded-xl bg-slate-900/10 cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>

            {/* Zona de Perigo */}
            <div className={`p-6 rounded-lg shadow-lg border ${
              isDark ? 'bg-slate-900/50 border-red-900/50' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-red-400">
                Zona de Perigo
              </h3>

              <p className="text-sm mb-4">
                Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-700 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2"
              >
                <Trash2 size={18} /> Deletar Minha Conta
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

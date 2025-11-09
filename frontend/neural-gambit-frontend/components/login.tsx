"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Importe o Link para navegação

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      alert('Por favor, preencha e-mail e senha.');
      return;
    }
    console.log('Login submitted:', formData);
    alert('Login realizado com sucesso! 🎉');
    // Aqui você faria a lógica de login (ex: chamar uma API)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fundo de grade e peças flutuantes (Idêntico) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce">♜</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse">♞</div>
      <div className="absolute top-1/2 right-20 text-5xl opacity-10 animate-bounce" style={{animationDelay: '1s'}}>♝</div>
      
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 animate-[slideUp_0.6s_ease-out]">
        
        {/* Logo Section (Idêntico) */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 inline-block animate-[float_3s_ease-in-out_infinite]">♞</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Neural Gambit</h1>
          <p className="text-gray-600 text-sm mb-3">Aprenda xadrez com inteligência artificial</p>
          <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide">
            ✨ POWERED BY AI
          </span>
        </div>

        <div>
          {/* Email Input (Idêntico) */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300"
            />
          </div>

          {/* Password Input (Idêntico) */}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Sua senha"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300"
            />
          </div>

          {/* Forgot Password Link (Novo) */}
          <div className="flex justify-end text-xs text-gray-500 mb-6 -mt-3">
            <Link href="/forgot-password">
              <span className="text-purple-600 hover:underline cursor-pointer">
                Esqueceu sua senha?
              </span>
            </Link>
          </div>

          {/* Submit Button (Texto alterado) */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-sm tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0"
          >
            Entrar
          </button>
        </div>

        {/* Divider (Texto alterado) */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-gray-500">Ou entre com</span>
          </div>
        </div>

        {/* Social Login (Idêntico) */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all font-semibold text-sm text-gray-700">
            Google
          </button>
          <button className="flex-1 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all font-semibold text-sm text-gray-700">
            GitHub
          </button>
        </div>

        {/* Signup Link (Link e texto alterados) */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/signup">
            <span className="text-purple-600 font-semibold hover:underline cursor-pointer">
              Crie uma agora
            </span>
          </Link>
        </p>
      </div>

      {/* Animações (Idênticas) */}
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    level: '',
    terms: false
  });
  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async () => {
  if (!formData.name || !formData.email || !formData.password || !formData.level || !formData.terms) {
    alert("Por favor, preencha todos os campos e aceite os termos.");
    return;
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        user_name: formData.username,
        email: formData.email,
        password: formData.password,
        level: formData.level,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar");
    }

    const result = await response.json();
    console.log("Usuário registrado:", result);

    // alert("Cadastro realizado com sucesso! 🎉");
    router.push("/email");

  } catch (error) {
    console.error(error);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Animated floating chess pieces */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce">♜</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse">♞</div>
      <div className="absolute top-1/2 right-20 text-5xl opacity-10 animate-bounce" style={{animationDelay: '1s'}}>♝</div>
      
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 animate-[slideUp_0.6s_ease-out]">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 inline-block animate-[float_3s_ease-in-out_infinite]">♞</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Neural Gambit</h1>
          <p className="text-gray-600 text-sm mb-3">Aprenda xadrez com inteligência artificial</p>
          
        </div>

        <div>
          {/* Name Input */}
          <div className="mb-5">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300"
            />
          </div>

          {/* Username Input */}
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Escolha um nome de usuário"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300"
            />
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
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
              placeholder="Crie uma senha forte"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300"
            />
          </div>

          {/* Level Select */}
          <div className="mb-5">
            <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
              Nível de Xadrez
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none hover:border-gray-300 bg-white"
            >
              <option value="">Selecione seu nível</option>
              <option value="beginner">Iniciante - Estou começando agora</option>
              <option value="intermediate">Intermediário - Conheço o básico</option>
              <option value="advanced">Avançado - Jogo regularmente</option>
              <option value="expert">Especialista - Competitivo</option>
            </select>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-xs text-gray-600 cursor-pointer">
              Eu aceito os <span className="text-purple-600 hover:underline cursor-pointer">termos de uso</span> e a <span className="text-purple-600 hover:underline cursor-pointer">política de privacidade</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-sm tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all active:translate-y-0"
          >
            Criar Conta
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Já tem uma conta? <Link href="/login" className="text-purple-600 font-semibold hover:underline cursor-pointer">Fazer login</Link>
        </p>
      </div>

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
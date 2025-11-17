"use client";

import Link from 'next/dist/client/link';


export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 animate-[slideUp_0.6s_ease-out]">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 inline-block animate-[float_3s_ease-in-out_infinite]">♞</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Verifique seu E-mail</h1>
          <p className="text-gray-600">Um link de verificação foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada e siga as instruções para ativar sua conta.</p>
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300">
            Voltar para Login
          </Link>
        </div>
      </div>
    </div>
  );
}
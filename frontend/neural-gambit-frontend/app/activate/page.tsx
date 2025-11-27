"use client";


export default function ActivatePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Ativação de Conta</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Sua conta foi ativada com sucesso! Você já pode fazer login e começar a usar o Neural Gambit.
        </p>
        <a
          href="/login"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Ir para a Página de Login
        </a>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Palette, Languages, Bell, Save, Moon, Sun, Info } from "lucide-react";

function SettingsToggle({
  label,
  icon: Icon,
  enabled,
  onToggle,
  isDark,
}: {
  label: string;
  icon: any;
  enabled: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
      isDark ? 'bg-slate-700' : 'bg-slate-100'
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        <span className="font-medium">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`
          w-12 h-6 rounded-full flex items-center p-1 transition-colors
          ${enabled ? "bg-purple-600 justify-end" : isDark ? "bg-slate-600 justify-start" : "bg-slate-300 justify-start"}
        `}
      >
        <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" />
      </button>
    </div>
  );
}

// Componente de Select
function SettingsSelect({
  label,
  icon: Icon,
  value,
  onChange,
  children,
  isDark,
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
      isDark ? 'bg-slate-700' : 'bg-slate-100'
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        <span className="font-medium">{label}</span>
      </div>
      <select
        value={value}
        onChange={onChange}
        className={`px-3 py-1 border rounded-md text-sm outline-none transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900 border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-900/50' 
            : 'bg-white border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
        }`}
      >
        {children}
      </select>
    </div>
  );
}

export default function SettingsPage({ isDark = true }: { isDark?: boolean }) {
  const [boardColor, setBoardColor] = useState("brown");
  const [language, setLanguage] = useState("pt-br");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    alert("Configurações salvas!");
  };

  return (
    <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Configurações
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Aparência */}
        <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Palette /> Aparência
          </h3>
          <div className="space-y-4">
            <SettingsSelect
              label="Cor do Tabuleiro"
              icon={Palette}
              value={boardColor}
              onChange={(e) => setBoardColor(e.target.value)}
              isDark={isDark}
            >
              <option value="brown">Padrão (Marrom)</option>
              <option value="green">Verde</option>
              <option value="blue">Azul</option>
              <option value="grey">Cinza</option>
            </SettingsSelect>
          </div>
        </div>

        {/* Preferências */}
        <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Languages /> Preferências
          </h3>
          <div className="space-y-4">
            <SettingsSelect
              label="Idioma"
              icon={Languages}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              isDark={isDark}
            >
              <option value="pt-br">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </SettingsSelect>
          </div>
        </div>

        {/* Notificações */}
        <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Bell /> Notificações
          </h3>
          <div className="space-y-4">
            <SettingsToggle
              label="Notificações por E-mail"
              icon={Bell}
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
              isDark={isDark}
            />
            <SettingsToggle
              label="Análises no E-mail"
              icon={Info}
              enabled={false}
              onToggle={() => {}}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
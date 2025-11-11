"use client";

import React, { useState } from "react";
import { Palette, Languages, Bell, Save, Moon, Sun, Info } from "lucide-react";
import { useTheme } from "next-themes";

// Componente de toggle reutilizável
function SettingsToggle({
  label,
  icon: Icon,
  enabled,
  onToggle,
}: {
  label: string;
  icon: any;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className="font-medium">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`
          w-12 h-6 rounded-full flex items-center p-1 transition-colors
          ${enabled ? "bg-purple-600 justify-end" : "bg-slate-600 justify-start"}
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
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className="font-medium">{label}</span>
      </div>
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-1 bg-slate-900 border border-slate-600 rounded-md text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900/50"
      >
        {children}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  // Corrigido: desestruturação correta do useTheme()
  const { theme, setTheme } = useTheme();

  const [boardColor, setBoardColor] = useState("brown");
  const [language, setLanguage] = useState("pt-br");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    alert("Configurações salvas!");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-bold mb-8 text-white">Configurações</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Aparência */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Palette /> Aparência
          </h3>
          <div className="space-y-4">
            <SettingsToggle
              label="Tema Escuro"
              icon={theme === "dark" ? Moon : Sun}
              enabled={theme === "dark"}
              onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <SettingsSelect
              label="Cor do Tabuleiro"
              icon={Palette}
              value={boardColor}
              onChange={(e) => setBoardColor(e.target.value)}
            >
              <option value="brown">Padrão (Marrom)</option>
              <option value="green">Verde</option>
              <option value="blue">Azul</option>
              <option value="grey">Cinza</option>
            </SettingsSelect>
          </div>
        </div>

        {/* Preferências */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Languages /> Preferências
          </h3>
          <div className="space-y-4">
            <SettingsSelect
              label="Idioma"
              icon={Languages}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="pt-br">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </SettingsSelect>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Bell /> Notificações
          </h3>
          <div className="space-y-4">
            <SettingsToggle
              label="Notificações por E-mail"
              icon={Bell}
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
            />
            <SettingsToggle
              label="Análises no E-mail"
              icon={Info}
              enabled={false}
              onToggle={() => {}}
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

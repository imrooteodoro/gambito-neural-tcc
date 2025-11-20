"use client";

import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function StudiesPage({ isDark = true }: { isDark?: boolean }) {
  const [studies, setStudies] = useState<Array<{ id: string; study_data: string; created_at: string }>>([]);

  useEffect(() => {
    async function fetchStudies() {
      try {
        const response = await fetch("/api/studies/get");
        const data = await response.json();
        setStudies(data.studies);
      } catch (error) {
        console.error("Erro ao buscar estudos:", error);
      }
    }

    fetchStudies();
  }, []);

  return (
    <div className={`p-6 min-h-screen w-full overflow-y-auto transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <div className={`max-w-5xl mx-auto space-y-6 rounded-3xl border p-6 shadow-2xl transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-900/70 shadow-black/40"
          : "border-slate-200 bg-white/80 shadow-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <BookOpen className={`w-6 h-6 ${isDark ? "text-white" : "text-slate-900"}`} />
          <h2 className="text-2xl font-bold">
            Meus Estudos
          </h2>
        </div>

        {studies.length === 0 ? (
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Nenhum estudo encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {studies.map((study) => (
              <li
                key={study.id}
                className={`p-5 border rounded-2xl transition-colors duration-300 ${
                  isDark
                    ? "bg-slate-950 border-slate-800 shadow-lg shadow-black/40"
                    : "bg-white border-slate-200 shadow-lg shadow-slate-200/70"
                }`}
              >
                {/* <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <strong>ID do Estudo:</strong> {study.id}
                </p>
                <p className={`text-sm whitespace-pre-wrap mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  <strong>Dados do Estudo:</strong> {study.study_data}
                </p> */}
                <p className={`text-sm mt-3 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                  <strong>Criado em:</strong> {new Date(study.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
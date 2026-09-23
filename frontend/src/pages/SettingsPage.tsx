import React from 'react';
import { Settings, ShieldCheck, Database, Key, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2D5A3C]" />
          Paramètres
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configuration technique de l'application et options d'architecture.
        </p>
      </div>

      <div className="space-y-4">
        {/* Architecture & Backend */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#EAF3EB] text-[#2D5A3C] border border-[#D5E6D8]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-stone-800">Point de terminaison Spring Boot</h3>
              <p className="text-[11px] text-stone-500">
                L'infrastructure utilise une couche 3-tiers : Axios (`api.ts`) → Service (`taskService.ts`) → Hooks (`useTasks.ts`)
              </p>
            </div>
          </div>
          <div className="bg-[#F7F5EF] p-3 rounded-xl border border-[#E6E2D7] text-xs font-mono text-stone-700">
            Proxy Vite : /api → http://localhost:8080/api/tasks
          </div>
        </div>

        {/* TanStack Query info */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#FAF3E8] text-[#8C5E24] border border-[#F2DEBF]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-stone-800">Gestion de Cache TanStack Query v5</h3>
              <p className="text-[11px] text-stone-500">
                Invalidation automatique des clés `['tasks']` sur toutes les mutations (création, mise à jour, suppression).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#2D5A3C]">
            <Check className="w-4 h-4" />
            <span>Cache activé avec un staleTime de 2 minutes.</span>
          </div>
        </div>

        {/* Security / Auth upcoming feature */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#F5F3ED] text-stone-600 border border-[#E6E2D7]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-stone-800">Authentification (JWT / Bearer)</h3>
              <p className="text-[11px] text-stone-500">
                Prévue pour une étape ultérieure selon vos consignes. L'intercepteur Axios dans `api.ts` est déjà prêt à accueillir le token.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

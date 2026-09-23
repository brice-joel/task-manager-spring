import React from 'react';
import { LayoutDashboard, CheckCircle2, TrendingUp, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[#2D5A3C]" />
          Tableau de bord
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Aperçu global de votre productivité et synchronisation Spring Boot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Progression</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3EB] text-[#2D5A3C] flex items-center justify-center border border-[#D5E6D8]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-stone-900">85%</div>
            <p className="text-xs text-stone-500 mt-0.5">Taux d'accomplissement des objectifs</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Objectifs</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E8] text-[#8C5E24] flex items-center justify-center border border-[#F2DEBF]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-stone-900">12 / 15</div>
            <p className="text-xs text-stone-500 mt-0.5">Tâches réalisées cette semaine</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Intégration</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3EB] text-[#2D5A3C] flex items-center justify-center border border-[#D5E6D8]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-stone-800">Spring Boot REST API</div>
            <p className="text-xs text-[#2D5A3C] mt-0.5">Proxy Vite actif sur :8080</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
            Accéder directement à votre espace de tâches
            <Sparkles className="w-3.5 h-3.5 text-[#3B7A51]" />
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ajoutez, complétez ou organisez vos tâches avec le cache TanStack Query.
          </p>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D5A3C] hover:bg-[#234730] text-white text-xs font-medium shadow-xs transition shrink-0"
        >
          Ouvrir mes tâches
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Menu, Bell, Server } from 'lucide-react';
import { taskService } from '../services/taskService';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        await taskService.getAllTasks();
        if (isMounted) setBackendStatus('connected');
      } catch (err: any) {
        // Si le serveur a répondu (même avec une 4xx ou 5xx), il est joignable
        if (err?.status) {
          if (isMounted) setBackendStatus('connected');
        } else {
          if (isMounted) setBackendStatus('disconnected');
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FAF9F6]/90 backdrop-blur-xs border-b border-[#EAE7DF] transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#F2EFE8] transition"
            onClick={onOpenSidebar}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base font-semibold text-stone-900">
              Espace de Travail
            </h1>
            <p className="hidden sm:block text-[11px] text-stone-500">
              Organisation simple et naturelle de vos tâches
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Spring Boot status indicator - Tons naturels doux */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              backendStatus === 'connected'
                ? 'bg-[#EAF3EB] text-[#2D5A3C] border-[#D1E5D4]'
                : backendStatus === 'checking'
                ? 'bg-[#FAF3E8] text-[#85551A] border-[#F2DEBF]'
                : 'bg-[#FBEAEB] text-[#8C282F] border-[#F4D1D4]'
            }`}
            title={`Backend Spring Boot: ${backendStatus}`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">
              {backendStatus === 'connected'
                ? 'Serveur Spring Boot en ligne'
                : backendStatus === 'checking'
                ? 'Vérification...'
                : 'Serveur hors ligne'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'connected'
                  ? 'bg-[#3B7A51]'
                  : backendStatus === 'checking'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
          </div>

          <button
            type="button"
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-[#F2EFE8] rounded-xl transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User profile avatar - Tons pierre lin */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#EAE7DF]">
            <div className="w-8 h-8 rounded-full bg-[#EAE7DE] border border-[#DDD8CB] flex items-center justify-center text-stone-700 text-xs font-semibold">
              JT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  CheckSquare2, 
  LayoutDashboard, 
  Settings, 
  Leaf, 
  X,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/tasks',
      label: 'Mes Tâches',
      icon: CheckSquare2,
      badge: 'Principal',
    },
    {
      to: '/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
    },
    {
      to: '/settings',
      label: 'Paramètres',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container - Palette Naturelle & Lin */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#FBFBF9] text-stone-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-[#EAE7DF] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#EAE7DF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] text-[#2D5A3C] flex items-center justify-center border border-[#D5E2D7] shadow-xs">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-stone-900 flex items-center gap-1.5">
                TaskFlow
              </span>
              <span className="text-[11px] block text-stone-500 font-normal">Gestion Organique</span>
            </div>
          </div>

          <button 
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 px-3.5 py-6 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-medium tracking-wider uppercase text-stone-400">
            Espaces
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EAE7DE] text-stone-900 font-semibold border border-[#DDD8CB] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2EFE8]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-stone-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#E5EDE6] text-[#2A5437]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info - Status discret & naturel */}
        <div className="p-4 border-t border-[#EAE7DF]">
          <div className="p-3 rounded-xl bg-[#F5F3ED] border border-[#E6E2D7] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
              <Compass className="w-3.5 h-3.5 text-[#2D5A3C]" />
              <span>Spring Boot API</span>
            </div>
            <p className="text-[11px] text-stone-500">Port actif : 8080</p>
            <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-[#2D5A3C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B7A51]"></span>
              <span>Proxy Vite opérationnel</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

import { AdminSection } from '../../types/admin';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: '📊' },
    { id: 'users' as AdminSection, label: 'Utenti', icon: '👥' },
    { id: 'orders' as AdminSection, label: 'Ordini', icon: '📦' },
    { id: 'products' as AdminSection, label: 'Prodotti', icon: '🏷️' },
    { id: 'content' as AdminSection, label: 'Contenuti', icon: '📝' },
    { id: 'analytics' as AdminSection, label: 'Analytics', icon: '📈' },
    { id: 'audit' as AdminSection, label: 'Audit Log', icon: '📋' },
    { id: 'backup' as AdminSection, label: 'Backup', icon: '💾' },
    { id: 'media' as AdminSection, label: 'Media', icon: '📁' },
    { id: 'settings' as AdminSection, label: 'Impostazioni', icon: '⚙️' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 z-50 hidden lg:flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AIRKLIM</div>
            <div className="text-xs text-white/40">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {activeSection === item.id && <span className="ml-auto w-1.5 h-1.5 bg-sky-400 rounded-full"></span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="block w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm text-center transition-all">
          ← Torna al Sito
        </a>
      </div>
    </aside>
  );
}

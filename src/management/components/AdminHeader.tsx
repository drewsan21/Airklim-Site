import { AdminUser } from '../../types/admin';

interface AdminHeaderProps {
  admin: AdminUser;
  onLogout: () => void;
}

export function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Benvenuto, {admin.name}</h2>
          <p className="text-sm text-white/50">{admin.email}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{admin.name} {admin.surname}</div>
            <div className="text-xs text-white/50 capitalize">{admin.role}</div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {admin.name[0]}{admin.surname[0]}
          </div>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 rounded-xl text-sm transition-all border border-white/10 hover:border-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

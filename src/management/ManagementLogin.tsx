import { useState } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';

export function ManagementLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const result = login(email, password);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-blue flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Area Amministratore</h1>
          <p className="text-white/50">Accedi al pannello di gestione AIRKLIM</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25"
            >
              Accedi
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              🔒 Accesso riservato agli amministratori autorizzati
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
            ← Torna al sito
          </a>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/50 mb-2 font-semibold">Account di Test:</p>
          <div className="space-y-1 text-xs text-white/40">
            <div>📧 admin@example.com / Admin@123!</div>
            <div>📧 professionist@example.com / Pro@123!</div>
            <div>📧 user@example.com / User@123!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

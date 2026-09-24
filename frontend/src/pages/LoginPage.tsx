import { useEffect, useState, type FormEvent } from 'react';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, X } from 'lucide-react';

interface LoginPageProps {
  open: boolean;
  onClose: () => void;
  onLogin?: (name: string) => void;
}

export default function LoginPage({ open, onClose, onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const displayName = formData.name.trim() || formData.email.split('@')[0] || 'Creator';
    localStorage.setItem('yo-user', displayName);
    onLogin?.(displayName);
    onClose();
  };

  const tabClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/25'
        : 'text-slate-400 hover:text-white'
    }`;

  const inputClass =
    'w-full bg-[#0b0e17]/60 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all';

  const iconClass = 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none';

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#121829]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-purple-900/20 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-white text-sm tracking-wide">AIArbiTech OS</p>
            <p className="text-[11px] text-slate-400">AI Powered Growth Platform</p>
          </div>
        </div>

        <div className="flex bg-[#0b0e17]/80 p-1 rounded-xl border border-slate-800/60 mb-6">
          <button onClick={() => setIsLogin(true)} className={tabClass(isLogin)}>
            Вход
          </button>
          <button onClick={() => setIsLogin(false)} className={tabClass(!isLogin)}>
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                required
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
            </div>
          )}

          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className={iconClass} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#0b0e17]/60 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {isLogin ? (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 bg-[#0b0e17] text-purple-600 focus:ring-purple-500/20 accent-purple-600 cursor-pointer"
                />
                <span className="text-xs text-slate-400">Запомнить меня</span>
              </label>
              <a href="#forgot" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
                Забыли пароль?
              </a>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-2.5 rounded-xl text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>{isLogin ? 'Войти' : 'Начать'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
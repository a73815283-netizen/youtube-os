import { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmDialogProps {
  open: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ open, userName, onClose, onConfirm }: LogoutConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      aria-describedby="logout-confirm-text"
    >
      <div className="w-full max-w-sm bg-[#121829]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-purple-900/20 relative text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Отмена"
          className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-400/30 flex items-center justify-center shadow-lg shadow-red-500/10">
          <LogOut className="w-6 h-6 text-red-400" />
        </div>

        <h2 id="logout-confirm-title" className="text-white font-bold text-lg tracking-wide">
          Выйти из аккаунта?
        </h2>
        <p id="logout-confirm-text" className="mt-2 text-sm text-slate-400 leading-6">
          Вы уверены, что хотите выйти?
          {userName ? <> Сейчас выполнен вход как <span className="text-slate-200 font-medium">{userName}</span>.</> : null}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white hover:bg-white/10 py-2.5 text-sm font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-2.5 text-sm font-bold shadow-lg shadow-red-600/30 transition-all duration-300"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
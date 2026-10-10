import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onResetDefault: () => void;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onResetDefault,
  onDismiss,
}) => {
  return (
    <div className="w-full p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-lg bg-rose-900/50 text-rose-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Weather Data Unavailable</h4>
          <p className="text-xs text-rose-300 mt-0.5">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-900/80 hover:bg-rose-800 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>

        <button
          type="button"
          onClick={onResetDefault}
          className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg transition-colors border border-slate-700"
        >
          Reset to Chennai
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 text-rose-400 hover:text-white rounded-lg hover:bg-rose-900/50 transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

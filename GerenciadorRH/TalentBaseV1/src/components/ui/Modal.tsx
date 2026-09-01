import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  icon?: ReactNode;
  subtitle?: string;
}

export function Modal({ title, subtitle, icon, onClose, children, maxWidth = "max-w-lg" }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-ink/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-sm shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-line flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="font-display font-semibold text-base">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-paper rounded-sm transition-colors">
            <X size={16} className="text-muted" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

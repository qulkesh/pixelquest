import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}

export default function Modal({ open, onClose, title, children, width = 480 }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80" onClick={onClose}>
      <div
        className="pixel-frame relative max-w-[92vw]"
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b-2 border-frame">
          <span className="font-pixel text-xs uppercase text-cyan neon-text">{title}</span>
          <button className="font-pixel text-xs text-muted hover:text-ink" onClick={onClose}>X</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

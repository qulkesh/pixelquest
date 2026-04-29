import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'good' | 'bad' | 'gold' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export default function PixelButton({ variant = 'default', className = '', children, ...rest }: Props) {
  const cls = ['pixel-btn'];
  if (variant !== 'default') cls.push(`pixel-btn--${variant}`);
  return (
    <button {...rest} className={`${cls.join(' ')} ${className}`}>{children}</button>
  );
}

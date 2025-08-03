import type { ReactNode } from 'react';

interface IPaginateButtonProps {
  children: ReactNode;
  className?: string;
  disabled: boolean;
  onClick: () => void;
}

export default function IPaginateButtonProps({
  children,
  className,
  disabled,
  onClick,
}: IPaginateButtonProps) {
  return (
    <button
      className={
        className ??
        'px-4 py-2 bg-gray-200 rounded font-medium disabled:opacity-50'
      }
      disabled={disabled}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}

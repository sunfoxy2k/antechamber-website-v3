'use client';

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function SubmitButton({ 
  onSubmit, 
  isLoading = false, 
  disabled = false, 
  children, 
  variant = 'default',
  className = ''
}: SubmitButtonProps) {
  const getSizeClass = () => {
    switch (variant) {
      case 'sm': return 'size-sm';
      case 'lg': return 'size-lg';
      default: return '';
    }
  };

  return (
    <Button 
      onClick={onSubmit}
      disabled={disabled || isLoading}
      className={`${getSizeClass()} ${className}`}
    >
      {isLoading ? 'Processing...' : children}
    </Button>
  );
}

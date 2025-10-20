'use client';

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'sm' | 'lg' | 'subtle';
  className?: string;
  show?: boolean;
}

export function SubmitButton({ 
  onSubmit, 
  isLoading = false, 
  disabled = false, 
  children, 
  variant = 'default',
  className = '',
  show = true
}: SubmitButtonProps) {
  if (!show) return null;

  const getSizeClass = () => {
    switch (variant) {
      case 'sm': return 'size-sm';
      case 'lg': return 'size-lg';
      case 'subtle': return 'size-sm';
      default: return '';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'subtle': return 'variant-outline';
      default: return '';
    }
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSubmit}
        disabled={disabled || isLoading}
        variant={variant === 'subtle' ? 'outline' : 'default'}
        size={variant === 'subtle' ? 'sm' : 'default'}
        className={`${getSizeClass()} ${getVariantClass()} ${className}`}
      >
        {isLoading ? 'Processing...' : children}
      </Button>
    </div>
  );
}

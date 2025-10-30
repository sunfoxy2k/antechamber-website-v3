'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const handleReset = () => {
    if (typeof window !== 'undefined') {
      // Confirm before clearing all data
      const confirmed = window.confirm(
        'Are you sure you want to reset? This will clear all saved data and reload the page.'
      );
      
      if (confirmed) {
        // Clear all localStorage
        localStorage.clear();
        
        // Clear sessionStorage as well
        sessionStorage.clear();
        
        // Reload the page
        window.location.reload();
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-900">
              Antechamber
            </span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </nav>
    </header>
  );
}
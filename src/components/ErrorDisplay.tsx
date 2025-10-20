'use client';

interface ErrorDisplayProps {
  errors: string[];
  className?: string;
}

export function ErrorDisplay({ errors, className = '' }: ErrorDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <ul className="text-sm text-red-600 space-y-1">
        {errors.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
    </div>
  );
}

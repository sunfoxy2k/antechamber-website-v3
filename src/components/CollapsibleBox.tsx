'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleBoxProps {
  title: string;
  isFilled?: boolean;
  children: ReactNode;
  className?: string;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function CollapsibleBox({ title, isFilled = false, children, className = '', isCollapsed: externalCollapsed, onCollapseChange }: CollapsibleBoxProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    if (externalCollapsed !== undefined && onCollapseChange) {
      onCollapseChange(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={handleCollapseToggle}
      >
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {title}
          {isFilled && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
        </h3>
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        )}
      </div>
      {!isCollapsed && children}
    </div>
  );
}

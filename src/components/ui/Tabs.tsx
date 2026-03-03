'use client';
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find(t => t.id === active);

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-800 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              active === tab.id
                ? 'text-blue-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  );
}

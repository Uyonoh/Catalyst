import React from 'react';
import VaultCard, { VaultItem } from './VaultCard';

interface VaultGridProps {
  items: VaultItem[];
}

export default function VaultGrid({ items }: VaultGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <VaultCard key={item.id} item={item} />
      ))}
    </div>
  );
}

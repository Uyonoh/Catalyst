import React from "react";
import LibraryCard, { LibraryItem } from "./LibraryCard";

interface LibraryGridProps {
  items: LibraryItem[];
}

export default function LibraryGrid({ items }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
      {items.map((item) => (
        <LibraryCard key={item.id} item={item} />
      ))}
    </div>
  );
}

"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Category } from "../lib/categories";
import type { Model } from "../lib/models";

interface CatalogContextType {
  categories: Category[];
  models: Model[];
}

const CatalogContext = createContext<CatalogContextType>({
  categories: [],
  models: [],
});

export function CatalogProvider({
  categories,
  models,
  children,
}: CatalogContextType & { children: ReactNode }) {
  return (
    <CatalogContext.Provider value={{ categories, models }}>
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);

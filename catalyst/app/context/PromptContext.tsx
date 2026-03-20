'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useParsing } from '../hooks/useParsing';
import { OptimizedPrompt } from '../lib/engine/types';

interface PromptContextType {
    input: string;
    setInput: (text: string) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    result: OptimizedPrompt | null;
    isLoading: boolean;
    error: string | null;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('midjourney');
    const { result, isLoading, error } = useParsing(input, selectedModel);

    return (
        <PromptContext.Provider value={{ input, setInput, selectedModel, setSelectedModel, result, isLoading, error }}>
            {children}
        </PromptContext.Provider>
    );
}

export function usePrompt() {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
}

'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PromptContextType {
    input: string;
    setInput: (text: string) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('midjourney');

    return (
        <PromptContext.Provider value={{ input, setInput, selectedModel, setSelectedModel }}>
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

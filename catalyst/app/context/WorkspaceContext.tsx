'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useParsing } from '../hooks/useParsing';
import { OptimizedPrompt } from '../lib/engine/types';

interface WorkspaceContextType {
    input: string;
    setInput: (text: string) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    result: OptimizedPrompt | null;
    isLoading: boolean;
    error: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('midjourney');
    const { result, isLoading, error } = useParsing(input, selectedModel);

    return (
        <WorkspaceContext.Provider value={{ input, setInput, selectedModel, setSelectedModel, result, isLoading, error }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}

import { useState, useEffect, useCallback } from 'react';
import { OptimizedPrompt } from '../lib/engine/types';

export function useParsing(text: string, selectedModel: string, debounceMs: number = 500) {
    const [result, setResult] = useState<OptimizedPrompt | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzePrompt = useCallback(async (currentText: string, currentModel: string) => {
        if (!currentText.trim()) {
            setResult(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: currentText, model: currentModel }),
            });

            if (!response.ok) throw new Error('Failed to analyze prompt');

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!text.trim()) {
            setResult(null);
            setIsLoading(false);
            return;
        }

        // Set loading immediately when the user starts typing/editing
        setIsLoading(true);

        const timer = setTimeout(() => {
            analyzePrompt(text, selectedModel);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [text, selectedModel, debounceMs, analyzePrompt]);

    return { result, isLoading, error };
}


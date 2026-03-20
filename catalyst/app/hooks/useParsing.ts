import { useState, useEffect, useCallback } from 'react';
import { OptimizedPrompt } from '../lib/engine/types';

export function useParsing(text: string, debounceMs: number = 500) {
    const [result, setResult] = useState<OptimizedPrompt | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzePrompt = useCallback(async (currentText: string) => {
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
                body: JSON.stringify({ text: currentText }),
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
        const timer = setTimeout(() => {
            analyzePrompt(text);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [text, debounceMs, analyzePrompt]);

    return { result, isLoading, error };
}


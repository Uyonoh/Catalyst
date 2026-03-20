import { NextRequest, NextResponse } from 'next/server';
import { RegexParser } from '@/app/lib/parsing/strategies/RegexParser';
import { AnalyzerService } from '@/app/lib/engine/AnalyzerService';
import { CompilerService } from '@/app/lib/engine/CompilerService';
import { TargetModel } from '@/app/lib/engine/types';

const parser = new RegexParser();
const analyzerService = new AnalyzerService();
const compilerService = new CompilerService();

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
        }

        // For Phase 1, we use the fast RegexParser
        const result = parser.analyze(text);
        const deconstructed = analyzerService.analyze(text);
        const optimized = compilerService.compile(deconstructed, TargetModel.CLAUDE_3_5_SONNET);

        return NextResponse.json(optimized);
    } catch (error) {
        console.error('Parsing Error:', error);
        return NextResponse.json({ error: 'Failed to analyze prompt' }, { status: 500 });
    }
}

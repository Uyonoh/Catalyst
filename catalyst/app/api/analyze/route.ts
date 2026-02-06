import { NextRequest, NextResponse } from 'next/server';
import { RegexParser } from '@/app/lib/parsing/strategies/RegexParser';

const parser = new RegexParser();

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
        }

        // For Phase 1, we use the fast RegexParser
        const result = parser.analyze(text);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Parsing Error:', error);
        return NextResponse.json({ error: 'Failed to analyze prompt' }, { status: 500 });
    }
}

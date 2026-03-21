import { PromptConstraints } from '../types';
import { ConstraintExtractor } from './types';

export class BaseConstraintExtractor implements ConstraintExtractor {
  public extract(input: string, current: PromptConstraints): Partial<PromptConstraints> {
    const updates: Partial<PromptConstraints> = {};

    // Tone Detection Patterns
    const tonePatterns: Record<PromptConstraints['tone'], RegExp[]> = {
      'ELI5': [/\bexplain like i'm 5\b/i, /\beli5\b/i, /\bsimple words\b/i],
      'CREATIVE': [/\bfunny\b/i, /\bcreative\b/i, /\bwitty\b/i, /\bhumerous\b/i, /\bimaginative\b/i, /\bneon\b/i, /\bcinematic\b/i, /\bdrone\b/i, /\bvibrant\b/i],
      'CONCISE': [/\bbrief\b/i, /\bshort\b/i, /\bconcise\b/i, /\btldr\b/i, /\bsummarize\b/i],
      'PROFESSIONAL': [/\bprofessional\b/i, /\bbusiness\b/i, /\bformal\b/i],
      'ACADEMIC': [/\bacacademic\b/i, /\bscholar\b/i, /\bscientific\b/i, /\bresearch\b/i],
    };

    // Format Detection Patterns
    const formatPatterns: Record<PromptConstraints['outputFormat'], RegExp[]> = {
      'JSON': [/\bjson\b/i, /\bjavascript object notation\b/i],
      'CSV': [/\bcsv\b/i, /\btable\b/i, /\bcomma separated\b/i],
      'YAML': [/\byaml\b/i, /\byml\b/i],
      'MARKDOWN': [/\bmarkdown\b/i, /\bmd\b/i],
      'PLAIN_TEXT': [/\bplain text\b/i, /\btxt\b/i],
    };

    for (const [tone, patterns] of Object.entries(tonePatterns)) {
      if (patterns.some(p => p.test(input))) {
        updates.tone = tone as PromptConstraints['tone'];
        break; // Take first match
      }
    }

    for (const [format, patterns] of Object.entries(formatPatterns)) {
      if (patterns.some(p => p.test(input))) {
        updates.outputFormat = format as PromptConstraints['outputFormat'];
        break; // Take first match
      }
    }

    // Negative Constraints Detection
    const negativeMatches = input.matchAll(/(?:no|without|exclude|don't include)\s+([\w\s]+?)(?=[,.]|$)/gi);
    const negatives = Array.from(negativeMatches).map(m => m[1].trim());
    if (negatives.length > 0) {
        updates.negativeConstraints = negatives;
    }

    return updates;
  }
}

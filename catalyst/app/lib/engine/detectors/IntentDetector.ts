import { Intent } from '../types';
import { IntentDetector, DetectionResult, WeightedPattern } from './types';

export class IntentClassifier implements IntentDetector {
  public name = 'weighted-intent-detector';

  private readonly patterns: Record<Intent, WeightedPattern[]> = {
    [Intent.DEBUG]: [
      { regex: /\berror\b/i, weight: 1 },
      { regex: /\bfix\b/i, weight: 2 },
      { regex: /\bbroken\b/i, weight: 1 },
      { regex: /\bwhy\b/i, weight: 1 },
      { regex: /\bbug\b/i, weight: 3 },
      { regex: /\bcrash\b/i, weight: 2 },
      { regex: /\bissue\b/i, weight: 1 },
      { regex: /\bfails\b/i, weight: 1 },
      { regex: /\brendering\b/i, weight: 2 },
      { regex: /\bnot working\b/i, weight: 2 },
      { regex: /\blayer\b/i, weight: 1 }
    ],
    [Intent.REFACTOR]: [
      { regex: /\boptimize\b/i, weight: 2 },
      { regex: /\bclean\b/i, weight: 1 },
      { regex: /\bshorter\b/i, weight: 1 },
      { regex: /\bimprove\b/i, weight: 1 },
      { regex: /\bfaster\b/i, weight: 2 },
      { regex: /\breadable\b/i, weight: 2 }
    ],
    [Intent.SPATIAL_ANALYSIS]: [
      { regex: /\bintersect\b/i, weight: 3 },
      { regex: /\bwithin\b/i, weight: 2 },
      { regex: /\bdistance\b/i, weight: 2 },
      { regex: /\bbuffer\b/i, weight: 3 },
      { regex: /\bheatmap\b/i, weight: 3 }
    ],
    [Intent.STORYBOARD]: [
      { regex: /\bscene\b/i, weight: 1 },
      { regex: /\bsequence\b/i, weight: 2 },
      { regex: /\bpanel\b/i, weight: 2 }
    ],
    [Intent.BRAINSTORM]: [
      { regex: /\bideas\b/i, weight: 2 },
      { regex: /\bsuggest\b/i, weight: 2 },
      { regex: /\blist\b/i, weight: 1 },
      { regex: /\boptions\b/i, weight: 1 },
      { regex: /\bgive me 10\b/i, weight: 3 },
      { regex: /\bconcepts\b/i, weight: 2 },
      { regex: /\bbrainstorm\b/i, weight: 3 }
    ],
    [Intent.SUMMARIZE]: [
      { regex: /\btldr\b/i, weight: 3 },
      { regex: /\bshorten\b/i, weight: 1 },
      { regex: /\bgist\b/i, weight: 2 },
      { regex: /\bkey points\b/i, weight: 2 },
      { regex: /\bbrief\b/i, weight: 1 }
    ],
    [Intent.ARCHITECT]: [
      { regex: /\barchitecture\b/i, weight: 3 },
      { regex: /\bdesign\b/i, weight: 1 },
      { regex: /\bsystem\b/i, weight: 2 },
      { regex: /\bstructure\b/i, weight: 1 },
      { regex: /\bblueprint\b/i, weight: 3 },
      { regex: /\bmigrate\b/i, weight: 2 },
      { regex: /\bplan\b/i, weight: 1 }
    ],
    [Intent.DOCUMENT]: [
      { regex: /\bdocument\b/i, weight: 2 },
      { regex: /\bdocumentation\b/i, weight: 3 },
      { regex: /\bspecs\b/i, weight: 2 },
      { regex: /\brequirements\b/i, weight: 2 }
    ],
    [Intent.COLOR_GRADE]: [
      { regex: /\bcolor\b/i, weight: 1 },
      { regex: /\bgrade\b/i, weight: 2 },
      { regex: /\bcolor grading\b/i, weight: 3 },
      { regex: /\bcolor correction\b/i, weight: 3 }
    ],
    [Intent.COMPOSITION]: [
      { regex: /\bcomposition\b/i, weight: 3 },
      { regex: /\bshot\b/i, weight: 2 },
      { regex: /\bcinematic\b/i, weight: 2 },
      { regex: /\blighting\b/i, weight: 1 },
      { regex: /\bvisualize\b/i, weight: 1 }
    ],

    [Intent.SCRIPTWRITING]: [
      { regex: /\bscript\b/i, weight: 2 },
      { regex: /\bscriptwriting\b/i, weight: 3 }
    ],
    [Intent.STYLE_TRANSFER]: [
      { regex: /\bstyle\b/i, weight: 1 },
      { regex: /\bstyle transfer\b/i, weight: 3 },
      { regex: /\baesthetic\b/i, weight: 2 },
      { regex: /\bedit\b/i, weight: 2 },
      { regex: /\blooks like\b/i, weight: 2 },
      { regex: /\bcyberpunk\b/i, weight: 3 }
    ],
    [Intent.EXPAND]: [
      { regex: /\bexpand\b/i, weight: 2 }
    ],
    [Intent.GENERAL_TASK]: [],
  };

  public detect(input: string): DetectionResult<Intent>[] {
    const results: DetectionResult<Intent>[] = [];

    for (const [intent, wp] of Object.entries(this.patterns)) {
      let score = 0;
      for (const pattern of wp) {
        if (pattern.regex.test(input)) {
          score += pattern.weight;
        }
      }

      if (score > 0) {
        results.push({
          value: intent as Intent,
          score: score
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}


export interface ScenarioResult {
  persona?: string;
  style?: string;
}

export class ScenarioDetector {
  private readonly personaPatterns = [
    /(?:act as|you are|persona:)\s*a?\s*([^,.\n?]+)/i,
    /(?:expert in|specialist in)\s+([^,.\n?]+)/i,
    /(?:senior|junior|lead|expert)\s+([\w\s]+developer|[\w\s]+engineer|[\w\s]+consultant)/i
  ];

  private readonly stylePatterns: Record<string, RegExp[]> = {
    "Step-by-step": [/\bstep[- ]by[- ]step\b/i, /\bin stages\b/i, /\bone by one\b/i],
    "Chain-of-thought": [/\blet's think step by step\b/i, /\breason through\b/i, /\bthought process\b/i],
    "Comparative": [/\bcompare and contrast\b/i, /\bversus\b/i, /\bvs\b/i, /\bdifference between\b/i],
    "Briefing": [/\btldr\b/i, /\bgive me a brief\b/i, /\bsummary for executives\b/i],
  };

  public detect(input: string): ScenarioResult {
    const result: ScenarioResult = {};

    // 1. Detect Persona
    for (const pattern of this.personaPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        result.persona = match[1].trim();
        break;
      }
    }

    // 2. Detect Style
    for (const [styleName, patterns] of Object.entries(this.stylePatterns)) {
      if (patterns.some(p => p.test(input))) {
        result.style = styleName;
        break;
      }
    }

    return result;
  }
}

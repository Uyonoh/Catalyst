import { ParsingResult, ParsingStrategy, Entity } from "../types";

export class RegexParser implements ParsingStrategy {
  name = "regex_rules";

  analyze(text: string): ParsingResult {
    const entities: Entity[] = [];
    let intent = "General Inquiry";
    let clarity = 0.3;

    // Persona Extraction
    const personaMatch = text.match(
      /(?:act as a(?:n)?|you are a(?:n)?|you are my|you are|persona:(?:\s+a(?:n)?)?|role:(?:\s+a(?:n)?)?)\s+([\w-]+)/i,
    );
    if (personaMatch) {
      entities.push({
        label: `Persona: ${personaMatch[1].trim()}`,
        type: "persona",
        value: personaMatch[1].trim(),
      });
      clarity += 0.15;
      intent = "Creative Generation";
    }

    // Basic Subject Extraction (allows multiple subjects)
    const subjectMatch = text.match(
      /(?:a|an|the)\s+([a-zA-Z0-9\s]+?)(?:\s+in|\s+with|\s+at|\s+by|\s+style|\.|$)/i,
    );
    if (subjectMatch) {
      entities.push({
        label: `Subject: ${subjectMatch[1].trim()}`,
        type: "subject",
        value: subjectMatch[1].trim(),
      });
      clarity += 0.1;
    }

    // Style/Artist Extraction
    const styleMatch = text.match(
      /(?:in the style of|style:|artist:|as a)\s+([a-zA-Z0-9\s]+)/i,
    );
    if (styleMatch) {
      entities.push({
        label: `Style: ${styleMatch[1].trim()}`,
        type: "style",
        value: styleMatch[1].trim(),
      });
      clarity += 0.15;
      intent = "Creative Generation";
    }

    // Common Modifiers/Keywords
    const keywords = [
      {
        regex: /cyberpunk|neon|futuristic/i,
        type: "style",
        label: "Theme: Theme",
      },
      {
        regex: /raining|sunny|cloudy|stormy/i,
        type: "atmosphere",
        label: "Atmosphere",
      },
      {
        regex: /cinematic|dark|bright|neon lighting/i,
        type: "lighting",
        label: "Lighting",
      },
      {
        regex: /high resolution|4k|8k|detailed/i,
        type: "modifier",
        label: "Quality",
      },
    ];

    keywords.forEach((k) => {
      const match = text.match(k.regex);
      console.log(match);
      if (match) {
        entities.push({
          label: k.label + ": " + match[0],
          type: k.type as any,
          value: match[0] || match[1],
        });
        clarity += 0.05;
      }
    });

    // Intent Detection
    if (
      text.toLowerCase().includes("code") ||
      text.toLowerCase().includes("function")
    ) {
      intent = "Code Generation";
      clarity += 0.2;
    } else if (
      text.toLowerCase().includes("write") ||
      text.toLowerCase().includes("story")
    ) {
      intent = "Creative Writing";
      clarity += 0.1;
    }

    return {
      intentClarity: Math.min(clarity, 1.0),
      intent,
      entities,
      suggestedFormat:
        intent === "Code Generation" ? "markdown" : "natural_language",
    };
  }
}

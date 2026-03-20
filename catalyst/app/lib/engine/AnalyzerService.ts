import { 
  DeconstructedPrompt, Domain, Intent, 
  InputModality, Asset, PromptConstraints 
} from './types';

export class AnalyzerService {
  // Weighted maps for Domain detection
  private readonly domainKeywords: Record<Domain, string[]> = {
    [Domain.TECHNICAL_GIS]: ["geojson", "shapefile", "coordinate", "spatial", "map", "arcgis", "qgis", "layer", "centroid"],
    [Domain.TECHNICAL_BACKEND]: ["api", "database", "endpoint", "sql", "postgres", "fastapi", "django", "middleware", "async"],
    [Domain.TECHNICAL_FRONTEND]: ["react", "tailwind", "css", "component", "nextjs", "hydration", "dom", "flexbox"],
    [Domain.TECHNICAL_DEVOPS]: ["docker", "kubernetes", "ci/cd", "pipeline", "aws", "terraform", "ingress"],
    [Domain.CREATIVE_MOTION]: ["frame", "fps", "cinematic", "drone", "lighting", "shutter", "bokeh", "tracking"],
    [Domain.CREATIVE_COPY]: ["headline", "blog", "persuasive", "hook", "narrative", "tone of voice"],
    [Domain.CREATIVE_VISUAL]: ["contrast", "palette", "composition", "resolution", "aspect ratio", "noise"],
    [Domain.BUSINESS_STRATEGY]: ["roi", "kpi", "roadmap", "stakeholder", "compliance", "market fit"],
  };

  // Weighted maps for Intent detection
  private readonly intentKeywords: Record<Intent, string[]> = {
    [Intent.DEBUG]: ["error", "fix", "broken", "why", "bug", "crash", "issue", "fails"],
    [Intent.REFACTOR]: ["optimize", "clean", "shorter", "improve", "faster", "readable"],
    [Intent.SPATIAL_ANALYSIS]: ["intersect", "within", "distance", "buffer", "heatmap"],
    [Intent.STORYBOARD]: ["scene", "shot", "sequence", "visualize", "panel"],
    [Intent.BRAINSTORM]: ["ideas", "suggest", "list", "options", "give me 10"],
    [Intent.SUMMARIZE]: ["tldr", "shorten", "gist", "key points", "brief"],
    [Intent.ARCHITECT]: ["architecture", "design", "system", "structure", "blueprint"],
    [Intent.DOCUMENT]: ["document", "documentation", "specs", "requirements", "specs"],
    [Intent.COLOR_GRADE]: ["color", "grade", "color grading", "color correction", "color grading"],
    [Intent.COMPOSITION]: ["composition", "composition", "composition", "composition", "composition"],
    [Intent.SCRIPTWRITING]: ["script", "scriptwriting", "scriptwriting", "scriptwriting", "scriptwriting"],
    [Intent.STYLE_TRANSFER]: ["style", "style transfer", "style transfer", "style transfer", "style transfer"],
    [Intent.EXPAND]: ["expand"],
  };

  public analyze(input: string, assets: Asset[] = []): DeconstructedPrompt {
    const lowerInput = input.toLowerCase();
    
    const domain = this.detectCategory<Domain>(lowerInput, this.domainKeywords, Domain.CREATIVE_MOTION);
    const primaryIntent = this.detectCategory<Intent>(lowerInput, this.intentKeywords, Intent.STORYBOARD);
    const constraints = this.extractConstraints(lowerInput);

    return {
      originalInput: input,
      detectedDomain: domain,
      primaryIntent: primaryIntent,
      secondaryIntents: [], // Logic can be expanded to find top 2
      confidenceScore: 0.85, // Placeholder for actual scoring logic
      assets: assets,
      constraints: constraints,
      variables: this.extractVariables(input),
    };
  }

  private detectCategory<T>(input: string, keywordMap: Record<any, string[]>, fallback: T): T {
    let bestMatch: T = fallback;
    let highestScore = 0;

    for (const [category, keywords] of Object.entries(keywordMap)) {
      const score = keywords.reduce((acc, kw) => acc + (input.includes(kw) ? 1 : 0), 0);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category as unknown as T;
      }
    }
    return bestMatch;
  }

  private extractConstraints(input: string): PromptConstraints {
    const constraints: PromptConstraints = {
      tone: "PROFESSIONAL",
      outputFormat: "MARKDOWN",
    };

    // Simple Regex for Format
    if (/json/i.test(input)) constraints.outputFormat = "JSON";
    if (/table|csv/i.test(input)) constraints.outputFormat = "CSV";

    // Simple Regex for Tone
    if (/explain like i'm 5|eli5/i.test(input)) constraints.tone = "ELI5";
    if (/funny|creative|witty/i.test(input)) constraints.tone = "CREATIVE";
    if (/brief|short|concise/i.test(input)) constraints.tone = "CONCISE";

    return constraints;
  }

  private extractVariables(input: string): Record<string, string> {
    const variables: Record<string, string> = {};
    const matches = input.matchAll(/{{(.*?)}}/g);
    for (const match of matches) {
      variables[match[1]] = ""; // Placeholder for user-provided data
    }
    return variables;
  }
}
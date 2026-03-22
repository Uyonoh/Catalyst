import {
  DeconstructedPrompt,
  Domain,
  Intent,
  InputModality,
  Asset,
  PromptConstraints,
} from "./types";
import { DomainClassifier } from "./detectors/DomainDetector";
import { IntentClassifier } from "./detectors/IntentDetector";
import { BaseConstraintExtractor } from "./detectors/ConstraintDetector";
import { ScenarioDetector } from "./detectors/ScenarioDetector";

export class AnalyzerService {
  private domainClassifier = new DomainClassifier();
  private intentClassifier = new IntentClassifier();
  private constraintExtractor = new BaseConstraintExtractor();
  private scenarioDetector = new ScenarioDetector();

  // Multipliers for "high-intent" verbs
  private readonly boosters: Record<string, number> = {
    write: 1.2,
    create: 1.2,
    generate: 1.2,
    build: 1.3,
    analyze: 1.4,
    fix: 1.5,
    optimize: 1.4,
  };

  public analyze(input: string, assets: Asset[] = []): DeconstructedPrompt {
    const lowerInput = input.toLowerCase();

    // 1. Detect Domain with Boosters
    let domainResults = this.domainClassifier.detect(lowerInput);
    domainResults = this.applyBoosters(lowerInput, domainResults);
    const domain =
      domainResults.length > 0 ? domainResults[0].value : Domain.GENERAL;

    // 2. Detect Intents with Boosters
    let intentResults = this.intentClassifier.detect(lowerInput);
    intentResults = this.applyBoosters(lowerInput, intentResults);
    const primaryIntent =
      intentResults.length > 0 ? intentResults[0].value : Intent.GENERAL_TASK;
    const secondaryIntents =
      intentResults.length > 1 ? [intentResults[1].value] : [];

    // 3. Extract Constraints & Scenarios
    const baseConstraints: PromptConstraints = {
      tone: "PROFESSIONAL",
      outputFormat: "PLAIN_TEXT",
    };
    const constraints = {
      ...baseConstraints,
      ...this.constraintExtractor.extract(lowerInput, baseConstraints),
    };

    const scenario = this.scenarioDetector.detect(lowerInput);

    // 4. Calculate Confidence Score (Refined for Phase 2)
    const confidenceScore = this.calculateConfidence(
      domainResults,
      intentResults,
    );

    return {
      originalInput: input,
      detectedDomain: domain,
      primaryIntent: primaryIntent,
      secondaryIntents: secondaryIntents,
      confidenceScore: confidenceScore,
      assets: assets,
      constraints: constraints,
      variables: this.extractVariables(input),
      persona: scenario.persona,
      style: scenario.style,
    };
  }

  private applyBoosters<T>(
    input: string,
    results: { value: T; score: number }[],
  ): { value: T; score: number }[] {
    return results
      .map((res) => {
        let multiplier = 1.0;
        for (const [word, boost] of Object.entries(this.boosters)) {
          if (input.includes(word)) multiplier = Math.max(multiplier, boost);
        }
        return { ...res, score: res.score * multiplier };
      })
      .sort((a, b) => b.score - a.score);
  }

  private calculateConfidence(
    domainResults: any[],
    intentResults: any[],
  ): number {
    const dScore = domainResults[0]?.score || 0;
    const iScore = intentResults[0]?.score || 0;

    // Penalty for "Conflicts" (if the top 2 matches are too close, confidence drops)
    let conflictPenalty = 1.0;
    if (domainResults.length > 1) {
      const gap = domainResults[0].score - domainResults[1].score;
      if (gap < 2) conflictPenalty -= 0.1;
    }
    if (intentResults.length > 1) {
      const gap = intentResults[0].score - intentResults[1].score;
      if (gap < 2) conflictPenalty -= 0.1;
    }

    const baseConfidence = Math.min(0.98, (dScore + iScore) / 10);
    return Math.max(0.3, baseConfidence * conflictPenalty);
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

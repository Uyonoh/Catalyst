import { Domain, Intent, PromptConstraints } from "../types";

export interface WeightedPattern {
  /**
   * The regex pattern to match
   */
  regex: RegExp;
  /**
   * The weight or significance of this pattern (default: 1)
   */
  weight: number;
}

export interface DetectionResult<T> {
  value: T;
  score: number;
}

/**
 * Base interface for all detectors
 */
export interface Detector<T> {
  name: string;
  detect(input: string): DetectionResult<T>[];
}

/**
 * Specifically for Domain detection
 */
export type DomainDetector = Detector<Domain>;

/**
 * Specifically for Intent detection
 */
export type IntentDetector = Detector<Intent>;

/**
 * Specifically for Tone & Formatting extraction
 */
export interface ConstraintExtractor {
  extract(
    input: string,
    current: PromptConstraints,
  ): Partial<PromptConstraints>;
}

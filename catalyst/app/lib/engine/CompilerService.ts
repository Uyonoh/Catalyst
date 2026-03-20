import { DeconstructedPrompt, TargetModel, OptimizedPrompt, Domain, Intent } from './types';

export class CompilerService {
  /**
   * Main entry point to compile a prompt for a specific model
   */
  public compile(metadata: DeconstructedPrompt, target: TargetModel): OptimizedPrompt {
    let formattedPrompt: string = "";
    let systemInstruction: string = "";

    switch (target) {
      case TargetModel.CLAUDE_3_5_SONNET:
        ({ formattedPrompt, systemInstruction } = this.compileForClaude(metadata));
        break;
      case TargetModel.GPT_4O:
        ({ formattedPrompt, systemInstruction } = this.compileForGPT(metadata));
        break;
      case TargetModel.GEMINI_1_5_PRO:
        ({ formattedPrompt, systemInstruction } = this.compileForGemini(metadata));
        break;
      default:
        formattedPrompt = metadata.originalInput;
    }

    return {
      model: target,
      formattedPrompt,
      systemInstruction,
      metadata
    };
  }

  /**
   * CLAUDE ADAPTER: Focuses on XML tagging and "Prefilled" context.
   */
  private compileForClaude(meta: DeconstructedPrompt): { formattedPrompt: string, systemInstruction: string } {
    const system = `You are an expert ${meta.detectedDomain.replace('_', ' ')}. Your task is ${meta.primaryIntent}. 
    Respond in a ${meta.constraints.tone} tone and output as ${meta.constraints.outputFormat}.`;

    const prompt = `
<context>
  Domain: ${meta.detectedDomain}
  Intent: ${meta.primaryIntent}
</context>

<instruction>
  Please address the following request: ${meta.originalInput}
  ${meta.assets.length > 0 ? `Analyze the following attached assets: ${meta.assets.map(a => a.type).join(', ')}` : ''}
</instruction>

<constraints>
  Format: ${meta.constraints.outputFormat}
  Tone: ${meta.constraints.tone}
</constraints>

Please provide your response below:`;

    return { formattedPrompt: prompt, systemInstruction: system };
  }

  /**
   * GPT-4O ADAPTER: Focuses on Markdown hierarchy and Chain-of-Thought.
   */
  private compileForGPT(meta: DeconstructedPrompt): { formattedPrompt: string, systemInstruction: string } {
    const system = `ACT AS A ${meta.detectedDomain.toUpperCase()}. 
    PRIMARY OBJECTIVE: ${meta.primaryIntent}. 
    OUTPUT REQUIREMENT: ${meta.constraints.outputFormat}.`;

    const prompt = `
# TASK OVERVIEW
Identify the core problem in: "${meta.originalInput}"

# EXECUTION STEPS
1. Analyze the context of ${meta.detectedDomain}.
2. Apply the ${meta.primaryIntent} logic.
3. Verify the result matches the ${meta.constraints.tone} tone.

# OUTPUT
Provide the result strictly in ${meta.constraints.outputFormat} format.
${meta.assets.length > 0 ? `NOTE: Consider the visual/data evidence in the provided assets.` : ''}`;

    return { formattedPrompt: prompt, systemInstruction: system };
  }

  /**
   * GEMINI ADAPTER: Focuses on Task Boundaries and Multimodal interleaving.
   */
  private compileForGemini(meta: DeconstructedPrompt): { formattedPrompt: string, systemInstruction: string } {
    const system = `You are a helpful assistant specializing in ${meta.detectedDomain}. 
    Follow these constraints: Tone=${meta.constraints.tone}, Format=${meta.constraints.outputFormat}.`;

    const prompt = `
[TASK_START]
GOAL: ${meta.primaryIntent}
INPUT_DATA: ${meta.originalInput}
[ASSETS]: ${meta.assets.map(a => `[Reference Asset: ${a.type} at ${a.uri}]`).join(' ')}
[TASK_END]

Please process the input above and return the result in ${meta.constraints.outputFormat}.`;

    return { formattedPrompt: prompt, systemInstruction: system };
  }
}
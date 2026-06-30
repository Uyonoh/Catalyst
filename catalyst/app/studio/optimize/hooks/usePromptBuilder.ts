import { useState, useEffect } from "react";

export type FieldsState = {
  subject: string;
  shotType: string;
  cameraAngle: string;
  environment: string;
  compositionStyle: string;
  lighting: string; // references lightingOptions IDs
  mood: string;
  cameraBody: string;
  focalLength: string;
  lensType: string;
  filmStock: string;
  aspectRatio: string;
  photographerStyle: string;
  visualAesthetic: string;
  texture: string;
  colorGrade: string;
  negativePrompt: string;
};

export const INITIAL_FIELDS: FieldsState = {
  subject: "",
  shotType: "",
  cameraAngle: "",
  environment: "",
  compositionStyle: "",
  lighting: "",
  mood: "",
  cameraBody: "",
  focalLength: "",
  lensType: "",
  filmStock: "",
  aspectRatio: "1:1",
  photographerStyle: "",
  visualAesthetic: "",
  texture: "",
  colorGrade: "",
  negativePrompt: ""
};

import { lightingOptions } from "../data/lightingOptions";

export function buildPromptString(fields: FieldsState): string {
  const parts: string[] = [];

  // 1. Core Subject + Shot Type + Camera Angle
  if (fields.subject.trim()) {
    let mainSentence = "";
    const subjectTrimmed = fields.subject.trim();
    
    // Attempt formatting depending on what fields are present
    const hasShotType = !!fields.shotType.trim();
    const hasAngle = !!fields.cameraAngle.trim();
    
    if (hasShotType && hasAngle) {
      mainSentence = `A ${fields.cameraAngle.trim()} ${fields.shotType.trim()} of ${subjectTrimmed}`;
    } else if (hasShotType) {
      mainSentence = `A ${fields.shotType.trim()} of ${subjectTrimmed}`;
    } else if (hasAngle) {
      mainSentence = `A ${fields.cameraAngle.trim()} shot of ${subjectTrimmed}`;
    } else {
      mainSentence = subjectTrimmed;
    }
    parts.push(mainSentence);
  } else {
    // If no subject, return empty prompt
    return "";
  }

  // 2. Environment / Setting
  if (fields.environment.trim()) {
    parts.push(`set in ${fields.environment.trim()}`);
  }

  // 3. Composition
  if (fields.compositionStyle.trim()) {
    parts.push(`featuring ${fields.compositionStyle.trim()}`);
  }

  // 4. Lighting
  if (fields.lighting.trim()) {
    const selectedLight = lightingOptions.find(o => o.id === fields.lighting);
    if (selectedLight) {
      parts.push(selectedLight.promptText);
    } else {
      parts.push(`illuminated by ${fields.lighting.trim()}`);
    }
  }

  // 5. Mood / Atmosphere
  if (fields.mood.trim()) {
    parts.push(`with a ${fields.mood.trim()} atmosphere`);
  }

  // 6. Camera, Lens, Focal Length
  const cameraParts: string[] = [];
  if (fields.cameraBody.trim()) cameraParts.push(fields.cameraBody.trim());
  if (fields.lensType.trim()) cameraParts.push(fields.lensType.trim());
  if (fields.focalLength.trim()) cameraParts.push(fields.focalLength.trim());
  if (cameraParts.length > 0) {
    parts.push(`captured on a ${cameraParts.join(", ")}`);
  }

  // 7. Film Stock
  if (fields.filmStock.trim()) {
    parts.push(`shot on ${fields.filmStock.trim()} film stock`);
  }

  // 8. Visual Style / Photographer reference
  const styleRefs: string[] = [];
  if (fields.photographerStyle.trim()) styleRefs.push(fields.photographerStyle.trim());
  if (fields.visualAesthetic.trim()) styleRefs.push(fields.visualAesthetic.trim());
  if (styleRefs.length > 0) {
    parts.push(`in the style of ${styleRefs.join(" and ")}`);
  }

  // 9. Textures
  if (fields.texture.trim()) {
    parts.push(`characterized by ${fields.texture.trim()}`);
  }

  // 10. Color Grade
  if (fields.colorGrade.trim()) {
    parts.push(`color graded with ${fields.colorGrade.trim()}`);
  }

  // Assemble into one prompt with correct casing and terminal punctuation.
  let assembled = parts.join(", ");
  
  // Clean up any double spaces or strange double commas
  assembled = assembled.replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
  
  if (assembled.length > 0) {
    // Add period if not already ending in punctuation
    if (!/[.!?]$/.test(assembled)) {
      assembled += ".";
    }
  }

  return assembled;
}

export function usePromptBuilder() {
  const [fields, setFields] = useState<FieldsState>(INITIAL_FIELDS);
  const [assembledPrompt, setAssembledPrompt] = useState<string>("");

  const setField = (key: keyof FieldsState, value: string) => {
    setFields((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFields = (newFields: Partial<FieldsState>) => {
    setFields((prev) => ({
      ...prev,
      ...newFields
    }));
  };

  const resetFields = () => {
    setFields(INITIAL_FIELDS);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const prompt = buildPromptString(fields);
      setAssembledPrompt(prompt);
    }, 250); // 250ms Debounce

    return () => {
      clearTimeout(handler);
    };
  }, [fields]);

  return {
    fields,
    setField,
    applyFields,
    assembledPrompt,
    resetFields
  };
}

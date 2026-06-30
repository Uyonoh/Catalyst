"use client";

import React, { useState } from "react";
import { usePromptBuilder } from "./hooks/usePromptBuilder";
import { useImageGenerate } from "./hooks/useImageGenerate";
import { useSessionHistory } from "./hooks/useSessionHistory";
import PromptBuilderForm from "./components/PromptBuilderForm";
import ImageUploadZone from "./components/ImageUploadZone";
import GenerationPreview from "./components/GenerationPreview";
import SceneVariations from "./components/SceneVariations";
import ExportActions from "./components/ExportActions";
import PresetsPanel from "./components/PresetsPanel";
import TemplateLibrary from "./components/TemplateLibrary";
import SessionHistory from "./components/SessionHistory";
import Notification, { NotificationType } from "../../components/history/Notification";

export default function ImageOptimizeView() {
  // 1. Debounced Prompt Builder State Hook
  const {
    fields,
    setField,
    applyFields,
    assembledPrompt,
    resetFields,
  } = usePromptBuilder();

  // 2. Mock Image Generator State Hook
  const {
    status,
    result,
    error,
    generate,
    clear: clearGen,
  } = useImageGenerate();

  // 3. Generation Session History Hook
  const historyHook = useSessionHistory();

  // 4. Source Image Upload state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editType, setEditType] = useState("restyle");
  const [strength, setStrength] = useState(50);
  const [instructions, setInstructions] = useState("");

  // 5. Transient Notification Toast State
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  const triggerNotification = (message: string, type: NotificationType = "success") => {
    setNotification({ message, type });
  };

  const handleGenerate = async () => {
    if (!fields.subject.trim()) {
      triggerNotification("Subject definition is required.", "error");
      return;
    }

    // Capture prompt snapshot to trigger actual rendering process
    let finalPrompt = assembledPrompt;
    if (imageSrc) {
      // Append image editing context to generation prompt if present
      finalPrompt += `, edited using ${editType} mode at ${strength}% strength`;
      if (instructions.trim()) {
        finalPrompt += `, instruction: ${instructions.trim()}`;
      }
    }

    const payload = await generate(finalPrompt, fields.negativePrompt, fields.aspectRatio);
    if (payload) {
      triggerNotification("Image generated successfully!", "success");
      // Add successful generation snapshot to session history list
      historyHook.addSession(fields.subject, fields);
    }
  };

  const handleReset = () => {
    resetFields();
    clearGen();
    setImageSrc(null);
    setEditType("restyle");
    setStrength(50);
    setInstructions("");
    triggerNotification("All parameters cleared", "info");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ─── LEFT COLUMN: Prompt form, source upload and preview generation ─── */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <PromptBuilderForm
          fields={fields}
          onChangeField={setField}
          assembledPrompt={assembledPrompt}
          onReset={handleReset}
        />

        <ImageUploadZone
          imageSrc={imageSrc}
          onChange={setImageSrc}
          editType={editType}
          onEditTypeChange={setEditType}
          strength={strength}
          onStrengthChange={setStrength}
          instructions={instructions}
          onInstructionsChange={setInstructions}
        />

        <GenerationPreview
          status={status}
          result={result}
          error={error}
          onGenerate={handleGenerate}
          hasSubject={!!fields.subject.trim()}
          onValidationFail={() => triggerNotification("A subject is required to generate an image", "error")}
        />

        <SceneVariations
          baseAssembledPrompt={assembledPrompt}
          shotTypePhrase={fields.shotType}
          aspectRatio={fields.aspectRatio}
        />
      </div>

      {/* ─── RIGHT COLUMN: Presets, template styling, session log, sharing ─── */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <ExportActions
          assembledPrompt={assembledPrompt}
          fields={fields}
          onNotify={triggerNotification}
        />

        <PresetsPanel
          currentFields={fields}
          onApplyPreset={applyFields}
          onNotify={triggerNotification}
        />

        <TemplateLibrary
          onApplyTemplate={applyFields}
          onNotify={triggerNotification}
        />

        <SessionHistory
          onRestoreSession={applyFields}
          onNotify={triggerNotification}
          historyHook={historyHook}
        />
      </div>

      {/* Lightweight notification manager (Spec #14) */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

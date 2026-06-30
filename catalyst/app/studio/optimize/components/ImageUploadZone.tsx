"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Sliders, Image as ImageIcon } from "lucide-react";

interface ImageUploadZoneProps {
  imageSrc: string | null;
  onChange: (src: string | null) => void;
  editType: string;
  onEditTypeChange: (val: string) => void;
  strength: number;
  onStrengthChange: (val: number) => void;
  instructions: string;
  onInstructionsChange: (val: string) => void;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function ImageUploadZone({
  imageSrc,
  onChange,
  editType,
  onEditTypeChange,
  strength,
  onStrengthChange,
  instructions,
  onInstructionsChange,
}: ImageUploadZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File pasting handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1920;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get 2D canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type || "image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("Failed to load image for resizing"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Only PNG, JPEG, and WEBP are supported.");
      return;
    }

    try {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        // Compress client-side
        const resizedDataUrl = await resizeImage(file);
        onChange(resizedDataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Source Image (Optional Image-to-Image)
      </span>

      {!imageSrc ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={ALLOWED_TYPES.join(",")}
            className="hidden"
          />
          <Upload className="size-8 text-slate-400 mb-3 animate-pulse" />
          <p className="text-sm text-slate-200 font-semibold mb-1">
            Drag & drop, browse, or paste clipboard image
          </p>
          <p className="text-xs text-slate-500">
            Supports PNG, JPEG, WEBP up to 5MB (larger images auto-scaled)
          </p>
          {error && <p className="text-xs text-rose-400 font-semibold mt-3">{error}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Preview Panel */}
          <div className="md:col-span-4 relative rounded-xl border border-white/10 overflow-hidden bg-black/40 min-h-[160px] flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Source preview"
              className="max-w-full max-h-[180px] object-contain rounded-lg p-2"
            />
            <button
              onClick={() => {
                onChange(null);
                setError(null);
              }}
              className="absolute top-2.5 right-2.5 p-1 bg-black/60 hover:bg-black text-rose-400 hover:text-rose-300 rounded-lg border border-white/10 transition-colors shadow-lg active:scale-95"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Edit Mode Panel */}
          <div className="md:col-span-8 flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sliders className="size-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Image Edit Settings
              </span>
            </div>

            {/* Edit Type Select */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">
                Edit Method
              </label>
              <select
                value={editType}
                onChange={(e) => onEditTypeChange(e.target.value)}
                className="w-full text-xs bg-black/40 text-slate-200 px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="restyle">Restyle (Style Transfer)</option>
                <option value="upscale">Super Resolution (Upscale)</option>
                <option value="background_swap">Replace Background</option>
                <option value="color_grade">Color Grading</option>
                <option value="retouch">Portrait Retouching</option>
                <option value="add_remove">Add/Remove Elements</option>
                <option value="freeform">Freeform Instruction Edit</option>
              </select>
            </div>

            {/* Strength Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase">
                <span>Influence Intensity</span>
                <span className="text-cyan-400 font-mono">{strength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={strength}
                onChange={(e) => onStrengthChange(parseInt(e.target.value))}
                className="w-full h-1 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">
                Modification Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => onInstructionsChange(e.target.value)}
                placeholder="Describe modifications (e.g., 'Make it look like a oil painting')"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

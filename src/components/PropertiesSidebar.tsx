import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { EnclosureSpec, ViewSettings } from "../types";

interface PropertiesSidebarProps {
  enclosure: EnclosureSpec;
  setEnclosure: (enc: EnclosureSpec) => void;
  viewSettings: ViewSettings;
  setViewSettings: (settings: ViewSettings) => void;
}

export function PropertiesSidebar({
  enclosure,
  setEnclosure,
  viewSettings,
  setViewSettings,
}: PropertiesSidebarProps) {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleChange = (
    key: keyof EnclosureSpec["dimensions"],
    value: string
  ) => {
    setEnclosure({
      ...enclosure,
      dimensions: {
        ...enclosure.dimensions,
        [key]: Number(value),
      },
    });
  };

  const handleThicknessChange = (value: string) => {
    setEnclosure({ ...enclosure, wallThickness: Number(value) });
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const content = JSON.stringify(enclosure, null, 2);
      await invoke("save_file", {
        path: "enclosure_params.json",
        contents: content,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save file:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-black h-full flex flex-col">
      <div className="p-4 border-b border-black bg-white">
        <h2 className="font-semibold text-lg text-black">Properties</h2>
        <p className="text-xs text-[#0038DF]">Parametric Enclosure Settings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dimensions Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-black border-b border-black pb-1">
            Dimensions (mm)
          </h3>

          {/* Length */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <label htmlFor="length">Length</label>
              <span>{enclosure.dimensions.length}mm</span>
            </div>
            <input
              type="range"
              id="length"
              min="10"
              max="200"
              value={enclosure.dimensions.length}
              onChange={(e) => handleChange("length", e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <label htmlFor="width">Width</label>
              <span>{enclosure.dimensions.width}mm</span>
            </div>
            <input
              type="range"
              id="width"
              min="10"
              max="200"
              value={enclosure.dimensions.width}
              onChange={(e) => handleChange("width", e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <label htmlFor="height">Height</label>
              <span>{enclosure.dimensions.height}mm</span>
            </div>
            <input
              type="range"
              id="height"
              min="5"
              max="100"
              value={enclosure.dimensions.height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Wall Thickness */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-gray-600">
              <label htmlFor="thickness">Wall Thickness</label>
              <span>{enclosure.wallThickness}mm</span>
            </div>
            <input
              type="range"
              id="thickness"
              min="1"
              max="10"
              step="0.5"
              value={enclosure.wallThickness}
              onChange={(e) => handleThicknessChange(e.target.value)}
              className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>
        </div>

        {/* View Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-black border-b border-black pb-1">
            View Options
          </h3>

          <div className="flex items-center justify-between">
            <label className="text-xs text-black">Exploded View</label>
            <button
              onClick={() =>
                setViewSettings({
                  ...viewSettings,
                  exploded: !viewSettings.exploded,
                })
              }
              className={`w-10 h-5 rounded-full relative transition-colors ${
                viewSettings.exploded ? "bg-[#0038DF]" : "bg-black/20"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                  viewSettings.exploded ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-black">Clipping Plane</label>
            <button
              onClick={() =>
                setViewSettings({
                  ...viewSettings,
                  clipping: !viewSettings.clipping,
                })
              }
              className={`w-10 h-5 rounded-full relative transition-colors ${
                viewSettings.clipping ? "bg-[#0038DF]" : "bg-black/20"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                  viewSettings.clipping ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-black bg-white">
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`w-full py-2 px-4 text-white font-medium rounded-md shadow-sm transition-colors text-sm ${
            saveStatus === "success"
              ? "bg-green-600 hover:bg-green-700"
              : saveStatus === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-[#0038DF] hover:bg-[#002bb2]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "success" && "Saved!"}
          {saveStatus === "error" && "Error!"}
          {saveStatus === "idle" && "Save Configuration"}
        </button>
      </div>
    </div>
  );
}

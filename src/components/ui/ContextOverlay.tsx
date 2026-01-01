import { EnclosureSpec, ViewSettings } from "../../types";

interface ContextOverlayProps {
  enclosure: EnclosureSpec;
  setEnclosure: (enc: EnclosureSpec) => void;
  viewSettings: ViewSettings;
  setViewSettings: (settings: ViewSettings) => void;
  onSave: () => void;
}

export function ContextOverlay({
  enclosure,
  setEnclosure,
  viewSettings,
  setViewSettings,
  onSave,
}: ContextOverlayProps) {
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

  return (
    <div className="absolute top-1/2 right-32 -translate-y-1/2 w-72 bg-white border border-black rounded-xl shadow-2xl p-5 z-20">
      <div className="flex justify-between items-center mb-4 border-b border-black pb-2">
        <h3 className="font-bold text-black text-lg">Properties</h3>
        <button
          onClick={onSave}
          className="text-[#0038DF] text-xs font-mono uppercase hover:underline"
        >
          Save
        </button>
      </div>

      <div className="space-y-5">
        {/* Dimensions */}
        <div className="space-y-4">
          {/* Length */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-black">
              <label>Length</label>
              <span className="font-mono">{enclosure.dimensions.length}mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={enclosure.dimensions.length}
              onChange={(e) => handleChange("length", e.target.value)}
              className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-black">
              <label>Width</label>
              <span className="font-mono">{enclosure.dimensions.width}mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={enclosure.dimensions.width}
              onChange={(e) => handleChange("width", e.target.value)}
              className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-black">
              <label>Height</label>
              <span className="font-mono">{enclosure.dimensions.height}mm</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={enclosure.dimensions.height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>

          {/* Thickness */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-black">
              <label>Thickness</label>
              <span className="font-mono">{enclosure.wallThickness}mm</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={enclosure.wallThickness}
              onChange={(e) => handleThicknessChange(e.target.value)}
              className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0038DF]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setViewSettings({
                ...viewSettings,
                exploded: !viewSettings.exploded,
              })
            }
            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
              viewSettings.exploded
                ? "bg-[#0038DF] text-white border-[#0038DF]"
                : "bg-white text-black border-black/20"
            }`}
          >
            Exploded
          </button>
          <button
            onClick={() =>
              setViewSettings({
                ...viewSettings,
                clipping: !viewSettings.clipping,
              })
            }
            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
              viewSettings.clipping
                ? "bg-[#0038DF] text-white border-[#0038DF]"
                : "bg-white text-black border-black/20"
            }`}
          >
            Clipping
          </button>
        </div>
      </div>
    </div>
  );
}

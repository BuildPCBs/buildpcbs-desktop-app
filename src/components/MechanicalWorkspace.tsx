import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Viewport3D } from "./Viewport3D";
import { AgentTerminal } from "./AgentTerminal";
import { TopToolbar } from "./ui/TopToolbar";
import { LeftToolbar } from "./ui/LeftToolbar";
import { ContextOverlay } from "./ui/ContextOverlay";
import { NotificationToast } from "./ui/NotificationToast";
import { EnclosureSpec, ViewSettings } from "../types";

export function MechanicalWorkspace() {
  const [enclosure, setEnclosure] = useState<EnclosureSpec>({
    dimensions: {
      length: 50,
      width: 50,
      height: 20,
    },
    wallThickness: 2,
    material: "PLA",
  });

  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    exploded: false,
    clipping: false,
  });

  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleDimensionsChange = (newDims: EnclosureSpec["dimensions"]) => {
    setEnclosure((prev) => ({ ...prev, dimensions: newDims }));
  };

  const handleSave = async () => {
    try {
      const content = JSON.stringify(enclosure, null, 2);
      await invoke("save_file", {
        path: "enclosure_params.json",
        contents: content,
      });
      setNotification({ msg: "Project Saved Successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setNotification({ msg: "Failed to Save", type: "error" });
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-black relative overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-black">
        <Viewport3D enclosure={enclosure} viewSettings={viewSettings} />

        {/* UI Overlays */}
        <TopToolbar />
        <LeftToolbar />
        <ContextOverlay
          enclosure={enclosure}
          setEnclosure={setEnclosure}
          viewSettings={viewSettings}
          setViewSettings={setViewSettings}
          onSave={handleSave}
        />
        <NotificationToast
          message={notification?.msg || null}
          type={notification?.type}
          onClear={() => setNotification(null)}
        />
      </div>

      {/* Agent Terminal at Bottom */}
      <AgentTerminal
        currentDimensions={enclosure.dimensions}
        onUpdateDimensions={handleDimensionsChange}
      />
    </div>
  );
}

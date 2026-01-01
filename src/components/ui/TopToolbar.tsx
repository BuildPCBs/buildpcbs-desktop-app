import { useState } from "react";
import { MousePointer2, Move, RotateCw, Maximize2, Ruler } from "lucide-react";

export function TopToolbar() {
  const [active, setActive] = useState<string>("Select");

  const tools = [
    { name: "Select", icon: MousePointer2 },
    { name: "Move", icon: Move },
    { name: "Rotate", icon: RotateCw },
    { name: "Scale", icon: Maximize2 },
    { name: "Measure", icon: Ruler },
  ];

  const buttonWidth = 64;
  const buttonHeight = 40;

  const generatePath = () => {
    let path = `M 0 0`;

    tools.forEach((_, i) => {
      const startX = i * buttonWidth;
      const w = buttonWidth;
      const h = buttonHeight;

      // Semicircular bulge with smooth valleys
      // Control points positioned for circular arc approximation
      // Magic constant for circular Bezier: ~0.552

      // First half: create circular bulge down
      path += ` C ${startX + w * 0.1},${h * 0.65} ${startX + w * 0.3},${h} ${
        startX + w * 0.5
      },${h}`;
      // Second half: mirror back up to next valley (keep valley smooth)
      path += ` S ${startX + w * 0.9},${h * 0.65} ${startX + w},0`;
    });
    return path;
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
      {/* The Wavy Border Layer */}
      <svg
        width={tools.length * buttonWidth}
        height={buttonHeight * 2}
        className="absolute top-0 left-0 pointer-events-none overflow-visible"
      >
        <path
          d={generatePath()}
          fill="none"
          stroke="#0038DF"
          strokeWidth="1.5"
        />
      </svg>

      {/* The Interactive Layer */}
      <div className="flex">
        {tools.map((tool) => {
          const isActive = active === tool.name;
          const Icon = tool.icon;
          return (
            <button
              key={tool.name}
              onClick={() => setActive(tool.name)}
              className="w-16 h-12 flex items-center justify-center relative group focus:outline-none"
              title={tool.name}
            >
              <Icon
                className={`transition-all duration-300
                  ${
                    isActive
                      ? "w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : "w-4 h-4 text-white opacity-60 group-hover:scale-110 group-hover:opacity-100"
                  }
                `}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

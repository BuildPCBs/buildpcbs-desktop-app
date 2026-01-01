import { useState } from "react";
import { Home, Layers, Settings, Cpu } from "lucide-react";

export function LeftToolbar() {
  const [active, setActive] = useState<string>("home");

  // Placeholder icons (squares for now)
  const items = [
    { id: "home", icon: Home },
    { id: "layers", icon: Layers },
    { id: "build", icon: Cpu },
    { id: "settings", icon: Settings },
  ];

  const buttonHeight = 64;
  const buttonWidth = 40;

  const generatePath = () => {
    let path = `M 0 0`;

    items.forEach((_, i) => {
      const startY = i * buttonHeight;
      const h = buttonHeight;
      const w = buttonWidth;

      // Semicircular bulge (horizontal) with smooth valleys (vertical)
      // Control points for circular arc approximation

      // First half: create circular bulge outward
      path += ` C ${w * 0.65},${startY + h * 0.1} ${w},${
        startY + h * 0.3
      } ${w},${startY + h * 0.5}`;
      // Second half: smooth return to edge
      path += ` S ${w * 0.65},${startY + h * 0.9} 0,${startY + h}`;
    });
    return path;
  };

  return (
    <div className="absolute left-0 top-32 z-10">
      <svg
        width={buttonWidth * 2}
        height={items.length * buttonHeight}
        className="absolute top-0 left-0 pointer-events-none overflow-visible"
      >
        <path
          d={generatePath()}
          fill="none"
          stroke="#0038DF"
          strokeWidth="1.5"
        />
      </svg>

      <div className="flex flex-col">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="w-12 h-16 flex items-center justify-center relative group focus:outline-none"
            >
              <Icon
                className={`transition-all duration-300
                  ${
                    isActive
                      ? "w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : "w-5 h-5 text-white opacity-60 group-hover:scale-110 group-hover:opacity-100"
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

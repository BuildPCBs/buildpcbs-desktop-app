import { useState } from "react";
import { EnclosureSpec } from "../types";

interface AgentTerminalProps {
  onUpdateDimensions: (dimensions: EnclosureSpec["dimensions"]) => void;
  currentDimensions: EnclosureSpec["dimensions"];
}

export function AgentTerminal({
  onUpdateDimensions,
  currentDimensions,
}: AgentTerminalProps) {
  const [input, setInput] = useState("");

  const processHardwarePrompt = (text: string) => {
    const lower = text.toLowerCase();
    const newDims = { ...currentDimensions };
    let changed = false;

    // Simple regex for "Xmm <dimension>"
    const widthMatch = lower.match(/(\d+)\s*mm\s*wide/);
    if (widthMatch) {
      newDims.width = parseInt(widthMatch[1]);
      changed = true;
    }

    const heightMatch = lower.match(/(\d+)\s*mm\s*high/);
    if (heightMatch) {
      newDims.height = parseInt(heightMatch[1]);
      changed = true;
    }

    const lengthMatch = lower.match(/(\d+)\s*mm\s*long/);
    if (lengthMatch) {
      newDims.length = parseInt(lengthMatch[1]);
      changed = true;
    }

    // Also support "length" keyword if "long" isn't used
    const lengthMatchAlt = lower.match(/(\d+)\s*mm\s*length/);
    if (lengthMatchAlt) {
      newDims.length = parseInt(lengthMatchAlt[1]);
      changed = true;
    }

    if (changed) {
      onUpdateDimensions(newDims);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processHardwarePrompt(input);
      setInput("");
    }
  };

  return (
    <div className="h-16 bg-black border-t border-[#0038DF] flex items-center px-4 shrink-0">
      <div className="text-[#0038DF] mr-3 text-lg font-mono">{">"}</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the Agent (e.g., 'Make a case 100mm wide and 30mm high')"
        className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-[#0038DF]/50"
      />
    </div>
  );
}

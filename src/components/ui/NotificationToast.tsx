import { useEffect, useState } from "react";

interface NotificationToastProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onClear: () => void;
}

export function NotificationToast({
  message,
  type = "info",
  onClear,
}: NotificationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClear, 300); // clear after fade out
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message && !visible) return null;

  return (
    <div
      className={`
        absolute bottom-24 right-8 z-30
        px-6 py-3 rounded-full border border-black shadow-xl
        font-medium text-sm transition-all duration-300 transform
        ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        ${
          type === "success" ? "bg-[#0038DF] text-white" : "bg-white text-black"
        }
      `}
    >
      {message}
    </div>
  );
}

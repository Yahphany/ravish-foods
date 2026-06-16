import React, { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Toasts() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="max-w-xs bg-white shadow-md rounded-lg p-3 border border-gray-200 text-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-gray-800">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

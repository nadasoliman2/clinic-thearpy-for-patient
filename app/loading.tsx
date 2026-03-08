"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Loading() {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#09b6ab"); // نفس لون تركواز الموقع

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/30 to-white px-4" dir="rtl">
      
      {/* Spinner */}
      <ClipLoader
        color={color}
        loading={loading}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

      {/* نص توضيحي */}
      <p className="mt-6 text-lg md:text-xl text-foreground font-medium text-center max-w-sm">
        جاري تحميل الصفحة… من فضلك انتظر لحظة
      </p>

      {/* زر لإيقاف/تشغيل الـ spinner للتجربة */}
      <button
        onClick={() => setLoading(!loading)}
        className="mt-6 px-6 py-3 bg-[#09b6ab] text-white rounded-full hover:bg-[#09b6ab]/90 transition-transform hover:scale-105 font-bold"
      >
        Toggle Loader
      </button>

      {/* اختيار اللون لو حابة */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="mt-4 w-24 h-10 rounded-lg border border-border p-1"
      />
    </div>
  );
}
"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <h1 className="text-3xl font-bold mb-4 text-red-500">
        حدث خطأ غير متوقع
      </h1>

      <p className="text-muted-foreground mb-6">
        {error.message}
      </p>

      <Button
        onClick={() => reset()}
        className="bg-[#09b6ab] hover:bg-[#09b6ab]/90 text-white rounded-full"
      >
        إعادة المحاولة
      </Button>
    </div>
  )
}
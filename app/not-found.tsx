import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Calendar } from "lucide-react"

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-white px-4"
    >
      <div className="text-center space-y-6 max-w-xl">

        <h1 className="text-6xl font-extrabold text-[#09b6ab]">
          404
        </h1>

        <h2 className="text-2xl font-bold text-foreground">
          الصفحة غير موجودة
        </h2>

        <p className="text-muted-foreground">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <div className="flex justify-center gap-4 pt-4 flex-wrap">

          <Link href="/">
            <Button className="bg-[#09b6ab] hover:bg-[#09b6ab]/90 text-white rounded-full px-6 py-5">
              <Home className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>

          <Link href="/booking">
            <Button variant="outline" className="rounded-full  hover:bg-[#09b6ab]/90  px-6 py-5">
              <Calendar className="ml-2 h-4 w-4" />
              احجز موعد
            </Button>
          </Link>

        </div>
      </div>
    </div>
  )
}
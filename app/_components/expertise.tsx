import {
  Activity,
  UserCheck,
  BadgeCheck,
  ChevronRight
} from "lucide-react"
const expertise = [
  {
    title: 'Advanced Diagnostics',
    description:
      'State-of-the-art imaging and assessment to identify root causes, not just symptoms.',
    icon: Activity,
  },
  {
    title: 'Expert Specialists',
    description:
      'Board-certified therapists with 10+ years experience in sports and recovery medicine.',
    icon: UserCheck,
  },
  {
    title: 'Proven Results',
    description:
      '95% of patients report significant improvement within 6 weeks of starting care.',
    icon: BadgeCheck,
  },
]
export default function Expertise(){
    return(
        <>
            <section id="expertise" className="bg-white py-20">

              <div className="max-w-7xl mx-auto px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
      Our Expertise
    </h2>

        <div className="grid md:grid-cols-3 gap-6">
  {expertise.map((item, idx) => {
    const Icon = item.icon

    return (
      <div
        key={idx}
        className="group p-8 rounded-2xl bg-white border border-border 
                   hover:border-[#09b6ab] hover:shadow-xl transition 
                   flex flex-col"
      >
        {/* Icon */}
        <div className="w-16 h-16 mb-5 rounded-xl bg-[#09b6ab]/10 
                        flex items-center justify-center
                        group-hover:bg-[#09b6ab] transition">
          <Icon className="w-8 h-8 text-[#09b6ab] group-hover:text-white transition" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">
          {item.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="mt-6 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition">
          <a
            href="/booking"
            className="text-[#09b6ab] font-semibold text-sm flex items-center gap-2"
          >
            Book Now <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  })}
</div>

</div>
</section>
</>

     
    )
}
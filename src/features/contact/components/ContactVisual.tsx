import { Reveal } from '@/components/motion/Reveal'
import { Parallax } from '@/components/motion/Parallax'
import { contactContent } from '@/features/contact/data/contact'

export function ContactVisual() {
  const { image } = contactContent

  return (
    <Reveal
      delay={0.08}
      className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/5 md:aspect-auto md:min-h-[36rem] md:self-stretch"
    >
      <Parallax speed={0.18} clip className="absolute inset-0 h-full">
        <div className="h-[130%] w-full -translate-y-[12%]">
          <img
            src={image.src}
            alt={image.alt}
            className="size-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </Parallax>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent pb-10"
      >
        <span className="text-[clamp(3.5rem,12vw,7rem)] leading-none font-extrabold tracking-tight text-white uppercase">
          {image.overlay}
        </span>
      </div>
    </Reveal>
  )
}

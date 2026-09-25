import { Reveal } from '@/components/motion/Reveal'
import { Parallax } from '@/components/motion/Parallax'
import { aboutContent } from '@/features/about/data/about'

export function AboutHero() {
  const { hero, portrait } = aboutContent

  return (
    <section className="relative flex min-h-[88dvh] flex-col items-center justify-center px-4 pt-28 pb-8 md:px-6 md:pt-32">
      <Reveal className="relative z-10 text-center">
        <h1 className="text-[clamp(3rem,12vw,8.5rem)] leading-[0.9] font-extrabold tracking-tight uppercase">
          <span className="block">{hero.line1}</span>
          <span className="block">{hero.line2}</span>
        </h1>
      </Reveal>

      <div className="relative z-0 -mt-6 w-[min(78vw,30rem)] overflow-hidden rounded-full md:-mt-10 md:w-[min(42vw,28rem)]">
        <Parallax speed={0.22} clip>
          <div className="aspect-square scale-[1.35]">
            <img
              src={portrait.src}
              alt={portrait.alt}
              className="size-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </Parallax>
      </div>
    </section>
  )
}

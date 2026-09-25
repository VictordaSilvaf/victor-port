import { LayoutGridIcon } from 'lucide-react'


export default function MenuButton() {
  return (
    <button className="flex items-center justify-center p-2 rounded-full hover:rotate-45 transition-transform duration-300">
      <LayoutGridIcon className='w-6 h-6 text-foreground/70' />
    </button>
  )
}
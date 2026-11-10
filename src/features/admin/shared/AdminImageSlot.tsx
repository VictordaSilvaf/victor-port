import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

type AdminImageSlotProps = {
  id: string
  label: string
  description?: string
  url?: string
  uploading?: boolean
  onFile: (file: File) => void
}

export function AdminImageSlot({
  id,
  label,
  description,
  url,
  uploading,
  onFile,
}: AdminImageSlotProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {uploading ? <Badge variant="outline">Uploading…</Badge> : null}
      </div>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {url ? (
        <img
          src={url}
          alt={`Preview — ${label}`}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full max-w-xs rounded-lg border object-cover"
        />
      ) : (
        <div className="flex aspect-[4/5] w-full max-w-xs items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
          Sem imagem
        </div>
      )}
      <Input
        id={id}
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}

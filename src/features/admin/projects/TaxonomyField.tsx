import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import type { TaxonomyItem } from '@/lib/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'

type TaxonomyFieldProps = {
  label: string
  items: TaxonomyItem[]
  selected: string[]
  onSelectedChange: (ids: string[]) => void
  onCreated: (item: TaxonomyItem) => void
  createItem: (name: string) => Promise<TaxonomyItem>
  placeholder?: string
}

export function TaxonomyField({
  label,
  items,
  selected,
  onSelectedChange,
  onCreated,
  createItem,
  placeholder = 'Novo item…',
}: TaxonomyFieldProps) {
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('')

  const selectedItems = useMemo(
    () => items.filter((item) => selected.includes(item.id)),
    [items, selected],
  )

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query),
    )
  }, [items, filter])

  const createMutation = useMutation({
    mutationFn: async (name: string) => createItem(name),
    onSuccess: (item) => {
      onCreated(item)
      onSelectedChange(
        selected.includes(item.id) ? selected : [...selected, item.id],
      )
      setDraft('')
      setFilter('')
      toast.success('Adicionado')
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : 'Não foi possível criar',
      )
    },
  })

  function toggle(id: string, checked: boolean) {
    onSelectedChange(
      checked ? [...selected, id] : selected.filter((value) => value !== id),
    )
  }

  function submitCreate() {
    const name = draft.trim()
    if (!name || createMutation.isPending) return
    createMutation.mutate(name)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {selectedItems.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="gap-1 pr-1 font-normal"
            >
              {item.name}
              <button
                type="button"
                className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => toggle(item.id, false)}
                aria-label={`Remover ${item.name}`}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitCreate()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!draft.trim() || createMutation.isPending}
          onClick={submitCreate}
          aria-label={`Criar ${label.toLowerCase()}`}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <Input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrar lista…"
        className="h-8 text-xs"
      />

      <div
        className={cn(
          'max-h-36 space-y-1 overflow-auto rounded-lg border bg-muted/20 p-2',
        )}
      >
        {filtered.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">
            {items.length === 0
              ? 'Ainda vazio — escreve acima e adiciona.'
              : 'Nenhum resultado.'}
          </p>
        ) : (
          filtered.map((item) => {
            const checked = selected.includes(item.id)
            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors hover:bg-muted/60"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => toggle(item.id, Boolean(value))}
                />
                <span className="truncate">{item.name}</span>
              </label>
            )
          })
        )}
      </div>
    </div>
  )
}

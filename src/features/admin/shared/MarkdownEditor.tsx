import { useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

type Mode = 'write' | 'preview' | 'split'

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after = before,
) {
  const selected = value.slice(start, end) || 'texto'
  const next =
    value.slice(0, start) + before + selected + after + value.slice(end)
  return {
    next,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  }
}

function prefixLines(
  value: string,
  start: number,
  end: number,
  prefix: string,
) {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const lineEndIndex = value.indexOf('\n', end)
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex
  const block = value.slice(lineStart, lineEnd)
  const nextBlock = block
    .split('\n')
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
    .join('\n')
  return {
    next: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  }
}

const modes: { id: Mode; label: string }[] = [
  { id: 'write', label: 'Escrever' },
  { id: 'split', label: 'Dividir' },
  { id: 'preview', label: 'Preview' },
]

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escreve em markdown…',
  className,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>('split')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasPreview = Boolean(value.trim())

  const tools = useMemo(
    () => [
      {
        label: 'Negrito',
        icon: BoldIcon,
        run: () =>
          applyEdit((v, s, e) => wrapSelection(v, s, e, '**')),
      },
      {
        label: 'Itálico',
        icon: ItalicIcon,
        run: () => applyEdit((v, s, e) => wrapSelection(v, s, e, '_')),
      },
      {
        label: 'Título',
        icon: Heading2Icon,
        run: () => applyEdit((v, s, e) => prefixLines(v, s, e, '## ')),
      },
      {
        label: 'Lista',
        icon: ListIcon,
        run: () => applyEdit((v, s, e) => prefixLines(v, s, e, '- ')),
      },
      {
        label: 'Lista numerada',
        icon: ListOrderedIcon,
        run: () => applyEdit((v, s, e) => prefixLines(v, s, e, '1. ')),
      },
      {
        label: 'Citação',
        icon: QuoteIcon,
        run: () => applyEdit((v, s, e) => prefixLines(v, s, e, '> ')),
      },
      {
        label: 'Código',
        icon: CodeIcon,
        run: () => applyEdit((v, s, e) => wrapSelection(v, s, e, '`')),
      },
      {
        label: 'Link',
        icon: LinkIcon,
        run: () =>
          applyEdit((v, s, e) => {
            const selected = v.slice(s, e) || 'link'
            const inserted = `[${selected}](https://)`
            return {
              next: v.slice(0, s) + inserted + v.slice(e),
              selectionStart: s + selected.length + 3,
              selectionEnd: s + inserted.length - 1,
            }
          }),
      },
    ],
    // applyEdit closes over value/onChange; rebuild when value changes is fine
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  )

  function applyEdit(
    mutate: (
      current: string,
      start: number,
      end: number,
    ) => { next: string; selectionStart: number; selectionEnd: number },
  ) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const result = mutate(value, start, end)
    onChange(result.next)
    requestAnimationFrame(() => {
      const target = textareaRef.current
      if (!target) return
      target.focus()
      target.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card shadow-xs',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          {tools.map((tool) => (
            <Button
              key={tool.label}
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={tool.run}
              aria-label={tool.label}
              title={tool.label}
            >
              <tool.icon className="size-3.5" />
            </Button>
          ))}
        </div>
            <div className="inline-flex rounded-lg bg-muted p-0.75">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                mode === item.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'grid min-h-72',
          mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1',
        )}
      >
        {mode !== 'preview' ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={cn(
              'min-h-72 resize-none rounded-none border-0 bg-transparent font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0 md:text-[13px]',
              mode === 'split' && 'lg:min-h-80 lg:border-r',
            )}
          />
        ) : null}

        {mode !== 'write' ? (
          <div
            className={cn(
              'markdown-preview min-h-72 overflow-auto px-4 py-3',
              mode === 'split' && 'bg-muted/15 lg:min-h-80',
            )}
          >
            {hasPreview ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">
                O preview aparece aqui enquanto escreves.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"
import { Slot } from "radix-ui"

const LETTER_STAGGER_MS = 16
const LETTER_COLOR_MS = 120
const LETTER_BASE_DELAY_MS = 70


const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center cursor-pointer justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground transition-all hover:bg-primary/80",
        outline:
          "relative overflow-hidden rounded-none border-foreground bg-transparent text-foreground transition-[border-color] duration-300 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-foreground before:transition-[clip-path] before:duration-[420ms] before:ease-[cubic-bezier(0.22,1,0.36,1)] before:[clip-path:polygon(0_0,0_0,0_0)] hover:before:[clip-path:polygon(0_0,230%_0,0_230%)] dark:before:bg-foreground [&>*]:relative [&>*]:z-10",
        secondary:
          "bg-secondary text-secondary-foreground transition-all hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "transition-all hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive transition-all hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 transition-all hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-1.5 px-6 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type Counter = { value: number }

function splitToLetters(text: string, startIndex: number) {
  return Array.from(text).map((char, i) => {
    const index = startIndex + i
    return (
      <span
        key={`${index}-${char}`}
        aria-hidden="true"
        data-outline-letter=""
        className="inline-block text-foreground transition-colors ease-out group-hover/button:text-background"
        style={
          {
            transitionDuration: `${LETTER_COLOR_MS}ms`,
            "--letter-i": index,
          } as React.CSSProperties
        }
      >
        {char === " " ? "\u00A0" : char}
      </span>
    )
  })
}

function isIconElement(
  node: React.ReactElement<{ children?: React.ReactNode }>,
) {
  const { children } = node.props
  if (children == null) return true
  if (typeof children === "string" || typeof children === "number") return false

  const list = React.Children.toArray(children)
  return list.every(
    (child) => typeof child !== "string" && typeof child !== "number",
  )
}

function applyLetterStagger(
  node: React.ReactNode,
  counter: Counter,
): React.ReactNode {
  if (node == null || typeof node === "boolean") return node

  if (typeof node === "string" || typeof node === "number") {
    const letters = splitToLetters(String(node), counter.value)
    counter.value += letters.length
    return letters
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{applyLetterStagger(child, counter)}</React.Fragment>
    ))
  }

  if (
    React.isValidElement<{ children?: React.ReactNode; className?: string; style?: React.CSSProperties }>(
      node,
    )
  ) {
    if (isIconElement(node)) {
      const delay = LETTER_BASE_DELAY_MS + counter.value * LETTER_STAGGER_MS
      return React.cloneElement(node, {
        className: cn(
          node.props.className,
          "text-foreground group-hover/button:text-background",
        ),
        style: {
          ...node.props.style,
          // Tailwind v4 sets `rotate` as its own property, not via `transform`.
          transitionProperty: "color, rotate",
          transitionDuration: `${LETTER_COLOR_MS}ms, var(--icon-rotate-ms, 500ms)`,
          transitionTimingFunction: "ease-out, var(--icon-rotate-ease, cubic-bezier(0.22, 1, 0.36, 1))",
          ["--icon-delay" as string]: `${delay}ms`,
        },
        "data-outline-icon": "",
      } as never)
    }

    return React.cloneElement(node, {
      children: applyLetterStagger(node.props.children, counter),
    } as never)
  }

  return node
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return ""
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const isOutline = variant === "outline" && !asChild
  const accessibleLabel = isOutline ? extractText(children) : null
  const content = isOutline
    ? applyLetterStagger(children, { value: 0 })
    : children

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, className }),
        isOutline &&
          cn(
            "[&_[data-outline-letter]]:[transition-delay:0ms]",
            "hover:[&_[data-outline-letter]]:[transition-delay:calc(70ms+var(--letter-i)*16ms)]",
            "[&_[data-outline-icon]]:[transition-delay:0ms,0ms]",
            "hover:[&_[data-outline-icon]]:[transition-delay:var(--icon-delay,0ms),0ms]",
          ),
      )}
      {...props}
    >
      {isOutline ? (
        <>
          {accessibleLabel ? (
            <span className="sr-only">{accessibleLabel}</span>
          ) : null}
          {content}
        </>
      ) : (
        content
      )}
    </Comp>
  )
}

export { Button, buttonVariants }

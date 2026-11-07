import { useEffect, useState } from 'react'
import {
  fetchProjectBySlug,
  listProjects,
  mapProjectDetail,
  mapProjectSummary,
} from '@/lib/api'
import {
  getAdjacentProjects as getStaticAdjacent,
  getProjectBySlug as getStaticProject,
  projects as staticProjects,
} from '@/features/projects/data/projects'
import type { Project } from '@/features/projects/types/project'

function adjacentFromList(items: Project[], slug: string) {
  const index = items.findIndex((project) => project.slug === slug)
  if (index < 0) return { prev: null, next: null, index: -1 }

  return {
    index,
    prev: index > 0 ? items[index - 1]! : null,
    next: index < items.length - 1 ? items[index + 1]! : null,
  }
}

export function useProjectsList() {
  const [items, setItems] = useState<Project[]>(staticProjects)
  const [ready, setReady] = useState(false)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    let cancelled = false

    listProjects({ sort: 'sort_order', direction: 'asc', per_page: 100 })
      .then((response) => {
        if (cancelled) return
        if (response.data.length > 0) {
          setItems(response.data.map(mapProjectSummary))
          setFromApi(true)
        }
      })
      .catch(() => {
        if (cancelled) return
        setItems(staticProjects)
        setFromApi(false)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { items, ready, fromApi }
}

type ProjectPageReady = {
  status: 'ready'
  project: Project
  index: number
  prev: Project | null
  next: Project | null
}

type ProjectPageState =
  | { status: 'loading' }
  | ProjectPageReady
  | { status: 'missing' }

/** Keep last ready payload so HMR / StrictMode remounts don't blank the page. */
const projectPageCache = new Map<string, ProjectPageReady>()

export function useProjectPage(slug: string) {
  const [state, setState] = useState<ProjectPageState>(
    () => projectPageCache.get(slug) ?? { status: 'loading' },
  )

  useEffect(() => {
    let cancelled = false
    const cached = projectPageCache.get(slug)

    // Keep current project visible while refetching; only blank on first visit.
    if (cached) {
      setState(cached)
    } else {
      setState({ status: 'loading' })
    }

    async function load() {
      try {
        const [detail, list] = await Promise.all([
          fetchProjectBySlug(slug),
          listProjects({ sort: 'sort_order', direction: 'asc', per_page: 100 }),
        ])

        if (cancelled) return

        if (detail) {
          const project = mapProjectDetail(detail)
          const mappedList =
            list.data.length > 0
              ? list.data.map(mapProjectSummary)
              : staticProjects
          const adjacent = adjacentFromList(mappedList, slug)
          const ready: ProjectPageReady = {
            status: 'ready',
            project,
            index: adjacent.index >= 0 ? adjacent.index : 0,
            prev: adjacent.prev,
            next: adjacent.next,
          }
          projectPageCache.set(slug, ready)
          setState(ready)
          return
        }
      } catch {
        // fall through to static
      }

      if (cancelled) return

      const fallback = getStaticProject(slug)
      if (!fallback) {
        projectPageCache.delete(slug)
        setState({ status: 'missing' })
        return
      }

      const adjacent = getStaticAdjacent(slug)
      const ready: ProjectPageReady = {
        status: 'ready',
        project: fallback,
        index: adjacent.index,
        prev: adjacent.prev,
        next: adjacent.next,
      }
      projectPageCache.set(slug, ready)
      setState(ready)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}

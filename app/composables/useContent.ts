export interface ContentTranslation { contentKey: string; contentType?: string; locale: string; title: string; summary?: string; renderedHtml: string; toc?: string | Array<{ level: number; title: string; id: string }>; breadcrumbs: string[]; availableLocales: string[]; updatedAt?: string; seo?: { title: string; description: string } }
export interface NavigationItem { id: number; parentId: number; nodeType: string; contentId?: number; contentKey?: string; externalUrl?: string; label: string; visible: boolean; depth: number; sortOrder?: number }
export interface ContentManifestItem { contentKey: string; navigationNodeId?: number; title: string; summary?: string; updatedAt?: string }
export interface ContentSearchItem { contentKey: string; title: string; summary?: string; breadcrumbs?: string[]; navigationPath?: string; updatedAt?: string }

export function useContentApi() {
  const config = useRuntimeConfig()
  const base = String(import.meta.server ? config.contentApiBase : config.public.apiBase || '/web-api').replace(/\/$/, '')
  const request = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
    const response = await $fetch<{ code: number; data: T; msg?: string }>(`${base}${path}`, options)
    if (response.code !== 200) throw createError({ statusCode: response.code, statusMessage: response.msg || '内容服务请求失败' })
    return response.data
  }
  return {
    getDocument: (locale: string, contentKey: string) => request<ContentTranslation>(`/content/docs/${encodeURIComponent(locale)}/${encodeURIComponent(contentKey)}`),
    getManifest: (locale: string) => request<ContentManifestItem[]>(`/content/docs/${encodeURIComponent(locale)}/manifest`),
    getNavigation: (locale: string, parentId?: number) => request<NavigationItem[]>(`/content/docs/navigation?locale=${encodeURIComponent(locale)}${parentId ? `&nodeId=${parentId}` : ''}`),
    search: (locale: string, q: string) => request<ContentSearchItem[]>(`/content/search?locale=${encodeURIComponent(locale)}&q=${encodeURIComponent(q)}&page=1&size=20`)
  }
}

export function normalizeToc(value: ContentTranslation['toc']) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try { return JSON.parse(value) as Array<{ level: number; title: string; id: string }> } catch { return [] }
}

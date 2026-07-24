import { type UseFetchOptions } from '#app'

/**
 * 封装支持 SSR 同构的 API 请求工具
 * 自动处理 Cookie 中的 Token 登录凭证并附加在 Request Header 中
 */
export const useApi = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()
  
  // 从 Cookie 中获取 Token 状态（由客户端与 Node 服务端共享）
  const token = useCookie('token')

  // 默认请求参数配置
  const defaults: UseFetchOptions<T> = {
    // 默认的基础路径，可以在 nuxt.config.ts 中被 runtimeConfig.public.apiBase 覆盖
    baseURL: config.public.apiBase as string || '/api',
    
    // 同步把 Cookie 里的 Token 传入 Headers 中
    headers: token.value ? {
      Authorization: `Bearer ${token.value}`
    } : {},

    // 拦截响应，在此处可以处理全局报错（例如 401 未登录、500 系统错误等）
    onResponse({ response }) {
      if (response.status === 401) {
        // 如果是未授权，可以在这里清除 token 并重定向到登录页
        token.value = null
        if (import.meta.client) {
          // 仅在客户端进行重定向，避免影响服务端渲染流程
          navigateTo('/login/')
        }
      }
    },

    onResponseError({ response }) {
      // 可以在此处做统一的错误提示拦截（例如弹出 Toast 提示）
      console.error('[API Error]:', response._data || response.statusText)
    }
  }

  // 合并配置项并调用 Nuxt 内置的 useFetch
  const mergedOptions = { ...defaults, ...options }
  
  return useFetch(url, mergedOptions)
}

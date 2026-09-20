import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { ref } from 'vue'

// 执行真实 composable，仅替换 Nuxt 环境与网络边界，不复制认证实现。
const source = readFileSync(new URL('../app/composables/useMemberAuth.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source
  .replaceAll('import.meta.env.PROD', 'false')
  .replaceAll('import.meta.server', 'testServer')
  .replaceAll('import.meta.client', '!testServer'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup({ fetch, token: initialToken = 'expired-session', path = '/checkout',
  fullPath = '/checkout?product=trip-1&adultCount=2&date=2026-10-01', server = false } = {}) {
  const token = ref(initialToken)
  const states = new Map()
  const calls = []
  const redirects = []
  const router = { currentRoute: ref({ path, fullPath }) }
  const app = { runWithContext: callback => callback() }
  const exported = {}
  runInNewContext(compiled, {
    exports: exported,
    testServer: server,
    useRuntimeConfig: () => ({ public: { apiBase: '/web-api' }, contentApiBase: 'http://content/web-api' }),
    useNuxtApp: () => app,
    useRouter: () => router,
    useCookie: () => token,
    useState: (key, init) => {
      if (!states.has(key)) states.set(key, ref(init()))
      return states.get(key)
    },
    detectMemberTimeZone: () => 'UTC',
    $fetch: async (url, options) => { calls.push({ url, options }); return fetch(url, options) },
    navigateTo: async (target, options) => {
      redirects.push({ target, options })
      router.currentRoute.value = { path: target.path, fullPath: target.path }
    },
  })
  const auth = exported.useMemberAuth()
  return { auth, token, calls, redirects, createAuth: exported.useMemberAuth }
}

const unauthorized = () => Object.assign(new Error('[POST] "/web-api/commerce/orders/standard/preview": 401 Unauthorized'), { statusCode: 401 })
const rejected = (error) => { throw error }

test('报价 HTTP 401 清理会话并跳转登录，保留完整结算地址', async () => {
  const { auth, token, redirects } = setup({ fetch: () => rejected(unauthorized()) })
  auth.member.value = { id: 7 }
  await assert.rejects(auth.request('/commerce/orders/standard/preview', {}), error => {
    assert.equal(error.code, 401)
    assert.equal(error.message, 'Your session has expired. Please sign in again.')
    return true
  })
  assert.equal(token.value, null)
  assert.equal(auth.member.value, null)
  assert.equal(redirects.length, 1)
  assert.equal(redirects[0].target.path, '/login/')
  assert.equal(redirects[0].target.query.redirect, '/checkout?product=trip-1&adultCount=2&date=2026-10-01')
  assert.equal(redirects[0].options.replace, true)
})

test('业务响应 401 与嵌套 HTTP 401 均触发登录失效处理', async () => {
  for (const fetch of [
    () => ({ code: 401, msg: 'Unauthorized', data: null }),
    () => rejected({ response: { status: 401, _data: { code: 999, msg: 'Unauthorized' } } }),
  ]) {
    const { auth, token, redirects } = setup({ fetch })
    await assert.rejects(auth.request('/commerce/orders/standard/preview'), { code: 401 })
    assert.equal(token.value, null)
    assert.equal(redirects.length, 1)
  }
})

test('多个 composable 并发失效只跳转一次，后续重试不再请求私有接口', async () => {
  const { auth, createAuth, calls, redirects } = setup({ fetch: () => rejected(unauthorized()) })
  const second = createAuth()
  const results = await Promise.allSettled([
    auth.request('/commerce/orders/standard/preview', {}),
    second.request('/commerce/coupons', undefined, 'GET'),
    auth.request('/points/account', undefined, 'GET'),
  ])
  assert.ok(results.every(result => result.status === 'rejected' && result.reason.code === 401))
  assert.equal(redirects.length, 1)
  const previousCalls = calls.length
  await assert.rejects(auth.request('/commerce/orders/standard/preview', {}), { code: 401 })
  assert.equal(calls.length, previousCalls)
  assert.equal(redirects.length, 1)
})

test('缺少凭证时在请求前引导登录', async () => {
  const { auth, calls, redirects } = setup({ token: null })
  await assert.rejects(auth.request('/commerce/orders/standard/preview', {}), { code: 401 })
  assert.equal(calls.length, 0)
  assert.equal(redirects.length, 1)
})

test('旧请求的 401 不会清除新会话或再次跳转', async () => {
  let rejectOld
  const { auth, token, redirects } = setup({ fetch: () => new Promise((_, reject) => { rejectOld = reject }) })
  const request = auth.request('/commerce/orders/standard/preview', {})
  token.value = 'new-session'
  auth.member.value = { id: 8 }
  rejectOld(unauthorized())
  await assert.rejects(request, { code: 401 })
  assert.equal(token.value, 'new-session')
  assert.equal(auth.member.value.id, 8)
  assert.equal(redirects.length, 0)
})

test('权限不足、网络异常和服务异常不会清除有效会话或暴露请求地址', async () => {
  for (const error of [
    Object.assign(new Error('[GET] /web-api/private: 403 Forbidden'), { statusCode: 403 }),
    Object.assign(new Error('[GET] /web-api/private: 503 Unavailable'), { statusCode: 503 }),
    Object.assign(new Error('[GET] /web-api/private: fetch failed'), { code: 'ECONNRESET' }),
  ]) {
    const { auth, token, redirects } = setup({ fetch: () => rejected(error) })
    await assert.rejects(auth.request('/private', undefined, 'GET'), caught => {
      assert.equal(caught.message, 'We could not complete your request. Please try again.')
      assert.ok(Number.isFinite(caught.code))
      return true
    })
    assert.equal(token.value, 'expired-session')
    assert.equal(redirects.length, 0)
  }
})

test('登录失败保留服务端业务提示，不触发会话失效跳转', async () => {
  const { auth, calls, redirects } = setup({ token: null, path: '/login/', fetch: () => rejected({ statusCode: 401, data: { msg: 'Invalid account or password.' } }) })
  await assert.rejects(auth.login('test@example.com', 'test-password'), { message: 'Invalid account or password.' })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].options.headers.Authorization, undefined)
  assert.equal(redirects.length, 0)
})

test('登录成功后使用新凭证加载用户资料', async () => {
  const { auth, token, calls, redirects } = setup({ token: null, path: '/login/', fetch: url => ({ code: 200, data: url === '/auth/login'
    ? { accessToken: 'new-session', tokenType: 'Bearer' }
    : { id: 8, timezoneMode: 1 } }) })
  await auth.login('test@example.com', 'test-password')
  assert.equal(token.value, 'new-session')
  assert.equal(auth.member.value.id, 8)
  assert.equal(calls[1].options.headers.Authorization, 'Bearer new-session')
  assert.equal(redirects.length, 0)
})

test('注册、密码找回及签名邮件链接等公开接口无需登录', async () => {
  const { auth, calls, redirects } = setup({ token: null, fetch: () => ({ code: 200, data: null }) })
  await Promise.all([
    auth.register({ email: 'test@example.com', password: 'test-password', verificationCode: 'test-code', avatarObjectKey: '' }),
    auth.sendRegistrationCode('test@example.com'),
    auth.verifyEmailCode('test@example.com', 'test-code'),
    auth.resendVerificationCode('test@example.com'),
    auth.forgotPassword('test@example.com'),
    auth.resetPassword('test-ticket', 'test-password'),
    auth.googleExchange('test-ticket'),
    auth.getPublicPreferences('test-ticket'),
    auth.updatePublicPreferences('test-ticket', { MARKETING: false }),
    auth.unsubscribe('test-ticket'),
  ])
  assert.equal(calls.length, 10)
  assert.ok(calls.every(call => !call.options.headers.Authorization))
  assert.equal(redirects.length, 0)
})

test('公开请求失败不影响已有登录，SSR 实例不会共享失效跳转', async () => {
  const publicApp = setup({ fetch: () => rejected(unauthorized()) })
  await assert.rejects(publicApp.auth.publicRequest('/catalog'), { code: 401 })
  assert.equal(publicApp.token.value, 'expired-session')
  assert.equal(publicApp.redirects.length, 0)
  const first = setup({ server: true, fetch: () => rejected(unauthorized()) })
  const second = setup({ server: true, fullPath: '/orders?page=2', fetch: () => rejected(unauthorized()) })
  await Promise.allSettled([first.auth.request('/private'), second.auth.request('/private')])
  assert.equal(first.redirects.length, 1)
  assert.equal(second.redirects.length, 1)
  assert.equal(second.redirects[0].target.query.redirect, '/orders?page=2')
})

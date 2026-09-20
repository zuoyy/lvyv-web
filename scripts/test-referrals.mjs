import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { ref, reactive, computed } from 'vue'
import ts from 'typescript'

const source = readFileSync(new URL('../app/pages/register.vue', import.meta.url), 'utf8').match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
const compiled = ts.transpileModule(source + '\nObject.assign(exports, { inviteCode, inviteError, inviteLoading, form, verificationCode, codeSent, submit, handleGoogleLogin, removeInvitation });', { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText

function setup({ query = {}, saved = 'ABCDEFGHJK', captureError = false, invalid = false } = {}) {
  const callbacks = [], calls = [], exported = {}
  const api = {
    capture: async code => { calls.push(['capture', code]); if (captureError) throw new Error('Unavailable invitation'); return { inviteCode: saved } },
    context: async () => { calls.push(['context']); if (captureError) throw new Error('Session unavailable'); return { inviteCode: saved } },
    validate: async code => { calls.push(['validate', code]); if (invalid) throw new Error('Unavailable invitation'); return { inviteCode: code.toUpperCase() } },
    clear: async () => { calls.push(['clear']) },
  }
  runInNewContext(compiled, {
    exports: exported, ref, reactive, computed,
    definePageMeta: () => {}, useNoIndex: () => {},
    useRoute: () => ({ path: '/register/', query }), useReferrals: () => api,
    useMemberAuth: () => ({ register: async data => calls.push(['register', data]), googleLogin: (...args) => calls.push(['google', ...args]) }),
    detectMemberTimeZone: () => 'UTC', randomRegistrationAvatar: () => 'asset://images/avatar/avatar_1.png',
    navigateTo: async (...args) => calls.push(['navigate', ...args]),
    onMounted: fn => callbacks.push(fn), onBeforeUnmount: () => {},
    setInterval: () => 1, clearInterval: () => {}, Error,
  })
  Object.assign(exported.form, { email: 'friend@example.com', password: 'Secret123', confirmPassword: 'Secret123' })
  exported.codeSent.value = true; exported.verificationCode.value = '123456'
  return { ...exported, calls, mount: async () => { for (const fn of callbacks) await fn() } }
}

test('a later link keeps the first server-side invitation', async () => {
  const page = setup({ query: { invite: 'BCDEFGHJKL' } }); await page.mount()
  assert.equal(page.inviteCode.value, 'ABCDEFGHJK')
  assert.equal(page.calls[0][1], 'BCDEFGHJKL')
})
test('a manually changed code is submitted instead of the saved first source', async () => {
  const page = setup(); await page.mount(); page.inviteCode.value = 'bcdefghjkl'
  await page.submit()
  assert.equal(page.calls.find(call => call[0] === 'register')[1].inviteCode, 'BCDEFGHJKL')
})
test('Google receives the same final code that was validated', async () => {
  const page = setup(); await page.mount(); page.inviteCode.value = 'bcdefghjkl'
  await page.handleGoogleLogin()
  assert.equal(page.calls.find(call => call[0] === 'google')[2], 'BCDEFGHJKL')
})
test('invalid invitations block account creation and Google redirect', async () => {
  const page = setup({ invalid: true }); await page.mount(); await page.submit(); await page.handleGoogleLogin()
  assert.ok(page.inviteError.value)
  assert.equal(page.calls.some(call => call[0] === 'register' || call[0] === 'google'), false)
})
test('explicit removal clears the source and allows ordinary registration', async () => {
  const page = setup({ query: { invite: 'ABCDEFGHJK', error: 'invite_invalid' } }); await page.mount(); await page.removeInvitation(); await page.submit()
  assert.equal(page.inviteCode.value, '')
  assert.equal(page.calls.find(call => call[0] === 'register')[1].inviteCode, undefined)
  const target = page.calls.find(call => call[0] === 'navigate')[1]
  assert.equal(target.query.invite, undefined); assert.equal(target.query.error, undefined)
})
test('context failure must not silently register without the invitation', async () => {
  const page = setup({ captureError: true }); await page.mount(); await page.submit()
  assert.equal(page.calls.some(call => call[0] === 'register'), false)
  await page.removeInvitation(); await page.submit()
  assert.equal(page.calls.some(call => call[0] === 'register'), true)
})
test('Google invalid-invitation return explains how to continue', async () => {
  const page = setup({ query: { error: 'invite_invalid' } }); await page.mount()
  assert.match(page.inviteError.value, /Change or remove/)
})

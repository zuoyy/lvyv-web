import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { ref, watch } from 'vue'
import ts from 'typescript'

const source = readFileSync(new URL('../app/pages/login.vue', import.meta.url), 'utf8')
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
const compiled = ts.transpileModule(source.replaceAll('import.meta.client', 'false') +
  '\nObject.assign(exports, { submit, email, password, emailInput, passwordInput, ready, message, loading });', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup(login = async () => {}) {
  const exported = {}, requests = [], redirects = [], mounted = []
  runInNewContext(compiled, {
    exports: exported, ref, watch, Error,
    definePageMeta: () => {}, useNoIndex: () => {}, onMounted: callback => mounted.push(callback),
    useRoute: () => ({ query: { redirect: '/checkout?product=trip-1' } }),
    useMemberAuth: () => ({ login: async (...args) => { requests.push(args); await login() } }),
    navigateTo: async target => redirects.push(target),
    ApiRequestError: class extends Error {},
  })
  for (const mount of mounted) mount()
  return { ...exported, requests, redirects,
    submitForm: (email, password) => {
      exported.emailInput.value = { value: email }
      exported.passwordInput.value = { value: password }
      return exported.submit()
    },
  }
}

test('自动填充未更新 Vue 状态时仍提交输入框实际值，邮箱去空格而密码保持原样', async () => {
  const page = setup()
  assert.equal(page.email.value, '')
  assert.equal(page.password.value, '')
  await page.submitForm('  autofill@example.com  ', ' password with spaces ')
  assert.deepEqual(page.requests, [['autofill@example.com', ' password with spaces ']])
  assert.equal(page.redirects[0], '/checkout?product=trip-1')
  assert.equal(page.loading.value, false)
})

test('空字段和无效邮箱显示提示，不发送登录请求', async () => {
  for (const [email, password, message] of [
    ['', '', 'Please fill out this field.'],
    ['   ', 'secret', 'Please fill out this field.'],
    ['invalid', 'secret', 'Please enter a valid email address.'],
    ['valid@example.com', '', 'Please fill out this field.'],
  ]) {
    const page = setup()
    await page.submitForm(email, password)
    assert.equal(page.message.value, message)
    assert.equal(page.requests.length, 0)
    assert.equal(page.loading.value, false)
  }
})

test('输入框被清空后不会提交 Vue 中残留的旧密码', async () => {
  const page = setup()
  page.email.value = 'remembered@example.com'
  page.password.value = 'stale-password'
  await page.submitForm('remembered@example.com', '')
  assert.equal(page.requests.length, 0)
  assert.equal(page.password.value, '')
})

test('登录请求处理中忽略重复提交', async () => {
  let finish
  const page = setup(() => new Promise(resolve => { finish = resolve }))
  const pending = page.submitForm('test@example.com', 'test-password')
  assert.equal(page.loading.value, true)
  await page.submitForm('test@example.com', 'test-password')
  assert.equal(page.requests.length, 1)
  finish()
  await pending
  assert.equal(page.loading.value, false)
})

test('登录失败显示服务端提示并允许再次提交', async () => {
  const page = setup(async () => { throw new Error('Invalid account or password.') })
  await page.submitForm('test@example.com', 'incorrect')
  assert.equal(page.message.value, 'Invalid account or password.')
  assert.equal(page.loading.value, false)
  await page.submitForm('test@example.com', 'retry')
  assert.equal(page.requests.length, 2)
})

test('客户端未就绪时不能发送凭证', async () => {
  const page = setup()
  page.ready.value = false
  await page.submitForm('test@example.com', 'test-password')
  assert.equal(page.requests.length, 0)
})

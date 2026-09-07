import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { computed, reactive, ref, nextTick } from 'vue'

// 执行真实页面脚本，替换网络、Nuxt 生命周期和存储；不发送实际愿望请求。
const source = readFileSync(new URL('../app/pages/wish/create.vue', import.meta.url), 'utf8')
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
  .replaceAll('import.meta.client', 'true')
const script = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText
const city = (code) => ({ code, englishName: code, chineseName: code, defaultSelected: true })
const config = () => ({ cities: [city('beijing'), city('xian'), city('chengdu')], budgets: [{ code: 'comfort', defaultSelected: true }], storyTemplates: [{ code: 'story', story: 'My trip', defaultSelected: true }] })
class ApiRequestError extends Error { constructor(code) { super('Rejected'); this.code = code } }
async function page({ saved, query = {}, token = 'test', requestError } = {}) {
  const memory = new Map(saved ? Object.entries(saved) : [])
  const storage = { getItem: (key) => memory.get(key), setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) }
  const options = config()
  const posted = []
  const navigated = []
  let mounted
  const env = { ref, computed, reactive, nextTick, watch: () => {},
    useCookie: (_, options) => ref(options.default()), useRoute: () => ({ query }),
    useMemberAuth: () => ({ token: ref(token), request: async (url, body) => { if (requestError) throw requestError; posted.push({ url, body }) } }),
    useWishConfig: () => ({ loading: ref(false), error: ref(''), load: async () => options }),
    onMounted: (fn) => { mounted = fn }, onBeforeUnmount: () => {},
    useNoIndex: () => {}, useLvyvSeo: () => {}, navigateTo: async (url) => navigated.push(url),
    sessionStorage: storage, window: { addEventListener() {} }, ApiRequestError,
  }
  const run = new Function(...Object.keys(env), `${script}\nreturn { form, currentStep, furthestStep, canContinue, selectCity, nextStep, saveDraft, applyWishConfig, submitWish, citySelectionNotice, selectedCityLabel };`)
  const view = run(...Object.values(env))
  await mounted()
  return { ...view, memory, options, posted, navigated }
}
const fresh = await page()
assert.deepEqual([...fresh.form.cityCodes], [])
assert.equal(fresh.canContinue.value, false)
fresh.selectCity('beijing'); fresh.selectCity('xian')
assert.deepEqual([...fresh.form.cityCodes], ['beijing', 'xian'])
assert.equal(fresh.selectedCityLabel.value, 'beijing, xian')
fresh.selectCity('beijing'); fresh.selectCity('xian')
assert.equal(fresh.canContinue.value, false)
await fresh.applyWishConfig(true, true)
assert.deepEqual([...fresh.form.cityCodes], [])
fresh.selectCity('xian'); fresh.selectCity('beijing'); fresh.saveDraft()
const restored = await page({ saved: Object.fromEntries(fresh.memory) })
assert.deepEqual([...restored.form.cityCodes], ['xian', 'beijing'])
const legacy = await page({ saved: { lvyv_wish_builder_draft_v1: JSON.stringify({ form: { cityCode: 'xian' } }) } })
assert.deepEqual([...legacy.form.cityCodes], ['xian'])
assert.equal('cityCode' in legacy.form, false)
const explicit = await page({ saved: Object.fromEntries(fresh.memory), query: { city: 'chengdu' } })
assert.deepEqual([...explicit.form.cityCodes], ['chengdu'])
explicit.selectCity('chengdu'); await explicit.applyWishConfig(true, true)
assert.deepEqual([...explicit.form.cityCodes], [])
restored.options.cities = [city('chengdu')]
await restored.applyWishConfig(true, true)
assert.deepEqual([...restored.form.cityCodes], [])
assert.equal(restored.currentStep.value, 0)
assert.ok(restored.citySelectionNotice.value)
const completeDraft = { cityCodes: ['beijing', 'xian'], startDate: '2027-05-10', endDate: '2027-05-12', tripDays: 3, interestCodes: ['history'], budgetLevel: 'comfort', story: 'My trip' }
const saved = (form) => ({ lvyv_wish_builder_draft_v2: JSON.stringify({ form, step: 6, furthest: 6 }) })
const invalidResume = await page({ saved: saved({ ...completeDraft, cityCodes: [] }), query: { resume: '1' } })
assert.equal(invalidResume.currentStep.value, 0)
await invalidResume.submitWish(); assert.equal(invalidResume.posted.length, 0)
const complete = await page({ saved: saved(completeDraft), query: { resume: '1' } })
assert.equal(complete.currentStep.value, 6)
await complete.submitWish()
assert.equal(complete.posted.length, 1)
assert.deepEqual(complete.posted[0].body.cityCodes, ['beijing', 'xian'])
assert.equal('cityCode' in complete.posted[0].body, false)
const login = await page({ saved: saved(completeDraft), token: null })
await login.submitWish()
assert.equal(login.posted.length, 0)
assert.equal(login.navigated.length, 1)
assert.ok(login.memory.has('lvyv_wish_builder_draft_v2'))
const rejected = await page({ saved: saved(completeDraft), requestError: new ApiRequestError(1_003_100_005) })
await rejected.submitWish()
assert.equal(rejected.currentStep.value, 0)
assert.equal(rejected.form.story, completeDraft.story)
assert.ok(rejected.citySelectionNotice.value)
console.log('PASS: 空选、多选/取消、配置重载、草稿迁移、显式预选、城市失效、登录恢复、数组提交和失败保留')

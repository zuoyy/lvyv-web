import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import { ref, computed, reactive, watch, nextTick } from 'vue'
import ts from 'typescript'
import * as health from '../app/utils/beijingHealthCheckup.ts'
import { encounterPrice } from '../app/utils/encounterBooking.ts'

const primary = { productCode: 'ENC-BJ-DENTAL-CLEANING', skuCode: 'DEFAULT' }
const healthCode = 'ENC-BJ-BASIC-HEALTH-CHECKUP'
const platinum = { productCode: healthCode, skuCode: 'PLATINUM' }
const luxury = { productCode: healthCode, skuCode: 'LUXURY' }
const compile = (path, names) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8')
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1] + `\nObject.assign(exports, { ${names} });`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const checkout = compile('../app/pages/checkout/index.vue',
  'submit, agreed, requestedTravelDate, note, healthPackages, examinationsComplete, chooseExamination, selectedExaminations, message')
const addOns = compile('../app/components/EncounterExperienceAddOns.vue', 'cartPrice, toggleAddOn')

function setup({ main = primary, extras = [platinum], saved = {}, create, priceChanged = false } = {}) {
  const exports = {}, mounted = [], calls = [], redirects = [], savedNotes = { ...saved }
  const lines = [main, ...extras].map((item, index) => ({ ...item, quantity: 1, unitPrice: 10,
    productName: item.productCode, skuName: item.skuCode, specifications: [], addOn: index > 0 }))
  const quote = { lines, subtotal: 20, bundleDiscountAmount: 0, couponDiscountAmount: 0,
    totalAmount: 20, priceKey: 'a'.repeat(64) }
  const data = ref({ detail: null, quote: null, bundle: quote })
  const refresh = async () => { data.value = { ...data.value, bundle: { ...quote, priceKey: 'b'.repeat(64) } } }
  class ApiRequestError extends Error {}
  runInNewContext(checkout, {
    exports, ref, computed, reactive, watch, Error, crypto: { randomUUID },
    require: name => name.includes('beijingHealthCheckup') ? health : name === 'country-region-data' ? { allCountries: [] }
      : name.includes('encounterProducts') ? { encounterProducts: [main].map(item => ({ code: item.productCode, ready: true })), healthCheckupProductCode: healthCode }
        : name.includes('useMemberAuth') ? { ApiRequestError } : {},
    definePageMeta: () => {}, useSeoMeta: () => {},
    useRoute: () => ({ query: { product: main.productCode, sku: main.skuCode,
      addOn: extras.map(item => `${item.productCode}:${item.skuCode}`) } }),
    useCommerce: () => ({ listCoupons: async () => [],
      createBundle: async request => { calls.push(structuredClone(request)); return create ? create(request) : priceChanged ? { currentAmount: 21 } : { orderNo: 'ORD_TEST' } },
    }),
    useMemberAuth: () => ({ loadMember: async () => null }),
    useAsyncData: key => key === 'checkout-coupons'
      ? { data: ref([]), status: ref('success'), refresh: async () => {} }
      : { data, status: ref('success'), error: ref(null), refresh },
    isEncounterCode: code => code.startsWith('ENC-'), validOrderQuantity: (_code, value) => Number.isInteger(value) && value >= 1,
    todayInChina: () => '2026-11-27', isTravelDate: value => value === '2027-01-01',
    onMounted: fn => mounted.push(fn), rememberTravelDate: () => '', rememberExperienceAddOns: () => [],
    rememberHealthCheckupNote: (sku, note) => {
      if (note !== undefined) savedNotes[sku] = note
      return savedNotes[sku] || ''
    },
    navigateTo: async target => redirects.push(target),
  })
  return { ...exports, calls, redirects, savedNotes,
    mount: async () => { for (const fn of mounted) await fn(); await nextTick() },
    continue: async () => { exports.agreed.value = true; exports.requestedTravelDate.value = '2027-01-01'; await exports.submit() },
    complete: item => {
      for (const group of health.healthCheckupChoiceGroups(item.skuCode)) {
        for (const option of group.options.slice(0, group.limit)) exports.chooseExamination(item, group.options, group.limit, option)
      }
    },
  }
}

test('商品页组合价按每人九折取整，保留小额下限和体检不打折规则', async () => {
  for (const [basePrice, first, second, wellness, expected] of [
    [53, 24.25, 19, false, 87], [53, 24, 19, false, 86], [1, 2, 2, false, 5],
    [0.01, 0.01, 0.01, false, 0.03], [0.01, 0.01, 0.02, false, 0.03], [414, 24.25, 19, true, 457.25],
  ]) {
    const exports = {}
    const cards = [first, second].map((price, i) => ({ productCode: 'ADDON_' + i, skuCode: 'DEFAULT',
      name: 'Experience', price, addOnPrice: price }))
    await runInNewContext(`(async () => { ${addOns} })()`, {
      exports, ref, computed, watch,
      require: () => ({ encounterProducts: [], encounterImage: value => value }),
      defineProps: () => ({ productCode: primary.productCode, baseSkuCode: 'DEFAULT', basePrice, wellness }),
      withDefaults: value => value, defineEmits: () => () => {},
      useCommerce: () => ({}), useAsyncData: () => ({ data: ref(cards), status: ref('success') }),
      useTemplateRef: () => ref(null), onMounted: () => {}, rememberExperienceAddOns: () => [], encounterPrice,
    })
    for (const card of cards) exports.toggleAddOn(`${card.productCode}:${card.skuCode}`)
    assert.equal(exports.cartPrice.value, encounterPrice(expected))
  }
})

test('加购 Platinum 必须完成每组检查项，提交结构化选项并保留用户备注', async () => {
  const page = setup()
  await page.mount()
  await page.continue()
  assert.equal(page.calls.length, 0)
  assert.match(page.message.value, /examination choices/)
  page.complete(platinum)
  assert.equal(page.examinationsComplete.value, true)
  page.note.value = 'Please contact me before the appointment.'
  await page.continue()
  assert.deepEqual(page.calls[0].cart.addOns[0].examinations, [
    'Gut function assessment', 'Telomere length and aging test', 'Brain MRA', 'Brain MRI',
  ])
  assert.equal(page.calls[0].note, page.note.value)
  assert.equal(page.calls[0].priceKey, 'a'.repeat(64))
  assert.equal(page.redirects[0], '/orders/ORD_TEST/pay')
  await nextTick()
  assert.equal(page.savedNotes.PLATINUM, '')
})

test('单选会替换旧值，多选限制上限，取消后重新阻止提交', async () => {
  const page = setup()
  page.complete(platinum)
  const [functional, , imaging] = health.healthCheckupChoiceGroups('PLATINUM')
  page.chooseExamination(platinum, functional.options, functional.limit, functional.options[1])
  assert.equal(page.selectedExaminations(platinum).includes(functional.options[0]), false)
  page.chooseExamination(platinum, imaging.options, imaging.limit, imaging.options[2])
  assert.equal(page.selectedExaminations(platinum).length, 4)
  page.chooseExamination(platinum, imaging.options, imaging.limit, imaging.options[0])
  assert.equal(page.examinationsComplete.value, false)
  await page.continue()
  assert.equal(page.calls.length, 0)
})

test('体检主项目可从商品页恢复检查项，加购的另一档套餐独立选择', async () => {
  const savedLuxury = ['B vitamin analysis', 'Brain MRA', 'Brain MRI', 'Coronary CTA', 'Lumbar spine MRI']
  const page = setup({ main: luxury, extras: [platinum],
    saved: { LUXURY: 'Selected examinations: ' + savedLuxury.join(', ') } })
  await page.mount()
  assert.deepEqual([...page.selectedExaminations(luxury)], savedLuxury)
  assert.equal(page.note.value, '')
  assert.equal(page.examinationsComplete.value, false)
  page.complete(platinum)
  await page.continue()
  assert.deepEqual(page.calls[0].cart.primary.examinations, savedLuxury)
  assert.equal(page.calls[0].cart.addOns[0].examinations.length, 4)
})

test('保存的未知或重复选项不计数，未完成的选择可跨刷新恢复', async () => {
  const page = setup({ saved: { PLATINUM: 'Selected examinations: Brain MRI, Brain MRI, Unknown examination' } })
  await page.mount()
  assert.deepEqual([...page.selectedExaminations(platinum)], ['Brain MRI'])
  assert.equal(page.examinationsComplete.value, false)
  const group = health.healthCheckupChoiceGroups('PLATINUM')[0]
  page.chooseExamination(platinum, group.options, group.limit, group.options[0])
  await nextTick()
  assert.match(page.savedNotes.PLATINUM, /Gut function assessment/)
  const restored = setup({ saved: page.savedNotes })
  await restored.mount()
  assert.deepEqual([...restored.selectedExaminations(platinum)], [...page.selectedExaminations(platinum)])
})

test('建单网络失败重试复用请求编号，改变检查项后使用新编号', async () => {
  const page = setup({ create: async () => { throw new Error('Offline') } })
  page.complete(platinum)
  await page.continue()
  await page.continue()
  assert.equal(page.calls[0].checkoutRequestId, page.calls[1].checkoutRequestId)
  const group = health.healthCheckupChoiceGroups('PLATINUM')[0]
  page.chooseExamination(platinum, group.options, group.limit, group.options[1])
  await page.continue()
  assert.notEqual(page.calls[1].checkoutRequestId, page.calls[2].checkoutRequestId)
})

test('价格变化后保留检查项，并要求重新确认新报价', async () => {
  const page = setup({ priceChanged: true })
  page.complete(platinum)
  await page.continue()
  assert.equal(page.agreed.value, false)
  assert.equal(page.examinationsComplete.value, true)
  await page.submit()
  assert.equal(page.calls.length, 1)
  await page.continue()
  assert.equal(page.calls[1].priceKey, 'b'.repeat(64))
  assert.deepEqual(page.calls[0].cart.addOns, page.calls[1].cart.addOns)
})

test('不含必选检查项的普通组合继续正常下单，连续提交仅创建一次', async () => {
  let finish
  const page = setup({ extras: [{ productCode: healthCode, skuCode: 'GOLDEN' }],
    create: () => new Promise(resolve => { finish = resolve }) })
  const pending = page.continue()
  await page.continue()
  assert.equal(page.calls.length, 1)
  assert.equal('examinations' in page.calls[0].cart.addOns[0], false)
  finish({ orderNo: 'ORD_TEST' })
  await pending
})

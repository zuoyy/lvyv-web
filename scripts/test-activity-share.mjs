import assert from 'node:assert/strict'
import test from 'node:test'
import { activityShareUrl, activityShareLabels, activitySharePlatforms, activityPlatformUrl, copyActivityLink, shareActivityLink } from '../shared/utils/activityShare.ts'

test('活动分享只使用正式域名、活动路径且去掉查询与锚点', () => {
  assert.equal(activityShareUrl('https://luxury.lvyv.com/activity/act_one?utm_source=secret#part'), 'https://luxury.lvyv.com/activity/act_one')
  assert.equal(activityShareUrl('http://localhost:3000/activity/act_two/?token=secret'), 'https://luxury.lvyv.com/activity/act_two')
  assert.throws(() => activityShareUrl('/login'))
})

test('平台分享编码中文与特殊字符，所有入口分享同一个干净地址', () => {
  const data = { url: 'https://luxury.lvyv.com/activity/act_one?utm_source=test#part', title: '长白山 & Friends + 冰雪 #1?', description: '中文 & description', imageUrl: 'https://cdn.example.com/a.png?q=1&v=2' }
  for (const platform of activitySharePlatforms('zh-CN')) {
    const href = activityPlatformUrl(platform, data)
    if (platform === 'wechat' || platform === 'copy') { assert.equal(href, null); continue }
    const link = new URL(href)
    assert.equal(link.protocol, 'https:')
    const url = link.searchParams.get(platform === 'facebook' ? 'u' : platform === 'whatsapp' ? 'text' : 'url')
    assert.ok(url.includes('https://luxury.lvyv.com/activity/act_one'))
    assert.ok(!url.includes('utm_source') && !url.includes('#part'))
    if (['weibo', 'qq', 'reddit'].includes(platform)) assert.equal(link.searchParams.get('title'), data.title)
    if (['telegram', 'x'].includes(platform)) assert.equal(link.searchParams.get('text'), data.title)
    if (platform === 'whatsapp') assert.equal(url, `${data.title}\nhttps://luxury.lvyv.com/activity/act_one`)
    if (platform === 'x') assert.equal(link.origin + link.pathname, 'https://x.com/intent/tweet')
    if (platform === 'reddit') assert.equal(link.origin + link.pathname, 'https://www.reddit.com/submit')
    if (platform === 'qq') {
      assert.equal(link.origin + link.pathname, 'https://connect.qq.com/widget/shareqq/index.html')
      assert.equal(link.searchParams.get('summary'), data.description)
      assert.equal(link.searchParams.get('pics'), data.imageUrl)
    }
  }
})

test('活动语言决定文案和排序，包含 QQ 和 Reddit，排除 QQ 空间', () => {
  for (const lang of [undefined, null, 'zh-CN', 'en-US', 'ja-JP', 'fr-FR']) {
    const chinese = !lang || lang === 'zh-CN'
    assert.equal(activityShareLabels(lang).share, chinese ? '分享' : 'Share')
    const platforms = activitySharePlatforms(lang)
    assert.equal(platforms.length, 10)
    assert.equal(new Set(platforms).size, 10)
    assert.ok(platforms.includes('reddit'))
    assert.ok(platforms.includes('qq') && !platforms.includes('qzone'))
    assert.equal(platforms[0], chinese ? 'wechat' : 'whatsapp')
    assert.equal(platforms.at(-1), 'copy')
  }
})

test('剪贴板失败或不可用不报告成功，系统分享仅发送标题和链接，取消不当成失败', async () => {
  const url = 'https://luxury.lvyv.com/activity/act_one?utm_source=test#part'
  let copied
  assert.equal(await copyActivityLink(url, { writeText: async value => { copied = value } }), true)
  assert.equal(copied, 'https://luxury.lvyv.com/activity/act_one')
  assert.equal(await copyActivityLink(url), false)
  assert.equal(await copyActivityLink(url, { writeText: async () => { throw new Error('Denied') } }), false)
  const data = { url, title: '分享标题', description: '不重复发送', imageUrl: 'https://example.com/a.png' }
  assert.equal(await shareActivityLink(data, async value => {
    assert.deepEqual(value, { title: data.title, url: copied })
  }), 'shared')
  assert.equal(await shareActivityLink(data, async () => { throw new DOMException('Cancelled', 'AbortError') }), 'cancelled')
  assert.equal(await shareActivityLink(data, async () => { throw new Error('Unavailable') }), 'failed')
})

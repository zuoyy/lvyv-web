export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    if (event.path !== '/') return

    html.head = html.head.map(chunk => chunk.replaceAll(/<link rel="prefetch"[^>]*>/g, ''))
  })
})

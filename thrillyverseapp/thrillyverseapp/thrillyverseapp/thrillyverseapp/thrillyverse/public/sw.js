self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const { title = 'ThrillyVerse', body = '', icon = '/logo-192.png', url = '/' } = data
  event.waitUntil(
    self.registration.showNotification(title, {
      body, icon, badge: '/badge.png', data: { url },
      actions: [{ action:'open', title:'Open' }]
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type:'window' }).then(list => {
      const w = list.find(c => c.url.includes(url))
      return w ? w.focus() : clients.openWindow(url)
    })
  )
})
const uWS = require('uWebSockets.js')
const port = 9001

// const messages = [{ when: 135161651, who: 'Osoba', what: 'Lorem ipsum', avatar: 'https://cdn.discordapp.com/avatars/511584564217643008/beeb98f111089e9d0614c94a77585211.png?size=128' }, { when: 135161651, who: 'Osoba', what: 'Lorem ipsum', avatar: 'https://cdn.discordapp.com/avatars/511584564217643008/beeb98f111089e9d0614c94a77585211.png?size=128' }, { when: 135161651, who: 'Osoba', what: 'Lorem ipsum', avatar: 'https://cdn.discordapp.com/avatars/511584564217643008/beeb98f111089e9d0614c94a77585211.png?size=128' }]
const channels = [{ id: 0, name: 'channel 1', messages: [] }, { id: 1, name: 'channel 2', messages: [] }, { id: 2, name: 'channel 3', messages: [] }]

const app = uWS.App()
  .ws('/*', {
    /* Options */
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,
    /* Handlers */
    open: (ws) => {
      console.log('A WebSocket connected!')
      ws.subscribe('broadcast')
    },
    message: (ws, message, isBinary) => {
      /* Ok is false if backpressure was built up, wait for drain */
      // const ok = ws.send(message, isBinary)
      const buffer = Buffer.from(message)
      const obj = JSON.parse(buffer)
      switch (obj.type) {
        case 'getall':
          ws.send(formatAll())
          break
        case 'newmessage':
          channels.find(channel => channel.id === obj.data.channelId).messages.push({ when: obj.data.when, who: obj.data.username, what: obj.data.message, avatar: obj.data.avatar })
          app.publish('broadcast', formatAll())
          break
        case 'newchannel':
          channels.push({ id: channels[channels.length - 1].id + 1, name: obj.data.channelName, messages: [] })
          app.publish('broadcast', formatAll())
          break
      }
    },
    drain: (ws) => {
      console.log('WebSocket backpressure: ' + ws.getBufferedAmount())
    },
    close: (ws, code, message) => {
      console.log('WebSocket closed')
    }
  }).any('/*', (res, req) => {
    res.end('Nothing to see here!')
  }).listen(port, (token) => {
    if (token) {
      console.log('Listening to port ' + port)
    } else {
      console.log('Failed to listen to port ' + port)
    }
  })

function formatAll() {
  return JSON.stringify({ type: 'all', data: channels })
}

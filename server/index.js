const uWS = require('uWebSockets.js')
const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

const port = 9001
const channels = []

setup()

async function setup() {
  await client.connect()
  const db = client.db('vue-chat')
  const messagesCol = db.collection('messages')
  const channelsCol = db.collection('channels')

  const foundChannels = channelsCol.find()
  await foundChannels.forEach(c => {
    c.messages = []
    channels.push(c)
  })

  const foundMessages = messagesCol.find()
  await foundMessages.forEach(m => {
    channels.filter(c => c._id.toString() === m.channelId)[0].messages.push(m)
  })

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
            onGetAll(ws, obj)
            break
          case 'newmessage':
            onNewMessage(ws, obj)
            break
          case 'newchannel':
            onNewChannel(ws, obj)
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

  function onGetAll(ws, obj) {
    ws.send(formatAll())
  }

  async function onNewMessage(ws, obj) {
    const result = await messagesCol.insertOne({ when: obj.data.when, who: obj.data.username, what: obj.data.message, avatar: obj.data.avatar, channelId: obj.data.channelId })
    channels.find(channel => channel._id.toString() === obj.data.channelId).messages.push({ when: obj.data.when, who: obj.data.username, what: obj.data.message, avatar: obj.data.avatar, _id: result.insertedId.toString() })
    app.publish('broadcast', formatAll())
  }

  async function onNewChannel(ws, obj) {
    const result = await channelsCol.insertOne({ name: obj.data.channelName })
    channels.push({ name: obj.data.channelName, _id: result.insertedId.toString(), messages: [] })
    app.publish('broadcast', formatAll())
  }

  function formatAll() {
    return JSON.stringify({ type: 'all', data: channels })
  }
}

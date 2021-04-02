import Robot from "../robot";
import {IncomingMessage} from "http";

import HTTPS from "https";

import {EventEmitter} from "events";

import Adapter from "../types/adapter";

import Message, {EnterMessage, LeaveMessage, TextMessage, TopicMessage} from "../message";

class Campfire extends Adapter {
  bot: CampfireStreaming
  constructor(robot:Robot) {
    super(robot);
  }

  send (envelope:any, ...strings: string[]) {
    if (strings.length === 0) {
      return
    }

    const string = strings.shift()
    if (typeof string === 'function') {
      // @ts-ignore
      string()
      // @ts-ignore
      this.send.apply(this, [envelope].concat(strings))
      return
    }

    this.bot.Room(envelope.room).speak(string, (error: any, data:any) => {
      if (error != null) {
        this.robot.logger.error(`Campfire send error: ${error}`)
      }
      // @ts-ignore
      this.send.apply(this, [envelope].concat(strings))
    })
  }

  emote (envelope:any, ...strings: string[]) {
    // @ts-ignore
    this.send.apply(this, [envelope].concat(strings.map(str => `*${str}*`)))
  }

  reply (envelope:any, ...strings: string[]) {
    // @ts-ignore
    this.send.apply(this, [envelope].concat(strings.map(str => `${envelope.user.name}: ${str}`)))
  }

  topic (envelope:any, ...strings: string[]) {
    this.bot.Room(envelope.room).topic(strings.join(' / '), (err:any, data:any) => {
      if (err != null) {
        this.robot.logger.error(`Campfire topic error: ${err}`)
      }
    })
  }

  play (envelope:any, ...strings: string[]) {
    this.bot.Room(envelope.room).sound(strings.shift(), (err:any, data:any) => {
      if (err != null) {
        this.robot.logger.error(`Campfire sound error: ${err}`)
      }
      // @ts-ignore
      this.play.apply(this, [envelope].concat(strings))
    })
  }

  locked (envelope:any, ...strings: string[]) {

    if (envelope.message.private) {
      // @ts-ignore
      this.send.apply(this, [envelope].concat(strings))
    }

    this.bot.Room(envelope.room).lock(() => {
      // @ts-ignore
      strings.push(() => {
        // campfire won't send messages from just before a room unlock. 3000
        // is the 3-second poll.
        setTimeout(() => this.bot.Room(envelope.room).unlock(), 3000)
      })

      // @ts-ignore
      this.send.apply(this, [envelope].concat(strings))
    })
  }

  run () {
    const self = this

    const options = {
      token: process.env.HUBOT_CAMPFIRE_TOKEN,
      rooms: process.env.HUBOT_CAMPFIRE_ROOMS,
      account: process.env.HUBOT_CAMPFIRE_ACCOUNT
    }

    const bot = new CampfireStreaming(options, this.robot)

    function withAuthor (callback: CallableFunction) {
      return function (id:string, created:any, room:any, user:any, body:any) {
        bot.User(user, function (_err:any, userData:any) {
          if (userData.user) {
            const author = self.robot.brain.userForId(userData.user.id, userData.user)
            const userId = userData.user.id
            self.robot.brain.data.users[userId].name = userData.user.name
            self.robot.brain.data.users[userId].email_address = userData.user.email_address
            author.room = room
            return callback(id, created, room, user, body, author)
          }
        })
      }
    }

    bot.on('TextMessage', withAuthor(function (id:string, created:any, room:any, user:any, body:any, author:any) {
      if (bot.info.id !== author.id) {
        const message = new TextMessage(author, body, id)
        message.private = bot.private[room]
        self.receive(message)
      }
    }))

    bot.on('EnterMessage', withAuthor(function (id:string, created:any, room:any, user:any, body:any, author:any) {
      if (bot.info.id !== author.id) {
        self.receive(new EnterMessage(author, null, id))
      }
    }))

    bot.on('LeaveMessage', withAuthor(function (id:string, created:any, room:any, user:any, body:any, author:any) {
      if (bot.info.id !== author.id) {
        self.receive(new LeaveMessage(author, null, id))
      }
    }))

    bot.on('TopicChangeMessage', withAuthor(function (id:string, created:any, room:any, user:any, body:any, author:any) {
      if (bot.info.id !== author.id) {
        self.receive(new TopicMessage(author, body, id))
      }
    }))

    bot.on('LockMessage', withAuthor((id:string, created:any, room:any, user:any, body:any, author:any) => {
      bot.private[room] = true
    }))

    bot.on('UnlockMessage', withAuthor((id:string, created:any, room:any, user:any, body:any, author:any) => {
      bot.private[room] = false
    }))

    bot.Me(function (_err:any, data:any) {
      bot.info = data.user
      bot.name = bot.info.name

      return Array.from(bot.rooms).map((roomId:any) => ((roomId:string) => bot.Room(roomId).join((_err:any, callback:CallableFunction) => bot.Room(roomId).listen()))(roomId))
    })

    bot.on('reconnect', (roomId:string) => bot.Room(roomId).join((_err:any, callback:CallableFunction) => bot.Room(roomId).listen()))

    this.bot = bot

    self.emit('connected')
  }
}

class CampfireStreaming extends EventEmitter {
  robot: Robot
  [key:string]:any
  constructor (options:any, robot:Robot) {
    super()

    this.robot = robot
    if (options.token == null || options.rooms == null || options.account == null) {
      this.robot.logger.error('Not enough parameters provided. I need a token, rooms and account')
      process.exit(1)
    }

    this.token = options.token
    this.rooms = options.rooms.split(',')
    this.account = options.account
    this.host = this.account + '.campfirenow.com'
    this.authorization = `Basic ${Buffer.from(`${this.token}:x`).toString('base64')}`
    this.private = {}
  }

  Rooms (callback:CallableFunction) {
    return this.get('/rooms', callback)
  }

  User (id:string, callback:CallableFunction) {
    return this.get(`/users/${id}`, callback)
  }

  Me (callback: CallableFunction) {
    return this.get('/users/me', callback)
  }

  Room (id: string) {
    const self = this
    const logger = this.robot.logger

    return {
      show (callback: CallableFunction) {
        return self.get(`/room/${id}`, callback)
      },

      join (callback: CallableFunction) {
        return self.post(`/room/${id}/join`, '', callback)
      },

      leave (callback: CallableFunction) {
        return self.post(`/room/${id}/leave`, '', callback)
      },

      lock (callback: CallableFunction) {
        return self.post(`/room/${id}/lock`, '', callback)
      },

      unlock (callback?: CallableFunction) {
        return self.post(`/room/${id}/unlock`, '', callback)
      },

      // say things to this channel on behalf of the token user
      paste (text: string, callback: CallableFunction) {
        return this.message(text, 'PasteMessage', callback)
      },

      topic (text: string, callback: CallableFunction) {
        const body = { room: { topic: text } }
        return self.put(`/room/${id}`, body, callback)
      },

      sound (text: string, callback: CallableFunction) {
        return this.message(text, 'SoundMessage', callback)
      },

      speak (text: string, callback: CallableFunction) {
        const body = { message: { 'body': text } }
        return self.post(`/room/${id}/speak`, body, callback)
      },

      message (text:string, type:string, callback: CallableFunction) {
        const body = { message: { 'body': text, 'type': type } }
        return self.post(`/room/${id}/speak`, body, callback)
      },

      // listen for activity in channels
      listen (): any {
        const headers = {
          'Host': 'streaming.campfirenow.com',
          'Authorization': self.authorization,
          'User-Agent': `Hubot/${self.robot? self.robot.version: undefined} (${self.robot? self.robot.name : undefined})`
        }

        const options = {
          'agent': false,
          'host': 'streaming.campfirenow.com',
          'port': 443,
          'path': `/room/${id}/live.json`,
          'method': 'GET',
          'headers': headers
        }

        const request = HTTPS.request(options, function (response: IncomingMessage) {
          response.setEncoding('utf8')

          let buf = ''

          response.on('data', function (chunk) {
            if (chunk === ' ') {
              // campfire api sends a ' ' heartbeat every 3s

            } else if (chunk.match(/^\s*Access Denied/)) {
              return logger.error(`Campfire error on room ${id}: ${chunk}`)
            } else {
              // api uses newline terminated json payloads
              // buffer across tcp packets and parse out lines
              buf += chunk

              return (() => {
                let offset
                const result = []
                while ((offset = buf.indexOf('\r')) > -1) {
                  let item
                  const part = buf.substr(0, offset)
                  buf = buf.substr(offset + 1)

                  if (part) {
                    try {
                      const data = JSON.parse(part)
                      item = self.emit(data.type, data.id, data.created_at, data.room_id, data.user_id, data.body)
                    } catch (error) {
                      item = logger.error(`Campfire data error: ${error}\n${error.stack}`)
                    }
                  }
                  result.push(item)
                }

                return result
              })()
            }
          })

          response.on('end', function () {
            logger.error(`Streaming connection closed for room ${id}. :(`)
            return setTimeout(() => self.emit('reconnect', id), 5000)
          })

          return response.on('error', err => logger.error(`Campfire listen response error: ${err}`))
        })

        request.on('error', (err: Error) => logger.error(`Campfire listen request error: ${err}`))

        return request.end()
      }
    }
  }

  get (path:string, callback: CallableFunction) {
    return this.request('GET', path, null, callback)
  }

  post (path:string, body: any, callback: CallableFunction) {
    return this.request('POST', path, body, callback)
  }

  put (path:string, body: any, callback: CallableFunction) {
    return this.request('PUT', path, body, callback)
  }

  request (method:string, path:string, body: any, callback: CallableFunction) {
    const logger = this.robot.logger

    const headers: {[key:string]:string} = {
      'Authorization': this.authorization,
      'Host': this.host,
      'Content-Type': 'application/json',
      'User-Agent': `Hubot/${this.robot? this.robot.version : undefined} (${this.robot? this.robot.name : undefined})`
    }

    const options = {
      'agent': false,
      'host': this.host,
      'port': 443,
      'path': path,
      'method': method,
      'headers': headers
    }

    if (method === 'POST' || method === 'PUT') {
      if (typeof body !== 'string') {
        body = JSON.stringify(body)
      }

      body = Buffer.from(body)
      options.headers['Content-Length'] = body.length
    }

    const request = HTTPS.request(options, function (response: IncomingMessage) {
      let data = ''

      response.on('data', chunk => {
        data += chunk
      })

      response.on('end', function () {
        if (response.statusCode && response.statusCode >= 400) {
          switch (response.statusCode) {
            case 401:
              throw new Error('Invalid access token provided')
            default:
              logger.error(`Campfire HTTPS status code: ${response.statusCode}`)
              logger.error(`Campfire HTTPS response data: ${data}`)
          }
        }

        if (callback) {
          try {
            return callback(null, JSON.parse(data))
          } catch (_err) {
            return callback(null, data || {})
          }
        }
      })

      return response.on('error', function (err) {
        logger.error(`Campfire HTTPS response error: ${err}`)
        return callback(err, {})
      })
    })

    if (method === 'POST' || method === 'PUT') {
      request.end(body, 'binary')
    } else {
      request.end()
    }

    return request.on('error', (err: Error) => logger.error(`Campfire request error: ${err}`))
  }
}

export default {
  use: (robot: Robot) => {
    return new Campfire(robot)
  }
}

'use strict'

import Robot from "../robot";
import fs from "fs";
import readline from "readline";
import Stream from "stream";
import cline from "cline";
import chalk from "chalk";
import Adapter from "../types/adapter";
import ErrnoException = NodeJS.ErrnoException;
import {TextMessage} from "../message";


const historySize = process.env.HUBOT_SHELL_HISTSIZE != null ? parseInt(process.env.HUBOT_SHELL_HISTSIZE) : 1024

const historyPath = '.hubot_history'

class Shell extends Adapter {
  [key:string]:any

  constructor(robot: Robot) {
    super(robot);
  }

  send (envelope: any,...strings: string[]) {
    Array.from(strings).forEach(str => console.log(chalk.bold(`${str}`)))
  }

  emote (envelope: any,...strings: string[]) {
    Array.from(strings).map((str:string) => {
      this.send(envelope, `* ${str}`);
    })
  }

  reply (envelope: any,...strings: string[]) {
    // @ts-ignore
    this.send.apply(this, [envelope].concat(strings))
  }

  run () {
    this.buildCli()

    loadHistory((error:Error, history:any) => {
      if (error) {
        console.log(error.message)
      }

      this.cli.history(history)
      this.cli.interact(`${this.robot.name}> `)
      return this.emit('connected')
    })
  }

  shutdown () {
    this.robot.shutdown()
    return process.exit(0)
  }

  buildCli () {
    this.cli = cline()

    this.cli.command('*', (input:any) => {
      let userId = process.env.HUBOT_SHELL_USER_ID || 1
      if (typeof userId == 'string' && userId.match(/A\d+z/)) {
        userId = parseInt(userId)
      }

      const userName = process.env.HUBOT_SHELL_USER_NAME || 'Shell'
      const user = this.robot.brain.userForId(userId, { name: userName, room: 'Shell' })
      this.receive(new TextMessage(user, input, 'messageId'))
    })

    this.cli.command('history', () => {
      Array.from(this.cli.history()).map(item => console.log(item))
    })

    this.cli.on('history', (item:any) => {
      if (item.length > 0 && item !== 'exit' && item !== 'history') {
        fs.appendFile(historyPath, `${item}\n`, (error: ErrnoException | null) => {
          if (error) {
            this.robot.emit('error', error)
          }
        })
      }
    })

    this.cli.on('close', () => {
      let fileOpts, history, i, item, len, outstream, startIndex

      history = this.cli.history()

      if (history.length <= historySize) {
        return this.shutdown()
      }

      startIndex = history.length - historySize
      history = history.reverse().splice(startIndex, historySize)
      fileOpts = {
        mode: 0x180
      }

      outstream = fs.createWriteStream(historyPath, fileOpts)
      outstream.on('finish', this.shutdown.bind(this))

      for (i = 0, len = history.length; i < len; i++) {
        item = history[i]
        outstream.write(item + '\n')
      }

      outstream.end(this.shutdown.bind(this))
    })
  }
}

export const use = (robot: Robot) => {
  return new Shell(robot);
};


// load history from .hubot_history.
//
// callback - A Function that is called with the loaded history items (or an empty array if there is no history)
function loadHistory (callback: {(...args: any[]): void} ) {
  if (!fs.existsSync(historyPath)) {
    return callback(new Error('No history available'))
  }

  const instream = fs.createReadStream(historyPath)
  const outstream = new Stream()

  const items: any[] = []

  // @ts-ignore
  readline.createInterface(instream, outstream,  false )
    .on('line', function (line:any) {
      line = line.trim()
      if (line.length > 0) {
        items.push(line)
      }
    })
    .on('close', () => callback(null, items))
    .on('error', callback)
}

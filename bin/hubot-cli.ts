'use strict'

// @ts-ignore
import {OptionParser} from "optparse";
import {loadScripts} from "./hubot"
// @ts-ignore
import Hubot from "..";

const switches = [
  ['-a', '--adapter ADAPTER', 'The Adapter to use'],
  ['-c', '--create PATH', 'Create a deployable hubot'],
  ['-d', '--disable-httpd', 'Disable the HTTP server'],
  ['-h', '--help', 'Display the help information'],
  ['-l', '--alias ALIAS', "Enable replacing the robot's name with alias"],
  ['-n', '--name NAME', 'The name of the robot in chat'],
  ['-r', '--require PATH', 'Alternative scripts path'],
  ['-t', '--config-check', "Test hubot's config to make sure it won't fail at startup"],
  ['-v', '--version', 'Displays the version of hubot installed']
]

interface options {
  adapter: string
  alias: boolean
  create: boolean
  enableHttpd: boolean
  scripts: string[]
  name:string
  path: string
  configCheck: boolean
  version?: boolean
}

const options:options = {
  adapter: process.env.HUBOT_ADAPTER || 'shell',
  alias: Boolean(process.env.HUBOT_ALIAS) || false,
  create: Boolean(process.env.HUBOT_CREATE) || false,
  enableHttpd: Boolean(process.env.HUBOT_HTTPD) || true,
  scripts: process.env.HUBOT_SCRIPTS?.split(",") || [],
  name: process.env.HUBOT_NAME || 'Hubot',
  path: process.env.HUBOT_PATH || '.',
  configCheck: false,
}

const Parser = new OptionParser(switches)
Parser.banner = 'Usage hubot [options]'

Parser.on('adapter', (opt:any, value:any) => {
  options.adapter = value
})

Parser.on('create', function (opt:any, value:any) {
  options.path = value
  options.create = true
})

Parser.on('disable-httpd', (opt:any) => {
  options.enableHttpd = false
})

Parser.on('help', function (opt:any, value:any) {
  console.log(Parser.toString())
  return process.exit(0)
})

Parser.on('alias', function (opt:any, value:any) {
  if (!value) {
    value = '/'
  }
  options.alias = value
})

Parser.on('name', (opt:any, value:any) => {
  options.name = value
})

Parser.on('require', (opt:any, value:any) => {
  options.scripts.push(value)
})

Parser.on('config-check', (opt:any) => {
  options.configCheck = true
})

Parser.on('version', (opt:any, value:any) => {
  options.version = true
})

Parser.on((opt:any, value:any) => {
  console.warn(`Unknown option: ${opt}`)
})

Parser.parse(process.argv)

if (process.platform !== 'win32') {
  process.on('SIGTERM', () => process.exit(0))
}

if (options.create) {
  console.error("'hubot --create' is deprecated. Use the yeoman generator instead:")
  console.error('    npm install -g yo generator-hubot')
  console.error(`    mkdir -p ${options.path}`)
  console.error(`    cd ${options.path}`)
  console.error('    yo hubot')
  console.error('See https://github.com/github/hubot/blob/master/docs/index.md for more details on getting started.')
  process.exit(1)
}

const robot = Hubot.loadBot(undefined, options.adapter, options.enableHttpd, options.name, options.alias)

if (options.version) {
  console.log(robot.version)
  process.exit(0)
}

if (options.configCheck) {
  loadScripts(robot, options)
  console.log('OK')
  process.exit(0)
}

robot.adapter.once('connected', loadScripts)

robot.run()

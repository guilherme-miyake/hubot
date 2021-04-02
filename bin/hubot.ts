'use strict'

import {existsSync, readFileSync, readFile} from "fs";

import {resolve as pathResolve} from "path";

// @ts-ignore
import Hubot from "..";
import Robot from "../src/robot";

export function loadScripts (robot: Robot, options:any) {
  robot.load(pathResolve('.', 'scripts'))
  robot.load(pathResolve('.', 'src', 'scripts'))

  loadHubotScripts(robot, options)
  loadExternalScripts(robot, options)

  options.scripts.forEach((scriptPath:string) => {
    if (scriptPath[0] === '/') {
      return robot.load(scriptPath)
    }

    robot.load(pathResolve('.', scriptPath))
  })
}

function loadHubotScripts (robot: Robot, options: any) {
  const hubotScripts = pathResolve('.', 'hubot-scripts.json')
  let scripts
  let scriptsPath

  if (existsSync(hubotScripts)) {
    let hubotScriptsWarning: string
    const data = readFileSync(hubotScripts)

    if (data.length === 0) {
      return
    }

    try {
      scripts = data.toJSON()
      scriptsPath = pathResolve('node_modules', 'hubot-scripts', 'src', 'scripts')
      robot.loadHubotScripts(scriptsPath, scripts)
    } catch (error) {
      robot.logger.error(`Error parsing JSON data from hubot-scripts.json: ${error}`)
      process.exit(1)
    }

    hubotScriptsWarning = 'Loading scripts from hubot-scripts.json is deprecated and ' + 'will be removed in 3.0 (https://github.com/github/hubot-scripts/issues/1113) ' + 'in favor of packages for each script.\n\n'

    // @ts-ignore
    if (scripts.length === 0) {
      hubotScriptsWarning += 'Your hubot-scripts.json is empty, so you just need to remove it.'
      return robot.logger.warning(hubotScriptsWarning)
    }

    const hubotScriptsReplacements = pathResolve('node_modules', 'hubot-scripts', 'replacements.json')
    const replacementsData = readFileSync(hubotScriptsReplacements)
    const replacements = replacementsData.toJSON()
    const scriptsWithoutReplacements: any[] = []

    if (!existsSync(hubotScriptsReplacements)) {
      hubotScriptsWarning += 'To get a list of recommended replacements, update your hubot-scripts: npm install --save hubot-scripts@latest'
      return robot.logger.warning(hubotScriptsWarning)
    }

    hubotScriptsWarning += 'The following scripts have known replacements. Follow the link for installation instructions, then remove it from hubot-scripts.json:\n'

    // @ts-ignore
    scripts.forEach((script:any) => {
      // @ts-ignore
      const replacement = replacements[script]

      if (replacement) {
        hubotScriptsWarning += `* ${script}: ${replacement}\n`
      } else {
        scriptsWithoutReplacements.push(script)
      }
    })

    hubotScriptsWarning += '\n'

    if (scriptsWithoutReplacements.length > 0) {
      hubotScriptsWarning += 'The following scripts don’t have (known) replacements. You can try searching https://www.npmjs.com/ or http://github.com/search or your favorite search engine. You can copy the script into your local scripts directory, or consider creating a new package to maintain yourself. If you find a replacement or create a package yourself, please post on https://github.com/github/hubot-scripts/issues/1641:\n'
      hubotScriptsWarning += scriptsWithoutReplacements.map((script) => `* ${script}\n`).join('')
      hubotScriptsWarning += '\nYou an also try updating hubot-scripts to get the latest list of replacements: npm install --save hubot-scripts@latest'
    }

    robot.logger.warning(hubotScriptsWarning)
  }
}

function loadExternalScripts (robot: Robot, options: any) {
  const externalScripts = pathResolve('.', 'external-scripts.json')

  if (!existsSync(externalScripts)) {
    return
  }

  readFile(externalScripts, function (error, data) {
    if (error) {
      throw error
    }

    try {
      robot.loadExternalScripts(data.toJSON())
    } catch (error) {
      console.error(`Error parsing JSON data from external-scripts.json: ${error}`)
      process.exit(1)
    }
  })
}

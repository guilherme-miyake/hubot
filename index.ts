import hubotExport from "./es2015";

import {inherits} from "util";
// make all es2015 class declarations compatible with CoffeeScript’s extend
// see https://github.com/hubotio/evolution/pull/4#issuecomment-306437501
export const Hubot = Object.keys(hubotExport).reduce((map, current) => {
  if (current !== 'loadBot') {
    // @ts-ignore
    map[current] = makeClassCoffeeScriptCompatible(hubotExport[current])
  } else {
    // @ts-ignore
    map[current] = hubotExport[current]
  }
  return map
}, {})

function makeClassCoffeeScriptCompatible (klass:any) {
  function CoffeeScriptCompatibleClass () {
    // @ts-ignore
    const Hack = Function.prototype.bind.apply(klass, [null].concat([].slice.call(arguments)))
    const instance = new Hack()

    // pass methods from child to returned instance
    // @ts-ignore
    for (const key in this) {
      // @ts-ignore
      instance[key] = this[key]
    }

    // support for constructor methods which call super()
    // in which this.* properties are set
    for (const key in instance) {
      // @ts-ignore
      this[key] = instance[key]
    }

    return instance
  }
  inherits(CoffeeScriptCompatibleClass, klass)

  return CoffeeScriptCompatibleClass
}

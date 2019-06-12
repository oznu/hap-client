'use strict'

const fs = require('fs')
const path = require('path')
const rp = require('request-promise')

async function load(url) {
  let types = await rp.get('https://raw.githubusercontent.com/KhaosT/HAP-NodeJS/master/lib/gen/HomeKitTypes.js')
  let tvTypes = await rp.get('https://raw.githubusercontent.com/KhaosT/HAP-NodeJS/master/lib/gen/HomeKitTypes-Television.js')

  types += tvTypes;

  types = types.split('\n').filter(t => t.match(/UUID/))

  types = types.map((t) => {
    t = t.split('=')

    const uuid = t[1].trim().replace(/'|;/g, '')
    const id = t[0].trim().split('.')

    return {
      type: id[0],
      name: id[1],
      uuid: uuid
    }
  })

  let Services = types
    .filter(t => t.type === 'Service')
    .map((t) => {
      return `    '${t.uuid}': '${t.name}',\n    '${t.name}': '${t.uuid}',`
    })

  Services.unshift(`export const Services = {`)
  Services.push(`};\n\n`)

  Services = Services.join('\n')

  let Characteristics = types
    .filter(t => t.type === 'Characteristic')
    .map((t) => {
      return `    '${t.uuid}': '${t.name}',\n    '${t.name}': '${t.uuid}',`
    })

  Characteristics.unshift(`export const Characteristics = {`)
  Characteristics.push(`};\n`)
  Characteristics = Characteristics.join('\n')

  const out = `/* This file is automatically generated */\n\n` + Services + Characteristics

  fs.writeFileSync(path.resolve(__dirname, '../src/hap-types.ts'), out, 'utf8')
}

load();
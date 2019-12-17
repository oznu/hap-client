import * as fs from 'fs';
import * as path from 'path';
import { Characteristic, Service } from 'hap-nodejs';

/** Generate Service Types */

let Services = [
  'export const Services = {',
] as any;

for (const [name, value] of Object.entries(Service)) {
  if (value.UUID) {
    Services.push(`    '${value.UUID}': '${name}',`);
    Services.push(`    '${name}': '${value.UUID}',`);
  }
}

Services.push(`};\n\n`);
Services = Services.join('\n');

/** Generate Characteristic Types */

let Characteristics = [
  'export const Characteristics = {',
] as any;

for (const [name, value] of Object.entries(Characteristic)) {
  if (value.UUID) {
    Characteristics.push(`    '${value.UUID}': '${name}',`);
    Characteristics.push(`    '${name}': '${value.UUID}',`);
  }
}

Characteristics.push(`};\n`);
Characteristics = Characteristics.join('\n');

const out = `/* This file is automatically generated */\n\n` + Services + Characteristics;

fs.writeFileSync(path.resolve(__dirname, '../src/hap-types.ts'), out, 'utf8');
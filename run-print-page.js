import { printPageImage } from './print-page.js';
import { mkdir, writeFile } from 'node:fs/promises'

const image = await printPageImage('https://httpbin.org/headers');
await mkdir('data', {recursive: true});
await writeFile('data/test.png', image);
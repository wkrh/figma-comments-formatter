import * as fs from 'fs';
import { Data, CommentsHandler } from './figma';

const data: Data = JSON.parse(
  fs.readFileSync(`${__dirname}/data.json`).toString()
);

const h = new CommentsHandler(data);

console.log(JSON.stringify(h.tree(), null, 2));

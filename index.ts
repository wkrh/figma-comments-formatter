import * as fs from 'fs';
import { CommentsHandler } from './figma';

console.log(
  JSON.stringify(
    new CommentsHandler(
      JSON.parse(fs.readlinkSync(`${__dirname}/data.json`))
    ).tree(),
    null,
    2
  )
);

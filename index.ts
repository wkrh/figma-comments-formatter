import * as fs from 'fs';
import { Comments } from './figma';

const cc = new Comments(
  JSON.parse(fs.readFileSync(`${__dirname}/data.json`).toString()).comments
);

console.log(
  JSON.stringify(
    cc.getSorted().map(c => {
      const zumi = c.resolved_at ? '済' : '';
      return [
        `▼ ${c.num} ${zumi}`,
        c.created_at,
        c.user.handle,
        c.message,
        c.num,
        c.resolved_at,
        c.isRoot,
      ];
    }),
    null,
    2
  )
);

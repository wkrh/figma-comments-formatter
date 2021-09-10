const data = {
  comments: [
    {
      id: '107616033',
      file_key: 'cVyLsxdPAgJ2KSmyvpYrva',
      parent_id: '',
      user: {
        handle: 'ITM粕谷貴志',
        img_url:
          'https://www.gravatar.com/avatar/918f6c303d5a1f33aa3de812f551095e?size=240&default=https%3A%2F%2Fs3-alpha.figma.com%2Fstatic%2Fuser_i_v2.png',
        id: '965876382899712942',
      },
      created_at: '2021-09-09T10:04:57.191Z',
      resolved_at: null,
      message: '4つのメッセージを横に出すにはちょっと幅が狭すぎるかもですね。',
      client_meta: { node_id: '2493:653', node_offset: { x: 2213, y: 1713 } },
      order_id: '646',
    },
  ],
};

interface User {
  handle: string;
  img_url: string;
  id: string;
}

interface ClientMeta {
  node_id: string;
  node_offset: { x: number; y: number };
}

interface IComment {
  id: string;
  file_key: string;
  parent_id: string;
  user: User;
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta: ClientMeta;
  order_id: string;
}

export interface Comment extends IComment {}
export class Comment {
  constructor(props: IComment, public allComments: Comment[]) {
    Object.assign(this, props);
  }

  child() {
    return this.allComments.find(c => c.parent_id === c.id);
  }

  children() {
    const out: Comment[] = [];
    let node = this.child();
    while (node) {
      out.push(node);
      node = node.child();
    }
    return out;
  }
}

//

export interface User {
  handle: string;
  img_url: string;
  id: string;
}

export interface ClientMeta {
  node_id: string;
  node_offset: { x: number; y: number };
}

export interface IComment {
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
  constructor(props: IComment, public allComments: IComment[]) {
    Object.assign(this, props);
  }

  children() {
    return this.allComments
      .filter(c => c.parent_id === this.id)
      .sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
      .map(c => new Comment(c, this.allComments));
  }
}

export class Comments {
  constructor(public data: IComment[]) {}

  getRoots() {
    return this.data
      .filter(c => !!c.order_id)
      .map(c => new Comment(c, this.data));
  }

  getSorted() {
    return this.getRoots().flatMap(c => {
      const num = c.order_id;
      return [
        {
          num,
          isRoot: true,
          ...c,
        },
        ...c.children().map(cc => ({
          num,
          isRoot: false,
          ...cc,
        })),
      ];
    });
  }
}

export interface Data {
  comments: IComment[];
}

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

  short() {
    return {
      created_at: this.created_at,
      user: this.user.handle,
      message: this.message,
    };
  }
}

export class CommentsHandler {
  constructor(public data: Data) {}

  getRoots() {
    return this.data.comments
      .filter(c => !!c.order_id)
      .map(c => new Comment(c, this.data.comments));
  }

  toTree() {
    return this.getRoots().map(c => ({
      num: c.order_id,
      thread: [c.short(), ...c.children().map(cc => cc.short())],
    }));
  }

  toArray() {
    return this.getRoots().flatMap(c => {
      const resolved = c.resolved_at ? '済' : '';
      const num = c.order_id;
      return [
        {
          mark: `▼ ${num} ${resolved}`,
          ...c.short(),
          num,
          resolved,
          isRoot: true,
        },
        ...c.children().map(cc => ({
          mark: '',
          ...cc.short(),
          num,
          resolved,
          isRoot: false,
        })),
      ];
    });
  }
}

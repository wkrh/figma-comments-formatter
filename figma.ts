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

  child() {
    const e = this.allComments.find(c => c.parent_id === this.id);
    return e ? new Comment(e, this.allComments) : null;
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

  short() {
    return {
      user: this.user.handle,
      message: this.message,
      created_at: this.created_at,
    };
  }
}

export class CommentsHandler {
  constructor(public data: Data) {}

  roots() {
    return this.data.comments
      .filter(c => !!c.order_id)
      .map(c => new Comment(c, this.data.comments));
  }

  tree() {
    return this.roots().map(c => ({
      num: c.order_id,
      thread: [c.short(), ...c.children().map(cc => cc.short())],
    }));
  }
}

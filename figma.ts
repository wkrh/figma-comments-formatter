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
    return this.allComments.find(c => c.parent_id === c.id);
  }

  children() {
    const out: IComment[] = [];
    let node = this.child();
    while (node) {
      out.push(node);
      node = this.create(node).child();
    }
    return out;
  }

  create(c: IComment) {
    return new Comment(c, this.allComments);
  }
}

export class CommentsHandler {
  constructor(public data: Data) {}

  roots() {
    return this.data.comments.filter(c => !!c.order_id);
  }

  tree() {
    return this.roots().map(c => ({
      ...c,
      children: new Comment(c, this.data.comments).children(),
    }));
  }
}

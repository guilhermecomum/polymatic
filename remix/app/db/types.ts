import type { Generated, ColumnType } from "kysely";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ChannelData {
  pattern: string;
  sample: string;
}

export interface Composition {
  id: string;
  slug: string;
  title: string | null;
  user_id: string | null;
  folder_id: string | null;
  bpm: Generated<number>;
  channels: ColumnType<ChannelData[], string, string>;
  is_public: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Folder {
  id: string;
  name: string;
  user_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Database {
  users: User;
  compositions: Composition;
  folders: Folder;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Database {
  users: User;
}
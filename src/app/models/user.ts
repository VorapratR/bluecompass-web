export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  roles: string;
}

export interface EmailPasswordPair {
  email: string;
  password: string;
}

export interface NewAccount {
  name: string;
  email: string;
  password: string;
  roles: string;
}

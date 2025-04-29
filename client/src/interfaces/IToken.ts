import { Pengguna } from "./IAuth";

export interface Token {
  id: string;
  pengguna_id: string;
  token: string;
  Pengguna?: Pengguna;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenCreate {
  pengguna_id: string;
  token: string;
}

export interface TokenUpdate {
  token?: string;
}
import { Pengguna, PenggunaCreate, PenggunaLogin, PenggunaUpdate } from '../types/pengguna.types';

export interface IPenggunaService {

  register(penggunaData: PenggunaCreate): Promise<Omit<Pengguna, 'kata_sandi'>>;
  login(loginData: PenggunaLogin): Promise<{ 
    pengguna: Omit<Pengguna, 'kata_sandi'>, 
    token: string 
  }>;
  getProfile(userId: string): Promise<Omit<Pengguna, 'kata_sandi'>>;
  updateProfile(userId: string, userData: PenggunaUpdate): Promise<Omit<Pengguna, 'kata_sandi'>>;
  logout(token: string): Promise<boolean>;
}
import { INavItem } from '../interfaces/navigations/INavigation';

export const dataNav: INavItem[] = [
  {
    label: "Beranda",
    route: "/",
    auth: false,
  },
  {
    label: "Jadwal",
    route: "/jadwal",
    auth: false,
  },
  {
    label: "Riwayat",
    route: "/riwayat",
    auth: true,
  },
  {
    label: "Transaksi",
    route: "/transaksi",
    auth: true,
  },
];

export interface INavItem {
  label: string;
  route: string;
  auth: boolean;
}

export interface INavProps {
  items: INavItem[];
}

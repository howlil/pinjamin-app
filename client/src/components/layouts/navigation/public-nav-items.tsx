import { FC } from "react";
import { useActivePath } from "@/hooks/use-active-path";


export interface INavItem {
  route: string;
  label: string;
  auth: Boolean;
}
interface INavProps {
  items : INavItem[]
}

const Navigation: FC<INavProps> = ({ items }) => {
  const activePath = useActivePath();

  return (
    <>
      <ul className="flex space-x-4">
        {items.map((item, index) => {
          const isActive = item.route === activePath;

          return (
            <li key={index}>
              <a
                href={item.route}
                className={
                  isActive ? "font-bold underline text-main-green" : ""
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default Navigation;

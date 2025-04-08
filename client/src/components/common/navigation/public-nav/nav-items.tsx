import { FC } from "react";
import { INavProps } from "@/interfaces/INavigation";


const Navigation: FC<INavProps> = ({ items }) => {
  return (
    <>
      <ul className="flex space-x-4">
        {items.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.route}>{item.label}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default Navigation;

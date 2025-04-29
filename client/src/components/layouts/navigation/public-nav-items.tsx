import { FC } from "react";
import { useActivePath } from "@/hooks/use-active-path";
import { motion } from "framer-motion";

export interface INavItem {
  route: string;
  label: string;
  auth: boolean;
}

interface INavProps {
  items: INavItem[];
  isMobile?: boolean;
  onItemClick?: () => void;
  glassEffect?: boolean;
}


const Navigation: FC<INavProps> = ({ 
  items, 
  isMobile = false, 
  onItemClick,
  glassEffect = false
}) => {
  const activePath = useActivePath();

  if (isMobile) {
    return (
      <div className="flex flex-col ">
        {items.map((item, index) => {
          const isActive = activePath === item.route;
          
          return (
            <motion.a
              key={index}
              href={item.route}
              onClick={() => onItemClick && onItemClick()}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`block px-4 py-2 text-md rounded-full transition-all ${
                isActive
                  ? glassEffect 
                    ? "bg-main-green text-white font-semibold" 
                    : "bg-main-green text-main-green font-semibold"
                  : glassEffect
                    ? "text-black hover:bg-white/10" 
                    : "hover:bg-gray-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>                
              </div>
             
            </motion.a>
          );
        })}
      </div>
    );
  }

  // Desktop navigation centered
  return (
    <ul className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-12">
      {items.map((item, index) => {
        const isActive = activePath === item.route;
        
        return (
          <li key={index} className="relative">
            <a
              href={item.route}
              className={`relative px-3 py-2 text-sm sm:text-base transition-colors ${
                isActive
                  ? "font-semibold text-main-green"
                  : "text-gray-700 hover:text-main-green"
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="navigation-underline"
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-main-green rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Navigation;
import React from "react";
import { LucideIcon } from "lucide-react";
import { STATUS } from "@/apis/interfaces/IEnum";

export interface ActionButton {
  judul: string;
  icon: LucideIcon;
  action: () => void;
  showOn?: typeof STATUS.ROLE.ADMIN | typeof STATUS.ROLE.PEMINJAM | "ALL";
  hideOnRoutes?: string[];
  showOnRoutes?: string[];
}

interface User {
  nama_lengkap : string
  email : string
  role : string
}
interface UserPopUpProps {
  actions: ActionButton[];
  user:User ;
  currentRoute: string;
}

const UserPopUp: React.FC<UserPopUpProps> = ({
  user,
  actions,
  currentRoute,
  
}) => {
  const filteredAction = actions.filter((action) => {
    if (action.showOn && action.showOn !== "ALL" && action.showOn !== user.role) {
      return false;
    }
    if (
      action.hideOnRoutes &&
      action.hideOnRoutes.some((route) => currentRoute.includes(route))
    ) {
      return false;
    }
    if (
      action.showOnRoutes &&
      !action.showOnRoutes.some((route) => currentRoute.includes(route))
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10 border">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium">{user.nama_lengkap || "User"}</p>
        <p className="text-xs text-gray-500">{user.email || ""}</p>
      </div>

      <div>
        {filteredAction.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={`${action.judul}-${index}`}
              className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                action.judul.toLowerCase().includes("logout")
                  ? "text-red-600"
                  : ""
              }`}
              onClick={action.action}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {action.judul}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserPopUp;

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import UserProfile from "@/components/ui/costum/user-profile";
import UserPopUp from "@/components/ui/costum/user-pop-up";
import { useLocation } from "react-router-dom";
import { userActions } from "./nav-data";

export default function UserItem() {
  const [showDropdown, setShowDropdown] = useState(false);
  const pengguna = useAuthStore((state) => state.pengguna);
  const currentLocation = useLocation().pathname;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="flex space-x-3 items-center">
      <div className="relative profile-dropdown-container">
        <UserProfile srcImg="ini" initial="A" action={toggleDropdown} />

        {showDropdown && (
          <UserPopUp
            user={pengguna}
            actions={userActions}
            currentRoute={currentLocation}
          />
        )}
      </div>
    </div>
  );
}

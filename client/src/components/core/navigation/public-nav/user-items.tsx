import { useState, useEffect } from "react";
import { Bell, User, LogOut, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const pengguna = useAuthStore((state) => state.pengguna);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth-storage");
    navigate("/masuk");
    setShowDropdown(false);
  };

  const handleEditProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setShowDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (!target.closest(".profile-dropdown-container")) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const userInitial = pengguna?.nama_lengkap?.charAt(0) || "U";
  const userRole = pengguna?.role || "peminjam";

  return (
    <div className="flex space-x-3 items-center">
      <Bell className="cursor-pointer" />

      <div className="relative profile-dropdown-container">
        <Avatar
          className="cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10 border">
            {/* Show user info */}
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium">
                {pengguna?.nama_lengkap || "User"}
              </p>
              <p className="text-xs text-gray-500">{pengguna?.email || ""}</p>
            </div>

            {userRole === "PEMINJAM" ? (
              <div>
                <button
                  onClick={handleEditProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  Ubah Profil
                </button>
              </div>
            ) : (
              userRole === "ADMIN" && (
                <div>
                  <button
                    onClick={handleDashboard}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                </div>
              )
            )}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

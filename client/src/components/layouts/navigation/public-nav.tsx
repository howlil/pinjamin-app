import logo from "@/assets/logo.png";
import Navigation from "./public-nav-items";
import { FC } from "react";
import { publicData } from "./nav-data";
import UserItem from "./user-items";
import { Button } from "@/components/ui/button";

interface PublicNavProps {
  isScrolled: Boolean;
}

const PublicNav: FC<PublicNavProps> = ({ isScrolled }) => {
  const token = localStorage.getItem("auth-token");

  return (
    <nav
      className={`flex px-4 md:px-20 xl:px-32 py-6 items-center  justify-between ${
        isScrolled && "bg-white/30  backdrop-blur-sm"
      }`}
    >
      <img src={logo} className="md:w-28 w-16" />
      <Navigation items={publicData} />
      {token && <UserItem />}
      <Button className="cursor-pointer w-32">Masuk/Daftar</Button>
    </nav>
  );
};

export default PublicNav;

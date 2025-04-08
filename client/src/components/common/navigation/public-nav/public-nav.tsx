import logo from "@/assets/logo.png";
import Navigation from "./nav-items";
import UserItems from "./user-items";
import { FC } from "react";
import { dataNav } from "@/data/nav-data";

interface PublicNavProps {
  isScrolled : Boolean
}

const PublicNav : FC<PublicNavProps> =({isScrolled})=> {
  return (
    <nav className={`flex px-24 py-6 items-center  justify-between ${isScrolled && "bg-white/30  backdrop-blur-sm"}`}>
      <img src={logo} className="md:w-28 w-16" />
      <Navigation items={dataNav} />
      <UserItems />
    </nav>
  );
}

export default PublicNav
import PublicNav from "../navigation/public-nav/public-nav";
import { FC, ReactNode, useState,useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] =useState(false);

  useEffect(() => {
    const handlerScroll = () => {
      if (!isMobile) {
        setIsScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll',handlerScroll)
    return ()=> window.removeEventListener('scroll',handlerScroll)

  }, [isMobile]);

  return (
    <>
      <header className="fixed z-50 blu w-full">
        <PublicNav isScrolled={isScrolled} />
      </header>
      <main className="mx-32 ">{children}</main>
    </>
  );
};

export default MainLayout;

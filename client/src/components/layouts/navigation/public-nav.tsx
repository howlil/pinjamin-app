import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import Navigation from "./public-nav-items";
import { publicData } from "./nav-data";
import UserItem from "./user-items";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface PublicNavProps {
  isScrolled: boolean;
}

/**
 * Responsive public navigation component with centered desktop menu
 * and glassmorphism popup for mobile
 */
const PublicNav = ({ isScrolled }: PublicNavProps) => {
  const [token, setToken] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Get authentication token from localStorage after component mounts
  useEffect(() => {
    setToken(localStorage.getItem("auth-token"));
  }, []);

  // Handle navigation to login page
  const handleLogin = () => {
    window.location.href = "/masuk";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Logo - Always visible */}
      <a href="/" className="flex items-center z-20">
        <img src={logo} alt="Logo" className="w-16 md:w-24 h-auto" />
      </a>

      {/* Desktop Navigation - Centered */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Navigation items={publicData} />
      </div>
      
      {/* Authentication buttons - Desktop */}
      <div className="hidden md:block">
        {token ? (
          <UserItem />
        ) : (
          <Button onClick={handleLogin} className="w-32">
            Masuk/Daftar
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative z-20" 
          aria-label="Menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Mobile Navigation Popup with Glassmorphism */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-full h-full sm:h-auto sm:max-h-[90vh] p-0 border-none bg-transparent shadow-none">
            <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md w-[90%] rounded-xl bg-white/30  border  border-gray-200  overflow-hidden"
              >
                <div className="p-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-black hover:bg-white/10"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                <div className="px-6 py-4">
                  <Navigation 
                    isMobile 
                    items={publicData} 
                    onItemClick={() => setIsOpen(false)}
                    glassEffect
                  />
                </div>
                
                <div className="p-6 border-t border-gray-300">
                  {token ? (
                    <UserItem />
                  ) : (
                    <Button 
                      onClick={handleLogin} 
                      className="w-full bg-white text-black hover:bg-white/90"
                    >
                      Masuk/Daftar
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default PublicNav;
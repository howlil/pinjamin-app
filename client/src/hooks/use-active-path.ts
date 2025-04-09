
import { useState, useEffect } from "react";


export const useActivePath = () => {
  const [activePath, setActivePath] = useState<string>("");
  useEffect(() => {
    setActivePath(window.location.pathname);
    const handleLocationChange = () => {
      setActivePath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);
  
  return activePath;
};
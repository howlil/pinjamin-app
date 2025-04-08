import { Button } from "@/components/ui/button";
import UserProfile from "@/components/ui/costum/user-profile";
import { useNavigate } from "react-router-dom";


const UserItems = () => {
  const navigate = useNavigate()
  const isLogin = false;
  return (
    <>
      {isLogin ?(
        <UserProfile/>
      ):(
      <Button onClick={()=>navigate("/masuk")} className="w-36 cursor-pointer" >Login/Register</Button>
      )}
    </>
  );
};

export default UserItems;

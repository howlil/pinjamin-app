import { Button } from "@/components/ui/button";
import UserProfile from "@/components/ui/costum/user-profile";


const UserItems = () => {
  const isLogin = false;
  return (
    <>
      {isLogin ?(
        <UserProfile/>
      ):(
      <Button className="w-36" >Login/Register</Button>
      )}
    </>
  );
};

export default UserItems;

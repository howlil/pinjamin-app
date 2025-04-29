import { Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

interface UserProfileProps {
  srcImg: string;
  initial: string;
  action:()=>void
}

export default function UserProfile({ srcImg, initial ,action}: UserProfileProps) {
  return (
    <div onClick={action} className="flex space-x-3  items-center">
      <Bell className="cursor-pointer" />
      <Avatar className="cursor-pointer">
        <AvatarImage src={srcImg} alt="@shadcn" />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}

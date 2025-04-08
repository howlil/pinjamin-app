import { Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

export default function UserProfile() {
  return (
    <div className="flex space-x-3 items-center">
      <Bell />
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
}

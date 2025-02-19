import { useRef, useState, type HTMLAttributes } from "react";
import type React from "react";
import { Avatar, AvatarImage } from "./avatar";
import Typography from "./typography";
import { cn, removeCookie } from "@/lib/utils/index";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useGetUserInfoQuery } from "@/features/store/services/user";

interface ProfileButtonProps extends HTMLAttributes<HTMLDivElement> {}

const ProfileButton: React.FC<ProfileButtonProps> = ({ ...props }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const { data } = useGetUserInfoQuery({});
  useOnClickOutside(userRef, () => setIsDropdownOpen(false));
  const router = useRouter();
  const handleLogout = async () => {
    try {
      removeCookie("auth-token");
      removeCookie("refresh-token");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative" ref={userRef}>
      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={cn(["flex justify-center place-items-center gap-4 cursor-pointer", props.className])} {...props}>
        <Avatar>
          <AvatarImage src="/avatar.png" />
          {/* <AvatarFallback className="flex place-items-center justify-center bg-bg_base_light">JC</AvatarFallback> */}
        </Avatar>
        <div className="flex flex-col justify-between">
          <Typography as={"span"} size={"base"} weight={"semibold"}>
            {data?.data?.name}
          </Typography>
          <Typography opacity={"50"} size={"base"} weight={"medium"}>
            {data?.data?.email}
          </Typography>
        </div>
      </div>
      <div className={cn(["absolute left-0 top-12 z-10 bg-white rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.24)] w-44", isDropdownOpen ? "block" : "hidden"])}>
        <ul className="py-2 text-sm text-gray-700">
          <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};
export default ProfileButton;

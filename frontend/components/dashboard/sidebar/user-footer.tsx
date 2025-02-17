import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMe } from "@/server/actions";

const UserFooter = async () => {
  const query = await getMe();
  const { data } = query ?? {};
  const { data: user } = data ?? {};

  const splitName = user?.name?.split(" ");
  const name =
    (splitName?.length ?? 0) > 1
      ? splitName?.[0][0].concat(splitName[1][0])
      : splitName?.[0][0];

  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center justify-center h-8 w-8  rounded-lg overflow-hidden">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback className="bg-blue-700">{name}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm">{user?.name}</span>
        <span className="font-light text-xs">Username: @{user?.username}</span>
      </div>
    </div>
  );
};

export default UserFooter;

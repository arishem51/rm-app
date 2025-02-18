import ProfileForm from "@/components/dashboard/profile/profile-form";
import { Separator } from "@/components/ui/separator";
import { getMe } from "@/server/actions";

const Profile = async () => {
  const query = await getMe();
  const { data } = query ?? {};
  const { data: user } = data ?? {};

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Profile</h1>
      <p className="text-sm text-muted-foreground">
        This is how others will see you on the site.
      </p>
      <Separator className="my-4 w-1/2" />
      {user && <ProfileForm user={user} />}
    </div>
  );
};

export default Profile;

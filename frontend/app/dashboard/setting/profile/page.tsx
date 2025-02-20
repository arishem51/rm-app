import HydrationPrefetchQuery from "@/components/dashboard/hydration-prefetch-query";
import ProfileForm from "@/components/dashboard/profile/profile-form";
import { Separator } from "@/components/ui/separator";
import { ApiQuery } from "@/services/query";

const Profile = async () => {
  return (
    <HydrationPrefetchQuery awaitQuery query={ApiQuery.users.getMe()}>
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2">Profile</h1>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
        <Separator className="my-4 w-1/2" />
        <ProfileForm />
      </div>
    </HydrationPrefetchQuery>
  );
};

export default Profile;

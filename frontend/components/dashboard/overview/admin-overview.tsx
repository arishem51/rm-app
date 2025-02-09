
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Store, UsersRound } from "lucide-react";

const AdminOverview = () => {
  return (
    <div className="mt-4 flex gap-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <UsersRound size={14} />
            <span>Total users</span>
          </CardTitle>
          {/** FIXME: api */}
          <CardDescription className="text-neutral-50">0</CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <Store size={14} />
            <span>Total shops</span>
          </CardTitle>
          {/** FIXME: api */}
          <CardDescription className="text-neutral-50">0</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminOverview;
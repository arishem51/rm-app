import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC, Fragment, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  type?: "sign-in" | "sign-up";
};

const AuthForm: FC<Props> = ({
  title,
  description,
  children,
  type = "sign-in",
}) => {
  const isSignUp = type === "sign-up";
  return (
    <Card className="mx-auto max-w-sm ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isSignUp && (
            <Fragment>
              <div className="space-y-1">
                <Label htmlFor="username">Name</Label>
                <Input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="(+84) 123 456 78"
                  required
                />
              </div>
            </Fragment>
          )}
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Username" required />
          </div>
          <div className="space-y-1">
            <div className="flex">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <Link
                  href="/"
                  className="text-sm ml-auto hover:underline underline-offset-4"
                >
                  Forgot you password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="*********"
              required
            />
          </div>
          {isSignUp && (
            <div className="space-y-1">
              <Label htmlFor="username">Role</Label>
              <Select value="OWNER">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full">
            Login
          </Button>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;

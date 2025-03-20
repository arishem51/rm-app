import { UserRole } from "@/lib/constants";
import { checkRole } from "@/lib/helpers";
import { UserDTO } from "@/types/Api";

describe("checkRole function", () => {
  const baseUser = {
    id: 1,
    phoneNumber: "0390521384",
    email: "hungphung2002@gmail.com",
    status: "ACTIVE",
    createdAt: new Date().toString(),
    username: "admin",
    name: "Hung Phung",
  };
  test("should return isAdmin true if role is admin", () => {
    const user: UserDTO = { role: UserRole.ADMIN, ...baseUser };
    const result = checkRole(user);
    expect(result.isAdmin).toBe(true);
    expect(result.isOwner).toBe(false);
    expect(result.isStaff).toBe(false);
  });

  test("should return isOwner true if role is owner", () => {
    const user = { role: UserRole.OWNER, ...baseUser };
    const result = checkRole(user);
    expect(result.isOwner).toBe(true);
    expect(result.isAdmin).toBe(false);
    expect(result.isStaff).toBe(false);
  });

  test("should return isStaff true if role is staff", () => {
    const user = { role: UserRole.STAFF, ...baseUser };
    const result = checkRole(user);
    expect(result.isStaff).toBe(true);
    expect(result.isAdmin).toBe(false);
    expect(result.isOwner).toBe(false);
  });

  test("should return all false if user is not provided", () => {
    const result = checkRole(undefined);
    expect(result.isAdmin).toBe(false);
    expect(result.isOwner).toBe(false);
    expect(result.isStaff).toBe(false);
  });

  test("should return all false if user has no role", () => {
    const user = { role: "", ...baseUser };
    const result = checkRole(user);
    expect(result.isAdmin).toBe(false);
    expect(result.isOwner).toBe(false);
    expect(result.isStaff).toBe(false);
  });
});

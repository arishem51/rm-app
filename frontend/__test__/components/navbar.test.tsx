import Navbar from "@/components/dashboard/header/navbar";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Navbar", () => {
  it("renders one breadcrumb based on pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
    render(<Navbar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders multiple breadcrumb links based on pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard/users");
    render(<Navbar />);
    expect(screen.getByText("Dashboard")).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("Users")).toBeInTheDocument();
  });
});

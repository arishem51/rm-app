import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "@/components/form/auth-form";
import "@testing-library/jest-dom";

describe("AuthForm Component", () => {
  const mockOnSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form for sign-in", () => {
    render(
      <AuthForm
        type="sign-in"
        onSubmit={mockOnSubmit}
        btnText="Nút đăng nhập"
        enableReCaptcha={false}
      />
    );

    expect(screen.getByText("Tên đăng nhập")).toBeInTheDocument();
    expect(screen.getByText("Mật khẩu")).toBeInTheDocument();
    expect(screen.getByText("Nút đăng nhập")).toBeInTheDocument();
  });

  it("renders the form for sign-up", () => {
    render(
      <AuthForm
        type="sign-up"
        onSubmit={mockOnSubmit}
        btnText="Nút Đăng Ký"
        enableReCaptcha={false}
      />
    );

    expect(screen.getByText("Số điện thoại")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("(+84) 123 456 78")).toBeInTheDocument();
    expect(screen.getByText("Nút Đăng Ký")).toBeInTheDocument();
  });

  it("submitting the form with valid data calls onSubmit", async () => {
    render(
      <AuthForm
        type="sign-in"
        onSubmit={mockOnSubmit}
        btnText="Đăng nhập"
        enableReCaptcha={false}
      />
    );

    fireEvent.input(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "user123" },
    });
    fireEvent.input(screen.getByPlaceholderText("*********"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Đăng nhập"));

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
  });

  test("shows validation error when form fields are empty", async () => {
    render(
      <AuthForm
        type="sign-in"
        onSubmit={mockOnSubmit}
        btnText="Đăng nhập"
        enableReCaptcha={false}
      />
    );

    fireEvent.click(screen.getByText("Đăng nhập"));

    expect(
      await screen.findByText(
        "Tên đăng nhập có độ dài ít nhất 3 ký tự và tối đa là 20"
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Mật khẩu phải dài ít nhất 6 ký tự")
    ).toBeInTheDocument();
  });

  test("shows reCAPTCHA when enabled", async () => {
    render(
      <AuthForm
        type="sign-up"
        onSubmit={mockOnSubmit}
        btnText="Sign Up"
        enableReCaptcha={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("recatpcha")).toBeInTheDocument();
    });
  });

  test("disables submit button until reCAPTCHA is completed", async () => {
    render(
      <AuthForm
        type="sign-up"
        onSubmit={mockOnSubmit}
        btnText="Đăng ký"
        enableReCaptcha={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("recatpcha")).toBeInTheDocument();
      const submitButton = screen.getByText("Đăng ký");
      expect(submitButton).toBeDisabled();
    });
  });
});

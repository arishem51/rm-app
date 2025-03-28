describe("Sign Up spec", () => {
  afterEach(() => {
    cy.wait(2000);
  });

  it("Đăng ký với tài khoản đã tồn tại username", () => {
    cy.visit("http://localhost:3000/auth/sign-up");
    cy.get("input[name=phoneNumber]").type("0383906223");
    cy.get("input[name=name]").type("Phùng Văn Hưng");
    cy.get("input[name=email]").type("abc123@gmail.com");
    cy.get("input[name=username]").type("danganh123");
    cy.get("input[name=password]").type("danganh123");
    cy.get("input[name=confirmPassword]").type("danganh123");
    cy.get("button[type=submit]").should("be.disabled");

    cy.get("button[type=submit]").then((button) => {
      button[0].removeAttribute("disabled");
    });

    cy.get("button[type=submit]").should("not.be.disabled");

    cy.get("button[type=submit]").click();
    cy.wait(1000);
    cy.get(".toast-login-error-test").should("be.visible");
  });

  it("Email không hợp lệ", () => {
    cy.visit("http://localhost:3000/auth/sign-up");
    cy.get("input[name=phoneNumber]").type("0383906223");
    cy.get("input[name=name]").type("Phùng Văn Hưng");
    cy.get("input[name=email]").type("abc123gmail.com");
    cy.get("input[name=username]").type("danganh123");
    cy.get("input[name=password]").type("danganh123");
    cy.get("input[name=confirmPassword]").type("danganh123");
    cy.get("button[type=submit]").should("be.disabled");

    cy.get("button[type=submit]").then((button) => {
      button[0].removeAttribute("disabled");
    });

    cy.get("button[type=submit]").should("not.be.disabled");

    cy.get("button[type=submit]").click();

    cy.contains("Invalid email").should("be.visible");
  });
});

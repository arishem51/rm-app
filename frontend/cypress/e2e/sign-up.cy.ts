describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/auth/sign-up");
    cy.get("input[name=phoneNumber]").type("0383906223");
    cy.get("input[name=name]").type("Phùng Văn Hưng");
    cy.get("input[name=email]").type("abc123@gmail.com");
    cy.get("input[name=username]").type("danganh123");
    cy.get("input[name=password]").type("danganh123");
    cy.get("input[name=confirmPassword]").type("danganh123");
    cy.get("button[type=submit]").should("be.disabled");

    //FAKE to bypass reCAPTCHA
    cy.get("button[type=submit]").then((button) => {
      button[0].removeAttribute("disabled");
    });

    cy.get("button[type=submit]").should("not.be.disabled");

    cy.get("button[type=submit]").click();
  });
});

describe("template spec", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/auth/sign-in",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "danganh",
        password: "danganh",
        reCaptchaToken: "123",
      }),
    }).then(async (response) => {
      const token = response.body.data.token;
      cy.setCookie("token", token);
    });
    cy.wait(3000);
    cy.visit("http://localhost:3000/dashboard/partners");
    cy.wait(500);
    cy.contains("span", "Create Partner").click();
  });

  it("tạo đối tác thành công", () => {
    cy.get('input[name="name"]').type("Công ty TNHH ABC");
    cy.get('input[name="contactName"]').type("Nguyễn Duy Khánh");
    cy.get('input[name="phone"]').type("0866898119");
    cy.get('input[name="email"]').type("abc@gmail.com");
    cy.get('input[name="address"]').type("Số 123, Đường ABC, Quận XYZ, TP.HCM");
    cy.get('input[name="website"]').type("https://www.abc.com");
    cy.get('input[name="description"]').type(
      "Chúng tôi chuyên cung cấp các sản phẩm công nghệ chất lượng cao."
    );
    cy.contains('button[type="submit"]', "Create Partner").click();
    cy.wait(1000);
    cy.contains("Partner created successfully!").should("be.visible");
    cy.wait(1000);
  });
});

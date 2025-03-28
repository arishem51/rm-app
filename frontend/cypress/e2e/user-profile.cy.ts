describe("Profile Update Test", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/auth/sign-in",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "danganh123",
        password: "new123",
        reCaptchaToken: "123",
      }),
    }).then(async (response) => {
      const token = response.body.data.token;
      cy.setCookie("token", token);
    });
    cy.wait(3000);
    cy.visit("http://localhost:3000/dashboard/setting/profile");
  });

  it("Cho phép user cập nhật thông tin khi cung cấp đủ thông tin", () => {
    cy.get('input[name="name"]').clear().type("Kiên Nguyễn");
    cy.get('input[name="phoneNumber"]').clear().type("0866898119");
    cy.contains("Lưu thay đổi").click();
    cy.wait(1000);
    cy.contains("Update account successfully").should("be.visible");
    cy.wait(1000);
  });

  it("Nhập sai số điện thoại và thông báo lỗi cho người dùng", () => {
    cy.get('input[name="phoneNumber"]').clear().type("123");

    cy.contains("Lưu thay đổi").click();
    cy.contains("Số điện thoại phải dài từ 10-12 chữ số").should("be.visible");
  });
});

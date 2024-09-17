context("POST /api/auth/signin", () => {
  it("auth a user", () => {
    cy.request({
      method: "POST",
      url: "/api/auth/signin",
      form: true,
      body: {
        email: "johndoe@example.com",
        password: "12345678"
      }
    }).then(response => {
      expect(response.status).to.eq(200)
    })
  })
})

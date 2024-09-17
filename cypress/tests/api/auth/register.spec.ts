context("POST /api/users", () => {
  it("creates a new user", () => {
    cy.request({
      method: "POST",
      url: "/api/users",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        firstName: "john",
        lastName: "doe",
        email: "johndoe@example.com",
        password: "12345678",
        confirmPassword: "12345678",
        educationalLevel: "Self-Taught",
        favoriteProgrammingLanguage: "COBOL",
        desiredJobPosition: "Help Desk Technician",
        desiredSectors: ["Healthcare"]
      }
    }).then(response => {
      expect(response.status).to.eq(201)
    })
  })
})

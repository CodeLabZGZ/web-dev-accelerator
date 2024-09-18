context("POST /api/auth/signin", () => {
  let tmpId
  before(() => {
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
      tmpId = response.body.data.id
    })
  })

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

  after(() => {
    if (tmpId) {
      //cleanup
      cy.request({
        method: "DELETE",
        url: `/api/users?id=${tmpId}`,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    }
  })
})

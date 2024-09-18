context("/api/users", () => {
  // This context executes the tests referring to the creation of users
  context("POST /api/users", () => {
    let tmpId
    // Here, we create a test where a new user is created
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
        tmpId = response.body.data.id
      })
    })

    // Here, we create a test where a user tries to use an email already in use.
    // Since the email must be unique (check db/schemas/users.ts), the request
    // should fail and return 409.
    it("returns error if email is already in", () => {
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
          password: "abcdef",
          confirmPassword: "abcdef",
          educationalLevel: "Self-Taught",
          favoriteProgrammingLanguage: "COBOL",
          desiredJobPosition: "Help Desk Technician",
          desiredSectors: ["Healthcare"]
        },
        // We don't want the test to automatically fail if the status is not 2xx or 3xx
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(409)
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

  // This context executes the tests referring to user deletion
  context("DELETE /api/users", () => {
    // Here, we create a dummy user before the tests are executed
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

    it("deletes a user", () => {
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

    /**
     * This test is failing! Your task is to add the necessary logic to the DELETE
     * route handler so that this test passes.
     */
    it("returns error if user doesn't exist", () => {
      if (tmpId) {
        //cleanup
        cy.request({
          method: "DELETE",
          url: `/api/users?id=${tmpId}`,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => {
          expect(response.status).to.eq(409)
        })
      }
    })
  })
})

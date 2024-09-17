context("GET /projects", () => {
  it("gets a list of projects", () => {
    cy.request({
      method: "GET",
      url: "/api/projects"
    }).then(response => {
      expect(response.status).to.eq(200)
    })
  })
})

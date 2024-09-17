context("POST /projects", () => {
  it("creates a new projects", () => {
    cy.request({
      method: "POST",
      url: "/api/projects",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        offer: "Best Offer",
        company: "johndoe's company",
        tags: ["Full Stack Developer"],
        location: "remote",
        link: "https://codelabzgz.dev",
        minSalary: 20000,
        maxSalary: 30000,
        stickingTime: "No sticky" // "No sticky", "24 hours", "7 days", "14 days", "30 days"
      }
    }).then(response => {
      expect(response.status).to.eq(201)
    })
  })
})

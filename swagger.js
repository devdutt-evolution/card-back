const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quotes Backend",
      description: "API endpoints for a Quote demo website",
      contact: {
        name: "Devdutt",
        email: "devdutt.c@evolutioncloud.in",
        url: "https://github.com/devdutt-evolution",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001/",
        description: "Local server",
      },
      {
        url: "https://card-demo-bl6n.onrender.com/",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./swagger/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
module.exports = swaggerDocs;

// index.js
const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const guardRoutes = require("./routes/guardRoutes");
const app = express();

app.use(express.urlencoded({ extended: true }));

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Đường dẫn tới các file chứa các routes API
};
const specs = swaggerJsdoc(options);

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/customer", customerRoutes);
app.use("/guard", guardRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  require("child_process").exec("start http://localhost:3000/api-docs");
});

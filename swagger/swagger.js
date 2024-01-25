const swaggerAutogen = require("swagger-autogen");
const reqDTO = require("./reqDTO");
const resDTO = require("./resDTO");

const doc = {
  info: {
    title: "API 문서",
    version: "1.0.0",
  },
  basePath: "/api",
  host: "",
  "@definitions": { ...reqDTO, ...resDTO },
};
const outputFile = "../docs/swagger.json";
const routes = ["../app/api/service/tx.srv.ts"];
swaggerAutogen()(outputFile, routes, doc);

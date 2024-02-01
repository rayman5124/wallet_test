import express, { Express, Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../../docs/swagger.json";
import cors from "cors";
import { handleError } from "./errHandler";
import { logger } from "../common/logger";

export class Server {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    // this.app.use(morganMiddleWare);
  }

  public groupRoute(pathPrefix: string): Router {
    const router = express.Router();
    this.app.use(pathPrefix, router);
    return router;
  }

  public start(port: number) {
    this.app.use(handleError);
    this.app.listen(port, () => {
      logger.info(`listening at ${port}`);
    });
  }
}

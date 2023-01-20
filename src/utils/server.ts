import config from "config";

import connect from "../utils/connect";
import logger from "../utils/logger";
import routes from "../routes";
import swaggerDocs from "../utils/swagger";
import { startMetricsServer } from "./metrics";

import app from "../app";

const port = config.get<number>("port");

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  startMetricsServer();

  swaggerDocs(app, port);
});

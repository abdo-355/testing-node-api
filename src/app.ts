import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import responseTime from "response-time";
import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram } from "./utils/metrics";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(deserializeUser);

routes(app);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

export default app;

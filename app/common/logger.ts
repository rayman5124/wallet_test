import winston from "winston";
import morgan, { token } from "morgan";
import { IncomingMessage, ServerResponse } from "http";

const { combine, timestamp, label, printf } = winston.format;

const logFormat = combine(
  timestamp(),
  label({ label: "api" }),
  printf((info): string => {
    return JSON.stringify({
      level: info.level,
      time: info.timestamp,
      message: info.message,
      ErrorStack: info.stack,
    });
  })
);

const transports = [
  new winston.transports.Console({
    handleExceptions: true,
    format: combine(timestamp()),
  }),
];

export const logger = winston.createLogger({
  format: logFormat,
  transports,
});

// export const morganMiddleWare = morgan((tokens, req, res) => {
//   logger.info(tokens);
//   return null;
// });

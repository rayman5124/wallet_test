import winston from "winston";
import morgan from "morgan";
import { IncomingMessage, ServerResponse } from "http";

const { combine, timestamp, label, printf } = winston.format;

const logFormat = combine(
  timestamp(),
  label({ label: "api" }),
  printf((info): string => {
    if (info.stack)
      return `[${info.level}] time: ${info.timestamp}] message: ${info.message}\n ErrorStack: ${info.stack}`;
    return `[${info.level}] time: ${info.timestamp}] message: ${info.message}`;
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

const stream = { write: (message: any) => logger.http(message) };
const skip = () => (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  //   return res.statusCode < 400 ? true : false;
  return false;
};

export const morganMiddleWare = morgan("combine", {
  stream,
  ...skip,
});

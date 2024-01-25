import { NextFunction, Request, Response } from "express";

export function handleError(error: Error, req: Request, res: Response, next: NextFunction) {
  console.log(`${error.message}\n`);
  res.status(500).json({
    message: "failed",
  });
}

export function asyncErrorCatcher(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

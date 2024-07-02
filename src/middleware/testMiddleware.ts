import { Request, Response, NextFunction } from "express";

const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("testMiddleware is working");
  next();
};

export default testMiddleware;

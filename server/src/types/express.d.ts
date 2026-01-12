import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

declare namespace Express {
  interface Request {
    userId?: string;
    file?: Express.Multer.File;
  }
}
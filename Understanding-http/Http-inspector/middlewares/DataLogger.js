import { randomUUID } from "crypto";

export const DataLogger = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();

  res.setHeader("X-Request-ID", req.id);

  console.log(`${req.method} , ${req.url} , ${new Date()}, ${req.headers}, ${req.id}`);

  next();
};

import rateLimit from "express-rate-limit";

export const limiter = (minutes, maxRequests) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    message: `Too many requests, please try again after ${minutes} minute(s).`,
    handler: (req, res) => {
      res.status(429).json({
        status: "fail",
        message: `Too many requests, please try again after ${minutes} minute(s).`,
      });
    },
  });
};

export default limiter;

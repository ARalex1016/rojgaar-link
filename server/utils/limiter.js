import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum number of requests per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: "Too many requests, please try again later.",
});

export const sensitiveRateLimiter = ({ max15Minutes, maxWeekly }) => {
  const limit15Minutes = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: max15Minutes,
    message: (req, res) => ({
      message: `You have reached the limit of ${max15Minutes} actions in 15 minutes. Please try again later.`,
    }),
    handler: (req, res, next, options) => {
      const retryAfterSeconds = Math.ceil(res.getHeader("Retry-After")); // Time in seconds

      const minutes = Math.floor(retryAfterSeconds / 60); // Whole minutes
      const seconds = retryAfterSeconds % 60; // Remaining seconds

      res.status(429).json({
        error: true,
        message: `Rate limit exceeded. Try again in  ${minutes} minute${
          minutes !== 1 ? "s" : ""
        } and ${seconds} second${seconds !== 1 ? "s" : ""}.`,
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const limitWeekly = rateLimit({
    windowMs: 7 * 24 * 60 * 60 * 1000, // 1 week
    max: maxWeekly,
    message: (req, res) => ({
      message: `You have reached the limit of ${maxWeekly} actions this week.`,
    }),
    handler: (req, res, next, options) => {
      const retryAfterSeconds = Math.ceil(res.getHeader("Retry-After")); // Time in

      const days = Math.floor(retryAfterSeconds / (60 * 60 * 24)); // Whole days
      const hours = Math.floor(
        (retryAfterSeconds % (60 * 60 * 24)) / (60 * 60)
      ); // Remaining hours

      res.status(429).json({
        error: true,
        message: `Weekly rate limit exceeded. Try again in ${days} day${
          days !== 1 ? "s" : ""
        } and ${hours} hour${hours !== 1 ? "s" : ""}.`,
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return [limit15Minutes, limitWeekly];
};

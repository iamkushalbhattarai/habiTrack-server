import { isDevelopment } from "../config/index.js";
import { Log } from "../models/index.js";
import ipHelper from "./helpers/ip-helper.js";

export default async (code, userId, errorMessage, level, req) => {
  let ip = "no-ip";
  if (req !== "") ip = ipHelper(req);
  let log = new Log({
    resultCode: code,
    level: level,
    errorMessage: errorMessage,
    ip: ip,
  });

  if (userId !== "" && userId) log.userId = userId;
  if (isDevelopment) console.log(`${level}: ${errorMessage}`);

  await log.save().catch((err) => {
    console.log("Logging is failed: " + err);
  });
};

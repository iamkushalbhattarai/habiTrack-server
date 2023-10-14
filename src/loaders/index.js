import mongooseLoader from "./mongoose.js";
import expressLoader from "./express.js";

// support for utcOffset method
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";

dayjs.extend(utc);
dayjs.extend(weekOfYear);

export default async (app) => {
  await mongooseLoader();
  expressLoader(app);
};

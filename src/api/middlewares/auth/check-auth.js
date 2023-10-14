import { User, Token } from "../../../models/index.js";
import { errorHelper } from "../../../utils/index.js";
import { jwtSecretKey } from "../../../config/index.js";
import pkg from "mongoose";
const { Types } = pkg;
import jwt from "jsonwebtoken";
const { verify } = jwt;

export default async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json(errorHelper("00006", req));

  if (token.includes("Bearer"))
    token = req.header("Authorization").replace("Bearer ", "");

  try {
    const { userId, tokenId } = verify(token, jwtSecretKey);

    if (!Types.ObjectId.isValid(userId))
      return res.status(400).json(errorHelper("00007", req));

    const exists = await User.exists({
      _id: userId,
      // isVerified: true, // are these really necessary?
      isActivated: true, // are these really necessary?
    }).catch((err) => {
      return res.status(500).json(errorHelper("00008", req, err.message));
    });

    if (!exists) return res.status(400).json(errorHelper("00009", req));
    // set the user in the request object which is then accessible in the endpoints
    req.user = await User.findById(userId);

    const tokenExists = await Token.exists({
      _id: tokenId,
      userId: req.user._id,
      expiresIn: {
        $gte: Date.now(),
      },
    }).catch((err) => {
      return res.status(500).json(errorHelper("00010", req, err.message));
    });

    if (!tokenExists) return res.status(401).json(errorHelper("00011", req));

    next();
  } catch (err) {
    console.log("There was an error within the auth middleware", err);
    return res.status(401).json(errorHelper("00012", req, err.message));
  }
};

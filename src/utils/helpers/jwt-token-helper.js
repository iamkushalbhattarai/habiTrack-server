import pkg from "jsonwebtoken";
const { sign } = pkg;
import { jwtSecretKey, refreshTokenSecretKey } from "../../config/index.js";

export function signAccessToken(userId, tokenId) {
  const accessToken = sign({ userId, tokenId }, jwtSecretKey, {});
  return accessToken;
}
export function signRefreshToken(userId) {
  const refreshToken = sign({ _id: userId }, refreshTokenSecretKey, {
    expiresIn: "7d",
  });
  return refreshToken;
}
export function signConfirmCodeToken(userId, confirmCode) {
  const confirmCodeToken = sign(
    { _id: userId, code: confirmCode },
    jwtSecretKey
  );
  return confirmCodeToken;
}

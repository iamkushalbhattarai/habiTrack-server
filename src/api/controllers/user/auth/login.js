// TODO : revisit the tokens

import { User, Token } from "../../../../models/index.js";
import { validateLogin } from "../../../validators/user.validator.js";
import {
  errorHelper,
  getText,
  logger,
  signAccessToken,
  signRefreshToken,
} from "../../../../utils/index.js";
import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export default async (req, res) => {
  try {
    // validate the login request body
    const { error } = validateLogin(req.body);
    if (error) {
      let code = "00038";
      if (error.details[0].message.includes("email")) code = "00039";
      else if (error.details[0].message.includes("password")) code = "00040";

      return res
        .status(400)
        .json(errorHelper(code, req, error.details[0].message));
    }
    // --------------

    // verify whether the login credentials match

    // the '+password' will ensure the password field is being fetched from the database
    // this is required since password has been excluded from the fields that are being fetched by default
    const user = await User.findOne({
      email: req.body.email,
      isActivated: true,
    })
      .select("+password")
      .catch((err) => {
        return res.status(500).json(errorHelper("00041", req, err.message));
      });

    if (!user) return res.status(404).json(errorHelper("00042", req));

    if (!user.isActivated)
      return res.status(400).json(errorHelper("00043", req));

    const match = await compare(req.body.password, user.password);
    if (!match) return res.status(400).json(errorHelper("00045", req));
    // ------------------

    // create a new token for each login
    const token = new Token({
      userId: user._id,
      expiresIn: Date.now() + 604800000,
      // createdAt: Date.now(),
    });
    await token.save().catch((err) => {
      return res.status(500).json(errorHelper("00046", req, err.message));
    });

    // generate the JWT token
    const accessToken = signAccessToken(user._id, token._id);

    logger("00047", user._id, getText("en", "00047"), "Info", req);
    return res.status(200).json({
      resultMessage: { en: getText("en", "00047") },
      resultCode: "00047",
      user,
      accessToken,
    });
  } catch (error) {
    res.status(500).json(errorHelper("00300", req, error.message));
  }
};

/**
 * @swagger
 * /user/login:
 *    post:
 *      summary: Login
 *      requestBody:
 *        description: Email and password information to login
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: You logged in successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please provide all the required fields!
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */

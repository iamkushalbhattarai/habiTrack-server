// TODO : Add logs using the logger util
// TODO : Move the email auth credentials to the env variables
// TODO : Migrate the gmail for email sending using OAuth2

import getText from "./lang/get-text.js";
import errorHelper from "./helpers/error-helper.js";
import logger from "./logger.js";
import { createTransport } from "nodemailer";

export default async (
  email,
  name,
  confirmCode,
  lang = "en",
  type,
  req,
  res
) => {
  // The promise is not being returned since there is not requirement for the
  // response to wait till the verification email is sent (verify???)
  new Promise(async (resolve, reject) => {
    if (!email || !confirmCode) {
      return res.status(400).send(errorHelper("00005", req)).end();
    }

    const transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ernestine.bogan15@ethereal.email",
        pass: "RmNJDEJSaJQvHZVGfH",
      },
    });

    let body = "";
    //NOTE: You can customize the message that will be sent to the newly registered users according to your pleasure.
    if (type == "register") {
      body = `${getText(lang, "welcomeCode")} ${name}!\r\n\r\n${getText(
        lang,
        "verificationCodeBody"
      )} ${confirmCode}`;
    } else {
      body = `${getText(lang, "verificationCodeBody")} ${confirmCode}`;
    }

    // sgMail.setApiKey(sendGridSecretKey);
    const msg = {
      to: email, // Change to your recipient
      from: "Osura Hettiarachchi <ernestine.bogan15@ethereal.email>", // Change to your verified sender
      subject: getText(lang, "verificationCodeTitle"),
      text: body,
    };

    try {
      // const test = await sgMail.send(msg);
      transporter
        .sendMail(msg)
        .then((info) => {
          console.log("Successfully sent the email to:", info);
          return resolve("Success");
        })
        .catch((err) => {
          console.log("There was an error sending the mail", err, msg);
          return reject(err);
        });
      console.log("Async Successfully sent the email to:", msg.to, msg.from);
    } catch (err) {
      console.log("There was an error", err);
    }
  });
};

// https://www.npmjs.com/package/zeptomail

// For ES6
import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTOMAIL_API_KEY || "";

export const sendEmail = async (
  emailTo: string,
  nameTo: string,
  emailSubject: string,
  emailBody: string
) => {
  let client = new SendMailClient({ url, token });

 await client.sendMail({
    from: {
      address: "hello@swaptalk.io",
      name: "Swaptalk Team",
    },
    to: [
      {
        email_address: {
          address: emailTo,
          name: nameTo,
        },
      },
    ],
    subject: emailSubject,
    htmlbody: emailBody,
  });
};

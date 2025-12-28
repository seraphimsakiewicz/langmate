// https://www.npmjs.com/package/zeptomail

// For ES6
import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTOMAIL_API_KEY || "";

export const sendEmail = async () => {
  let client = new SendMailClient({ url, token });

  const res = await client.sendMail({
    from: {
      address: "hello@swaptalk.io",
      name: "noreply",
    },
    to: [
      {
        email_address: {
          // this needs to be dynamic
          /* address: "hello@swaptalk.io",
          name: "Hello", */
        },
      },
    ],
    // will leave this for now.
    subject: "Test Email",
    htmlbody: "<div><b> Test email sent successfully.</b></div>",
  });
};

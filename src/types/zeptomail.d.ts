declare module "zeptomail" {
  import { SendMailClient as _SendMailClient } from "zeptomail/lib/js/types/sendmail/sendMail";
  import { ClientParams, Sendmail } from "zeptomail/lib/js/types/types";
  
  export { _SendMailClient as SendMailClient, ClientParams, Sendmail };
}

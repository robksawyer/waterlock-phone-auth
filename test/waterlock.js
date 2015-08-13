
/**
 * waterlock
 *
 * defines various options used by waterlock
 * for more informaiton checkout
 *
 * http://waterlock.ninja/documentation
 */
module.exports.waterlock = {

  // Base URL
  //
  // used by auth methods for callback URI's using oauth and for password
  // reset links.
  baseUrl: "http://localhost:1337",

  // Auth Method(s)
  //
  // this can be a single string, an object, or an array of objects for your
  // chosen auth method(s) you will need to see the individual module's README
  // file for more information on the attributes necessary. This is an example
  // of the local authentication method with password reset tokens disabled.
  authMethod: [
    {
      name:"waterlock-phone-auth",
      authReset:{
        tokens: false,
        phone: {
          options:{
            service: "twilio",
            auth: {
              sid: "SOME_TWILIO_ACCOUNT_SID",
              token: "SOME_TWILIO_TOKEN"
            }
          }
        },
      //   template:{
      //     file: "../views/phone.jade",
      //     vars:{}
      //   }
      }
    }
  ],

  // JSON Web Tokens
  //
  // this provides waterlock with basic information to build your tokens,
  // these tokens are used for authentication, password reset,
  // and anything else you can imagine
  jsonWebTokens:{

    // CHANGE THIS SECRET
    secret: "this is my secret",
    expiry:{
      unit: "days",
      length: "7"
    },
    audience: "app name",
    subject: "subject"
  }
}

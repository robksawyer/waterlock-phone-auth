# Waterlock Phone Auth
> WARNING: Not Yet Functional

[![Build Status](http://img.shields.io/travis/waterlock/waterlock-phone-auth.svg?style=flat)](https://travis-ci.org/waterlock/waterlock-phone-auth) [![NPM version](http://img.shields.io/npm/v/waterlock-phone-auth.svg?style=flat)](http://badge.fury.io/js/waterlock-phone-auth)

waterlock-phone-auth is a module for [waterlock](http://waterlock.ninja/)
providing a phone authentication method for users based on their phone number.

## Usage

```bash
npm install waterlock-phone-auth
```

set the following option in your `waterlock.js` config file

```js
authMethod:[
	{
		name: "waterlock-phone-auth",
		passwordReset: {
			tokens: boolean, // object containing information regarding password resets

			// object containing information about your smtp server, see nodemailer
			mail: {
				options: string, // how it uses the transport method, see nodemailer
				from: string, // the from address
				subject: string, // the email subject for password reset emails
				forwardUrl: string // the url to send the user to after they have clicked the password reset link in their inbox (e.g. a form on your site which POST to `/auth/reset`)
			},

			// object containing template information for the reset emails
			template:{
				file: string, // the relative path to the `jade` template for the reset emails
				vars: object, // object containing any vars you want passed to the template for rendering
			}
		},
		createOnNotFound: boolean // should local auth try to create the user on a failed login attempt, good if you do not want to implement a registration form.
	}
]
```

## Auth Model
Phone auth adds the following attributes onto the Auth model

```js
  phone: {
    type: 'STRING',
    unique: true
  },
  carrier: {
    type: 'STRING'
  },
  resetToken: {
    model: 'resetToken'
  }
```
with the way waterlock is designed and this model you can override any of these attributes, also if you want to use a username instead of an email address you can drop in the `username` attribute which is a signification key causing local auth to use that to authenticate.

## Password reset
Waterlock Phone Auth uses [Twilio](http://www.twilio.com/) to send password reset notifications. The options in the config file are applied to [Twilio](http://twilio.github.io/) as such
```js
var account_id = config.authReset.phone.options.auth.sid;
var auth_token = config.authReset.phone.options.auth.token;
var client = require('twilio')(account_id, auth_token);
//Send an SMS text message
client.sendMessage({

    to:'+16515556677', // Any number Twilio can deliver to
    from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    }
});

//Place a phone call, and respond with TwiML instructions from the given URL
client.makeCall({

    to:'+16515556677', // Any number Twilio can call
    from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
    url: 'http://www.example.com/twiml.php' // A URL that produces an XML document (TwiML) which contains instructions for the call

}, function(err, responseData) {

    //executed when the call has been initiated.
    console.log(responseData.from); // outputs "+14506667788"

});
```

if you choose to go with this option then a user upon visiting the url `/auth/reset` with a post param of `phone` will receive a phone text message to the phone number with the reset url. This token upon entered into the site input field will be validated against the server to ensure it's still within the time window allotted for a password reset. If so will set the `resetToken` session variable. After this if you have set a `forwardUrl` in your `waterlock.js` config file the user will be forwarded to this page.

If you want to take advantage of the built in reset itself have the page you sent your user to above `POST` to `/auth/reset` with the post param of `password` If all is well a password reset will be issued.

## Template
You can customize the email template used in the password reset via the template file defined in `config/waterlock.js` this template file is rendered with the fun and dynamic `jade` markup, the view var `url` is generated and passed to it when a user requests and password reset. You can customize this template to your liking and pass any other view vars you wish to it via the `vars` options in the js file.

Your user can simply try to login to `/login` if the user is not found one will be created using [waterlines](https://github.com/balderdashy/waterline) `findOrCreate` method

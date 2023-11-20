import Joi from "@hapi/joi";
import "dotenv/config";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGO_URL: Joi.string().required().description("Mongo DB url"),
    RESEND: Joi.string().required().description("Resend API"),
    // SMTP_HOST: Joi.string().description("server that will send the emails"),
    // SMTP_PORT: Joi.number().description("port to connect to the email server"),
    // SMTP_USERNAME: Joi.string().description("username for email server"),
    // SMTP_PASSWORD: Joi.string().description("password for email server"),
    // EMAIL_FROM: Joi.string().description(
    //   "the from field in the emails sent by the app"
    // ),
    // CLIENT_URL: Joi.string().required().description("Client url"),
    ABLY_API_KEY: Joi.string().required().description("ably url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  clientUrl: envVars.CLIENT_URL,
  ablyUrl: envVars.ABLY_API_KEY,
  resend: envVars.RESEND,
};

export default config;

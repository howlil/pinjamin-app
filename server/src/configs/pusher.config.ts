import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable "${key}" is missing`);
  }
  return value;
}

export const pusher = new Pusher({
  appId: getRequiredEnv("PUSHER_APP_ID"),
  key: getRequiredEnv("PUSHER_KEY"),
  secret: getRequiredEnv("PUSHER_SECRET"),
  cluster: getRequiredEnv("PUSHER_CLUSTER"),
  useTLS: true,
});

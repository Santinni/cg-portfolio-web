import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";

interface CachedPayload {
  client: Payload | null;
  promise: Promise<Payload> | null;
}

let cached = (global as { payload?: CachedPayload }).payload;

if (!cached) {
  cached = (global as { payload?: CachedPayload }).payload = {
    client: null,
    promise: null,
  };
}

export const getPayloadClient = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is required");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = getPayload({
      config,
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
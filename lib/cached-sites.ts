import { cacheLife, cacheTag } from "next/cache";
import type { Sites } from "./types";
import clientPromise from "./mongodb";

/** Shared site catalog — safe to cache (no cookies/headers). Never cache auth/session here. */
export async function getCachedSites(): Promise<Sites[]> {
  "use cache";
  cacheLife("max");
  cacheTag("sites");

  const client = await clientPromise;
  const db = client.db();
  const sites = await db.collection("sites").find({}).toArray();
  return sites.map(({ _id, ...site }) => site) as Sites[];
}

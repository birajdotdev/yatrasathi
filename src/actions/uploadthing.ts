"use server";

import { utapi } from "@/server/uploadthing";

export async function deleteFiles(fileKeys: string[]) {
  await utapi.deleteFiles(fileKeys);
}

"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteFiles(fileKeys: string[]) {
  await utapi.deleteFiles(fileKeys);
}

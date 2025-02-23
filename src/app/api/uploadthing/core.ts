/* eslint-disable @typescript-eslint/only-throw-error */
import { getAuth } from "@clerk/nextjs/server";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId, sessionClaims } = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!userId) {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "You must be logged in to upload",
        });
      }

      if (!sessionClaims?.dbId || !sessionClaims?.role) {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Your session is missing required claims (dbId and role)",
        });
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, dbId: sessionClaims.dbId, role: sessionClaims.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.dbId, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

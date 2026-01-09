import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";

export async function POST(request: Request) {
  // Single auth check
  const token = await getToken();
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type (images only for now)
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: "File type not allowed. Only images are supported." },
      { status: 400 }
    );
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return Response.json(
      { error: "File too large. Max size is 5MB." },
      { status: 400 }
    );
  }

  // Get upload URL from Convex
  const uploadUrl = await fetchMutation(
    api.files.generateUploadUrl,
    {},
    { token }
  );

  // Upload file to Convex
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { storageId } = (await uploadResponse.json()) as {
    storageId: Id<"_storage">;
  };

  // Get the file URL
  const url = await fetchQuery(api.files.getUrl, { storageId }, { token });

  if (!url) {
    return Response.json({ error: "Failed to get file URL" }, { status: 500 });
  }

  return Response.json({
    url,
    pathname: file.name,
    contentType: file.type,
  });
}

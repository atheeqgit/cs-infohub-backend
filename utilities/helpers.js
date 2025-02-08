import { deleteFromCloudinary } from "./deleteCloudFiles.js";

export const getBodyWithFiles = (req) => {
  const cloudFilesLinks = req.cloudinaryFiles;
  let uploadedFiles = {};

  if (cloudFilesLinks?.length > 0) {
    cloudFilesLinks.forEach((fileData) => {
      uploadedFiles[fileData.fieldName] = {
        url: fileData.url,
        public_id: fileData.public_id,
      };
    });
  }

  return { ...req.body, ...uploadedFiles };
};

export const getUpdatedBodyWithFiles = async (req, existedData) => {
  let body = { ...req.body }; // Copy request body
  const cloudFilesLinks = req.cloudinaryFiles || [];

  if (cloudFilesLinks.length > 0) {
    for (const newFile of cloudFilesLinks) {
      const fieldName = newFile.fieldName;

      // Delete old file from Cloudinary if it exists
      if (existedData?.[fieldName]?.public_id) {
        await deleteFromCloudinary(existedData[fieldName].public_id);
      }

      // Update the new file in the request body
      body[fieldName] = {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }
  }

  return body;
};

export const deleteCloudFiles = async (fieldNames, existedData) => {
  for (const fieldName of fieldNames) {
    let fileData = existedData?.[fieldName]; // Avoid errors if field doesn't exist
    let pID = fileData?.public_id;

    if (pID) {
      await deleteFromCloudinary(pID);
    }
  }
};

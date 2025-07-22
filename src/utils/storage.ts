import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

let s3Client: any;
interface S3ClientOption {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

const initializeS3Client = () => {
  if (s3Client) return;
  const s3ClientOption: S3ClientOption = {
    region: process.env.STORAGE_REGION!,
    endpoint: process.env.STORAGE_ENDPOINT_URL!,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  };
  s3Client = new S3Client(s3ClientOption);
};

interface FileMeta {
  buffer: any;
  mimetype: string;
  originalname: string;
  path: string;
}
export const getFileUrl = async (file: FileMeta, bucketName: string) => {
  if (process.env.MODE !== "OPS") {
    return file.path;
  }

  // initialize S3 client
  initializeS3Client();

  // generate unique file name
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${
    file.originalname.split(".")[0]
  }-${uuidv4()}.${fileExtension}`;

  // set upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  // upload file to object storage
  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  // set public download url to uploaded file
  // set signed URL if using a private bucket
  const fileUrl = `${
    bucketName === "video"
      ? process.env.STORAGE_DOWNLOAD_URL_VIDEO
      : process.env.STORAGE_DOWNLOAD_URL_IMAGE
  }/${fileName}`;
  return fileUrl;
};

export const removeFile = async (fileName: string, bucketName: string) => {
  try {
    // set delete parameters
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    // delete file from object storage
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("removeFile", error);
    return false;
  }
};

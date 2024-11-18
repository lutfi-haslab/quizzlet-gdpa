import type { MessageContent } from "@langchain/core/messages";

interface Context {
  content: string;
  metadata: Record<string, any>;
}

export interface ChatResponse {
  answer: MessageContent;
  source: string;
  context: Context[];
}

export interface Vector {
  id: number;
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  id?: string;
  docId?: string;
  source?: string;
  fileName?: string;
  originalName?: string;
  page?: number;
  bookName?: string;
  fileSize: number;
  uploadDate: string;
  storagePath: string;
  created_at?: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "processing" | "completed" | "failed";
}

export interface Bucket {
  id: string;
  name: string;
  owner: string;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  created_at: string;
  updated_at: string;
  public: boolean;
}

interface FileMetadata {
  eTag: string;
  size: number;
  mimetype: string;
  cacheControl: string;
  lastModified: string;
  contentLength: number;
  httpStatusCode: number;
}

export type Document = {
  id?: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  storagePath: string;
  created_at: string;
};

export type FileObject = {
  name: string;
  id?: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
};

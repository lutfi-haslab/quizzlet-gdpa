"use server";
import getServerClient from "@/utils/supabase/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatResponse,
  DocumentMetadata,
  FileObject,
  Vector,
} from "../(model)/document";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

export async function uploadToSupabase(
  file: Buffer,
  fileName: string
): Promise<string> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(`uploads/${fileName}`, file);
  if (error) throw error;
  return data.path;
}

export async function storeFileMetadata(
  metadata: DocumentMetadata
): Promise<void | string> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("document_metadata")
    .insert([metadata])
    .select("id");
  if (data) {
    console.log("Inserted ID:", data[0].id);
    return data[0].id;
  }
  if (error) throw error;
}

export async function getFileFromSupabase(path: string): Promise<Buffer> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .download(path);
  if (error) throw error;
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function processDocument(
  storagePath: string,
  originalName: string,
  docId: string
): Promise<void> {
  const supabase = await getServerClient();
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase as any,
    tableName: "documents",
    queryName: "match_documents",
  });
  try {
    const fileBuffer = await getFileFromSupabase(storagePath);
    const blob = new Blob([fileBuffer], { type: "application/pdf" });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    const documents = splitDocs.map((doc, index) => ({
      pageContent: doc.pageContent,
      metadata: {
        docId,
        source: originalName,
        page: index + 1,
        bookName: originalName,
        fileSize: fileBuffer.length,
        uploadDate: new Date().toISOString(),
        storagePath,
      } as DocumentMetadata,
    }));

    await vectorStore.addDocuments(documents);
  } catch (error: any) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

export async function uploadDocument(
  file: Buffer,
  originalName: string
): Promise<string> {
  try {
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}-${originalName}`;
    const storagePath = await uploadToSupabase(file, originalName);

    const metadata = {
      fileName,
      originalName,
      fileSize: file.length,
      uploadDate: new Date().toISOString(),
      storagePath,
    };
    const docId = await storeFileMetadata(metadata);

    await processDocument(storagePath, originalName, docId as string);

    return fileName;
  } catch (error: any) {
    console.error("Error uploading document:", error);
    throw new Error(
      JSON.stringify({
        error: "Failed to upload document" || error?.error,
        message: error?.message || "",
      })
    );
  }
}

export async function listDocuments(): Promise<DocumentMetadata[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("document_metadata")
    .select("*")
    .order("uploadDate", { ascending: false });
  if (error) {
    console.log("Error listing documents:", JSON.stringify(error));
    throw error;
  }
  return data;
}

export async function listVectors(
  start: string,
  end: string
): Promise<{ data: Vector[]; totalSize: number | null }> {
  const supabase = await getServerClient();
  const { data, error, count } = await supabase
    .from("documents")
    .select("id, content, metadata", { count: "exact" })
    .range(Number(start), Number(end));
  const totalSize = count;
  if (error) {
    console.log("Error listing vectors:", JSON.stringify(error));
    throw error;
  }
  return { totalSize, data };
}

export async function listFiles(): Promise<FileObject[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .list("uploads");
  if (error) {
    console.log("Error listing files:", JSON.stringify(error));
    throw new Error("Failed to list files: " + JSON.stringify(error));
  }
  return data.map((file) => ({
    ...file,
    metadata: {
      eTag: file.metadata.eTag || "",
      size: file.metadata.size || 0,
      mimetype: file.metadata.mimetype || "",
      cacheControl: file.metadata.cacheControl || "",
      lastModified: file.metadata.lastModified || "",
      contentLength: file.metadata.contentLength || 0,
      httpStatusCode: file.metadata.httpStatusCode || 0,
    },
  }));
}

export async function removeDocument(originalFileName: string): Promise<void> {
  const supabase = await getServerClient();
  try {
    const { error: metadataError } = await supabase
      .from("document_metadata")
      .delete()
      .eq("originalName", originalFileName);
    if (metadataError) {
      console.error("Error removing document metadata:", metadataError);
      throw new Error("Failed to remove document metadata");
    }
  } catch (error) {
    console.error("Error removing document:", error);
    throw new Error("Failed to remove document");
  }
}

export async function removeFile(fileName: string): Promise<void> {
  const supabase = await getServerClient();
  try {
    const { data, error: storageError } = await supabase.storage
      .from("documents")
      .remove([`uploads/${fileName}`]);
    console.log(JSON.stringify(data));
    if (storageError) {
      console.error("Error removing document from storage:", storageError);
      throw new Error("Failed to remove document from storage");
    }
  } catch (error) {
    console.error("Error removing document:", error);
    throw new Error("Failed to remove document");
  }
}

export async function removeVector(docId: string) {
  const supabase = await getServerClient();
  try {
    const { error: test } = await supabase
      .from("documents")
      .delete()
      .eq("metadata->docId", JSON.stringify(docId));
    console.log("JSONB Remove", test);
  } catch (error) {
    console.error("Error removing vectors:", error);
    throw new Error("Failed to remove vectors");
  }
}

export async function removeDocFileVectors(fileName: string) {
  const supabase = await getServerClient();
  try {
    const { data, error: storageError } = await supabase.storage
      .from("documents")
      .remove([`uploads/${fileName}`]);
    console.log(JSON.stringify(data));
    if (storageError) {
      console.error("Error removing document from storage:", storageError);
      throw new Error("Failed to remove document from storage");
    }

    const { error: metadataError } = await supabase
      .from("document_metadata")
      .delete()
      .eq("originalName", fileName);
    if (metadataError) {
      console.error("Error removing document metadata:", metadataError);
      throw new Error("Failed to remove document metadata");
    }

    const { error: vectorsError } = await supabase
      .from("documents")
      .delete()
      .eq("metadata->source", JSON.stringify(fileName));
    if (vectorsError) {
      console.error("Error removing document vectors:", vectorsError);
      throw new Error("Failed to remove document vectors");
    }
  } catch (error) {
    console.error("Error removing vectors:", error);
    throw new Error("Failed to remove vectors");
  }
}

export async function queryDocument(
  query: string,
  bookName?: string
): Promise<ChatResponse> {
  const supabase = await getServerClient();
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase as any,
    tableName: "documents",
    queryName: "match_documents",
  });
  const searchResults = await vectorStore.similaritySearch(query, 2, {
    bookName,
  });
  const context = searchResults.map((doc) => doc.pageContent).join("\n");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions based on the provided context.",
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${query}`,
      },
    ],
  });

  return {
    answer: completion.choices[0].message.content || "",
    source: searchResults[0]?.metadata?.bookName || "Unknown",
    context: searchResults.map((result) => ({
      content: result.pageContent,
      metadata: result.metadata,
    })),
  };
}

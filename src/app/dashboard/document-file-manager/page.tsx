"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DocumentMetadata,
  FileObject
} from "../(model)/document";
import { listDocuments, listFiles } from "../(service)/document.repository";

export default function page() {
  const [activeTab, setActiveTab] = useState("documents");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<
    DocumentMetadata | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      return await listDocuments();
    },
  });

  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      return await listFiles();
    },
  });

  useEffect(() => {
    console.log("documents", documents);
    console.log("files", files);
  }, [documents, files]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file.name);
    }
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  };

  const openDocumentModal = (document: DocumentMetadata) => {
    setSelectedDocument(document);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openFileModal = (file: FileObject) => {
    setSelectedFile(file);
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const renderDocumentsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Upload Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents?.map((doc) => (
          <TableRow
            key={doc.id}
            onClick={() => openDocumentModal(doc)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <TableCell>{doc.originalName}</TableCell>
            <TableCell>{(doc.fileSize / 1024).toFixed(2)} KB</TableCell>
            <TableCell>{new Date(doc.uploadDate).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderFilesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Last Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files?.map((file) => (
          <TableRow
            key={file.id}
            onClick={() => openFileModal(file)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <TableCell>{file.name}</TableCell>
            <TableCell>{(file.metadata.size / 1024).toFixed(2)} KB</TableCell>
            <TableCell>
              {new Date(file.metadata.lastModified).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderModalContent = () => {
    if (selectedDocument) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">File Name:</span>
              <span className="col-span-3">
                {selectedDocument.originalName}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Size:</span>
              <span className="col-span-3">
                {(selectedDocument.fileSize / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Upload Date:</span>
              <span className="col-span-3">
                {new Date(selectedDocument.uploadDate).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Storage Path:</span>
              <span className="col-span-3">{selectedDocument.storagePath}</span>
            </div>
          </div>
        </>
      );
    } else if (selectedFile) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">File Name:</span>
              <span className="col-span-3">{selectedFile.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Size:</span>
              <span className="col-span-3">
                {(selectedFile.metadata.size / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Last Modified:</span>
              <span className="col-span-3">
                {new Date(selectedFile.metadata.lastModified).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">MIME Type:</span>
              <span className="col-span-3">
                {selectedFile.metadata.mimetype}
              </span>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Document and File Manager</CardTitle>
        <CardDescription>Manage your documents and files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </label>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            {renderDocumentsTable()}
            {renderPagination(documents?.length || 0)}
          </TabsContent>
          <TabsContent value="files">
            {renderFilesTable()}
            {renderPagination(files?.length || 0)}
          </TabsContent>
        </Tabs>
      </CardContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

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
import { UploadIcon } from "lucide-react";
import { useState } from "react";

// Define types based on the provided schemas
type Document = {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  storagePath: string;
  created_at: string;
};

type File = {
  name: string;
  id: string;
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

// Mock data for demonstration
const mockDocuments: Document[] = [
  {
    "id": "4388b9aa-9a91-4b9c-b02f-c02364cee6eb",
    "fileName":
      "7ea5deb4-6b60-431f-a1f2-e24abe7bdd23-ECES-Cards-Module-1-5.pdf",
    "originalName": "ECES-Cards-Module-1-5.pdf",
    "fileSize": 127249,
    "uploadDate": "2024-11-15T08:26:11.417+00:00",
    "storagePath": "uploads/ECES-Cards-Module-1-5.pdf",
    "created_at": "2024-11-15T08:26:11.606053+00:00",
  },
];

const mockFiles: File[] = [
  {
    "name": "ECES-Cards-Module-1-5.pdf",
    "id": "7a1a6b79-d2d0-4839-af51-71493fbc26d3",
    "updated_at": "2024-11-15T08:26:11.087Z",
    "created_at": "2024-11-15T08:26:11.087Z",
    "last_accessed_at": "2024-11-15T08:26:11.087Z",
    "metadata": {
      "eTag": '"e9981cdd8c898862499c1f019348e339"',
      "size": 127249,
      "mimetype": "text/plain;charset=UTF-8",
      "cacheControl": "max-age=3600",
      "lastModified": "2024-11-15T08:26:12.000Z",
      "contentLength": 127249,
      "httpStatusCode": 200,
    },
  },
];

export default function page() {
  const [activeTab, setActiveTab] = useState("documents");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Document | File | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

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

  const openModal = (item: Document | File) => {
    setSelectedItem(item);
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
        {mockDocuments.map((doc) => (
          <TableRow
            key={doc.id}
            onClick={() => openModal(doc)}
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
        {mockFiles.map((file) => (
          <TableRow
            key={file.id}
            onClick={() => openModal(file)}
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
    if (!selectedItem) return null;

    if ("fileName" in selectedItem) {
      // It's a Document
      return (
        <>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">File Name:</span>
              <span className="col-span-3">{selectedItem.originalName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Size:</span>
              <span className="col-span-3">
                {(selectedItem.fileSize / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Upload Date:</span>
              <span className="col-span-3">
                {new Date(selectedItem.uploadDate).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Storage Path:</span>
              <span className="col-span-3">{selectedItem.storagePath}</span>
            </div>
          </div>
        </>
      );
    } else {
      // It's a File
      return (
        <>
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">File Name:</span>
              <span className="col-span-3">{selectedItem.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Size:</span>
              <span className="col-span-3">
                {(selectedItem.metadata.size / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Last Modified:</span>
              <span className="col-span-3">
                {new Date(selectedItem.metadata.lastModified).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">MIME Type:</span>
              <span className="col-span-3">
                {selectedItem.metadata.mimetype}
              </span>
            </div>
          </div>
        </>
      );
    }
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
            {renderPagination(mockDocuments.length)}
          </TabsContent>
          <TabsContent value="files">
            {renderFilesTable()}
            {renderPagination(mockFiles.length)}
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

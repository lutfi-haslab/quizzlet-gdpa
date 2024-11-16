"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for quizzes
const archiveQuizzes = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Live Quiz ${i + 1}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toLocaleDateString(),
}));

const listQuizzes = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Quiz ${i + 1}`,
  type: Math.random() > 0.5 ? "MCQ" : "Open Ended",
}));

function Pagination(
  { currentPage, totalPages, onPageChange }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  },
) {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="flex items-center">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default function page() {
  const [archivePage, setArchivePage] = useState(1);
  const [listPage, setListPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedArchiveQuizzes = archiveQuizzes.slice(
    (archivePage - 1) * itemsPerPage,
    archivePage * itemsPerPage,
  );

  const paginatedListQuizzes = listQuizzes.slice(
    (listPage - 1) * itemsPerPage,
    listPage * itemsPerPage,
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Archive</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedArchiveQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {quiz.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Pagination
          currentPage={archivePage}
          totalPages={Math.ceil(archiveQuizzes.length / itemsPerPage)}
          onPageChange={setArchivePage}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">List Quizz</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedListQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Type: {quiz.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Pagination
          currentPage={listPage}
          totalPages={Math.ceil(listQuizzes.length / itemsPerPage)}
          onPageChange={setListPage}
        />
      </section>
    </div>
  );
}

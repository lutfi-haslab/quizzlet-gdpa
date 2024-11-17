"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quiz } from "./(model)/quiz";
import { useDashboard } from "./(context)/useDashboard";

// Mock data for quizzes
const archiveQuizzes = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Live Quiz ${i + 1}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toLocaleDateString(),
}));

const listQuizzes: Quiz[] = [
  { id: 1, title: "Basic Math", type: "mcq", slug: "basic-math" },
  { id: 2, title: "World Capitals", type: "mcq", slug: "world-capitals" },
  { id: 3, title: "Essay Writing", type: "open-ended", slug: "essay-writing" },
  { id: 4, title: "Science Trivia", type: "mcq", slug: "science-trivia" },
  {
    id: 5,
    title: "Creative Writing",
    type: "open-ended",
    slug: "creative-writing",
  },
  { id: 6, title: "History Facts", type: "mcq", slug: "history-facts" },
  {
    id: 7,
    title: "Programming Concepts",
    type: "open-ended",
    slug: "programming-concepts",
  },
  { id: 8, title: "Geography Quiz", type: "mcq", slug: "geography-quiz" },
  {
    id: 9,
    title: "Literature Analysis",
    type: "open-ended",
    slug: "literature-analysis",
  },
  {
    id: 10,
    title: "General Knowledge",
    type: "mcq",
    slug: "general-knowledge",
  },
  {
    id: 11,
    title: "Physics Fundamentals",
    type: "mcq & open-ended",
    slug: "physics-fundamentals",
  },
  {
    id: 12,
    title: "Art Critique",
    type: "mcq & open-ended",
    slug: "art-critique",
  },
  {
    id: 13,
    title: "Chemistry Basics",
    type: "mcq & open-ended",
    slug: "chemistry-basics",
  },
  {
    id: 14,
    title: "Philosophical Thoughts",
    type: "mcq & open-ended",
    slug: "philosophical-thoughts",
  },
  {
    id: 15,
    title: "Biology Quiz",
    type: "mcq & open-ended",
    slug: "biology-quiz",
  },
  {
    id: 16,
    title: "Historical Analysis",
    type: "mcq & open-ended",
    slug: "historical-analysis",
  },
  {
    id: 17,
    title: "Music Theory",
    type: "mcq & open-ended",
    slug: "music-theory",
  },
  {
    id: 18,
    title: "Creative Storytelling",
    type: "mcq & open-ended",
    slug: "creative-storytelling",
  },
  {
    id: 19,
    title: "Environmental Science",
    type: "mcq & open-ended",
    slug: "environmental-science",
  },
  {
    id: 20,
    title: "Political Debates",
    type: "mcq & open-ended",
    slug: "political-debates",
  },
];

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
  const {listQuizzes} = useDashboard();
  const [archivePage, setArchivePage] = useState(1);
  const [listPage, setListPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedArchiveQuizzes = archiveQuizzes.slice(
    (archivePage - 1) * itemsPerPage,
    archivePage * itemsPerPage,
  );

  const paginatedListQuizzes = listQuizzes?.slice(
    (listPage - 1) * itemsPerPage,
    listPage * itemsPerPage,
  );

  return (
    <div className="space-y-8">
      {
        /* <section>
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
      </section> */
      }

      <section>
        <h2 className="text-2xl font-bold mb-4">List Quizz</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedListQuizzes?.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/dashboard/quiz/${quiz.id}?type=${quiz.type}&slug=${quiz.slug}`}
            >
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Type: {quiz.type}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={listPage}
          totalPages={Math.ceil((listQuizzes?.length || 0) / itemsPerPage)}
          onPageChange={setListPage}
        />
      </section>
    </div>
  );
}

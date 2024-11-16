"use client";

import { useState } from "react";
import { Calendar, Mail, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "2023-01-15",
  avatarUrl: "https://github.com/shadcn.png",
};

// Mock quiz history data
const quizHistory = [
  {
    id: 1,
    title: "Math Quiz",
    date: "2023-05-10",
    score: 85,
    totalQuestions: 20,
    description: "Basic arithmetic and algebra",
  },
  {
    id: 2,
    title: "Science Quiz",
    date: "2023-05-15",
    score: 92,
    totalQuestions: 25,
    description: "General science knowledge",
  },
  {
    id: 3,
    title: "History Quiz",
    date: "2023-05-20",
    score: 78,
    totalQuestions: 30,
    description: "World history events",
  },
];

function QuizHistoryItem({ quiz }: { quiz: typeof quizHistory[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{quiz.title}</span>
          <span className="text-sm font-normal">Score: {quiz.score}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
          Date: {quiz.date}
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">View Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{quiz.title} Results</DialogTitle>
              <DialogDescription>
                Detailed results of your quiz performance
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p>
                <strong>Date:</strong> {quiz.date}
              </p>
              <p>
                <strong>Score:</strong> {quiz.score}%
              </p>
              <p>
                <strong>Total Questions:</strong> {quiz.totalQuestions}
              </p>
              <p>
                <strong>Description:</strong> {quiz.description}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function BlockPage() {
  const { user } = useUser();
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user?.imageUrl}
              alt={user?.fullName as string || ""}
            />
            <AvatarFallback>
              {user?.fullName?.split("").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="flex items-center">
              <User className="mr-2 h-4 w-4" /> {user?.fullName}
            </p>
            <p className="flex items-center">
              <Mail className="mr-2 h-4 w-4" /> {user?.emailAddresses[0].emailAddress}
            </p>
            <p className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Joined: {user?.createdAt?.toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        {quizHistory.map((quiz) => (
          <QuizHistoryItem
            key={quiz.id}
            quiz={quiz}
          />
        ))}
      </section>
    </div>
  );
}

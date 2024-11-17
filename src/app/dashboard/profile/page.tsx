"use client";

import { use, useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  IdCardIcon,
  Mail,
  User,
} from "lucide-react";
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
import {
  getQuizHistoryByUserId,
  getQuizScoresByUserId,
} from "../(service)/quiz.repository";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDashboard } from "../(context)/useDashboard";

function QuizHistoryItem({ quiz, user_id }: { quiz: any, user_id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{quiz.quiz.title}</span>
          <span className="text-sm font-normal">Score: {quiz.score}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
          Date: {new Date(quiz.taken_at).toLocaleDateString()}
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">View Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{quiz.quiz.title} Results</DialogTitle>
              <DialogDescription>
                Detailed results of your quiz performance
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(quiz.taken_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Score:</strong> {quiz.score}%
              </p>
              <p>
                <strong>Quiz Type:</strong> {quiz.quiz.type}
              </p>
              <Link
                href={`/dashboard/quiz/${quiz.quiz.id}?type=${quiz.quiz.type}&slug=${quiz.quiz.slug}&history=true&user_id=${user_id}`}
                className="hover:text-blue-500 hover:underline"
              >
                <p>
                  <strong>Quiz ID:</strong> {quiz.quiz.id}{" "}
                  <span>
                    <ArrowRight className="inline-block h-4 w-4" />
                  </span>
                </p>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function BlockPage() {
  const { user } = useUser();
  const { queryClient } = useDashboard();


  const { data: quizHistory, isLoading: isLoadingQuizHistory } = useQuery({
    queryKey: ["quizHistory"],
    queryFn: async () => {
      return await getQuizHistoryByUserId(user?.id as string);
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["quizHistory"],
    });
  }, []);

  if (isLoadingQuizHistory) {
    return <div>Loading...</div>;
  }

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
              <IdCardIcon className="mr-2 h-4 w-4" /> {user?.id}
            </p>
            <p className="flex items-center">
              <User className="mr-2 h-4 w-4" /> {user?.fullName}
            </p>
            <p className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />{" "}
              {user?.emailAddresses[0].emailAddress}
            </p>
            <p className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Joined:{" "}
              {user?.createdAt?.toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        {quizHistory?.map((quiz: any) => (
          <QuizHistoryItem
            key={quiz.id}
            quiz={quiz}
            user_id={user?.id as string}
          />
        ))}
      </section>
    </div>
  );
}

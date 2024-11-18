"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboard } from "../../(context)/useDashboard";
import { Question, QuizHistory, TakenQuiz } from "../../(model)/quiz";
import {
  getQuestionsByQuizId,
  getQuizHistoryByUserId,
} from "../../(service)/quiz.repository";

const MCQQuestion = (
  { question, options, selectedAnswer, onAnswerChange }: {
    question: string;
    options: string[];
    selectedAnswer: string;
    onAnswerChange: (answer: string) => void;
  },
) => (
  <div className="space-y-4">
    <Label className="text-lg font-medium">{question}</Label>
    <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`option-${index}`} />
          <Label htmlFor={`option-${index}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

const OpenEndedQuestion = (
  { question, answer, onAnswerChange }: {
    question: string;
    answer: string;
    onAnswerChange: (answer: string) => void;
  },
) => (
  <div className="space-y-4">
    <Label htmlFor="answer" className="text-lg font-medium">{question}</Label>
    <Input
      id="answer"
      value={answer}
      onChange={(e) => onAnswerChange(e.target.value)}
      placeholder="Type your answer here"
    />
  </div>
);

const usePagination = (items: Question[] | [], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(items?.length / itemsPerPage);
  const currentItems = items?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const next = () =>
    setCurrentPage((current) => Math.min(current + 1, maxPage));
  const prev = () => setCurrentPage((current) => Math.max(current - 1, 1));

  return { next, prev, currentPage, maxPage, currentItems };
};

export default function QuizApp() {
  const { id } = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const type = searchParams.get("type") as string;
  const slug = searchParams.get("slug") as string;
  const isHistory = searchParams.get("history") === "true";
  const userId = searchParams.get("user_id") as string;

  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<TakenQuiz[]>([]);

  const { queryClient, mutateTakenQuizzes } = useDashboard();
  const { data: question, isLoading: isLoadingQuestion } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      return await getQuestionsByQuizId(id);
    },
  });

  const { data: quizHistory, isLoading: isLoadingQuizHistory } = useQuery({
    queryKey: ["quizHistory"],
    queryFn: async () => {
      return await getQuizHistoryByUserId(userId);
    },
  });

  useEffect(() => {
    if (!isLoadingQuestion && question) {
      setQuestionData(question);
    }
  }, [question]);

  const { next, prev, currentPage, maxPage, currentItems } = usePagination(
    questionData,
    5,
  );

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => [...prev, { questionId, answer }]);
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    mutateTakenQuizzes({
      quizId: id,
      takenQuestion: answers,
    });
  };

  const deserializeSlug = (slug: string) => {
    return slug.split("-").map((item) =>
      item.charAt(0).toUpperCase() + item.slice(1)
    ).join(" ");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{deserializeSlug(slug)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentItems.map((question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              {question.type === "mcq"
                ? (
                  <MCQQuestion
                    question={question.question}
                    options={question.options!}
                    selectedAnswer={isHistory
                      ? quizHistory.find((item: QuizHistory) =>
                        item.question.id === question.id
                      )?.answer
                      : answers.find((a) => a.questionId === question.id)
                        ?.answer || ""}
                    onAnswerChange={(answer) =>
                      handleAnswerChange(question.id, answer)}
                  />
                )
                : (
                  <OpenEndedQuestion
                    question={question.question}
                    answer={isHistory
                      ? quizHistory.find((item: QuizHistory) =>
                        item.question.id === question.id
                      )?.answer
                      : answers.find((a) => a.questionId === question.id)
                        ?.answer || ""}
                    onAnswerChange={(answer) =>
                      handleAnswerChange(question.id, answer)}
                  />
                )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
      {!isHistory && (
        <CardFooter className="flex justify-between">
          <div>
            <Button onClick={prev} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {maxPage}
            </span>
            <Button onClick={next} disabled={currentPage === maxPage}>
              Next
            </Button>
          </div>
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        </CardFooter>
      )}
    </Card>
  );
}

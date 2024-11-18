"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// import { QuizService } from "../(service)/quiz";
import { Quiz, TakenQuiz } from "../(model)/quiz";
import {
  QueryClient,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { addQuizHistory, getQuizzes } from "../(service)/quiz.repository";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface DashboardContextType {
  archivePage: number;
  setArchivePage: (page: number) => void;
  listPage: number;
  setListPage: (page: number) => void;
  itemsPerPage: number;
  listQuizzes: Quiz[] | undefined;
  queryClient: QueryClient;
  mutateTakenQuizzes: UseMutateFunction<void, Error, {
    quizId: string;
    takenQuestion: TakenQuiz[];
  }, unknown>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUser();
  const [archivePage, setArchivePage] = useState(1);
  const [listPage, setListPage] = useState(1);

  const itemsPerPage = 6;

  const { data: listQuizzes, isLoading: isLoadingListQuizzes } = useQuery({
    queryKey: ["listQuizzes"],
    queryFn: async () => {
      return await getQuizzes();
    },
  });

  useEffect(() => {
    console.log("listQuizzes", listQuizzes);
  }, [listQuizzes]);

  const { mutate: mutateTakenQuizzes } = useMutation({
    mutationKey: ["mutateTakenQuizzes"],
    mutationFn: async (
      { quizId, takenQuestion }: {
        quizId: string;
        takenQuestion: TakenQuiz[];
      },
    ) => {
      return await addQuizHistory(user?.id as string, quizId, takenQuestion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizHistory"],
      });
      router.push("/dashboard/profile");
    },
  });

  return (
    <DashboardContext.Provider
      value={{
        archivePage,
        setArchivePage,
        listPage,
        setListPage,
        itemsPerPage,
        listQuizzes,
        queryClient,
        mutateTakenQuizzes,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

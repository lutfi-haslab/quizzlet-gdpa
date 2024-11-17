"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// import { QuizService } from "../(service)/quiz";
import { Quiz } from "../(model)/quiz";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import { getQuizzes } from "../(service)/quiz.repository";

interface DashboardContextType {
  archivePage: number;
  setArchivePage: (page: number) => void;
  listPage: number;
  setListPage: (page: number) => void;
  itemsPerPage: number;
  listQuizzes: Quiz[] | undefined;
  queryClient: QueryClient;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
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

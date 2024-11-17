"use server";
import getServerClient from "@/utils/supabase/server";
import { Question, Quiz } from "../(model)/quiz";

export async function getQuizzes(): Promise<Quiz[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("quiz").select("*");

  if (error) {
    throw new Error(`Failed to fetch quizzes: ${error.message}`);
  }

  return data;
}

export async function getQuestionsByQuizId(
  quizId: string
): Promise<Question[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("question")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) {
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return data;
}

export async function getTakenQuizzesByUserId(userId: string): Promise<any> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("takenquiz")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  return data;
}

export async function getQuizScoresByUserId(userId: string): Promise<any> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("quizscore")
    .select("*, takenquiz(user_id)")
    .eq("takenquiz.user_id", userId);

  if (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  return data;
}

export async function getQuizHistoryByUserId(userId: string): Promise<any> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("quizhistory")
    .select("score, taken_at, quiz(*), question(*), answer")
    .eq("user_id", userId);

  console.log("Quiz history", data);

  if (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  return data;
}

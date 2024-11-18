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
    .eq("user_id", userId)
    .order("taken_at", { ascending: false });

  console.log("Quiz history", data);

  if (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  return data;
}

export async function addQuizHistory(
  userId: string,
  quizId: string,
  answers: { questionId: string; answer: string }[]
): Promise<void> {
  console.log("addQuizHistory", userId, quizId, answers);

  try {
    const supabase = await getServerClient();
    // Fetch questions to calculate score
    const { data: questions, error: questionsError } = await supabase
      .from("question")
      .select("id, correct_answer")
      .eq("quiz_id", quizId);

    if (questionsError) {
      throw new Error(`Failed to fetch questions: ${questionsError.message}`);
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      if (userAnswer && userAnswer.answer === question.correct_answer) {
        correctAnswers++;
      }
    });

    const totalQuestions = questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Insert each answer into QuizHistory
    const { error: historyError } = await supabase.from("quizhistory").insert(
      answers.map((answer) => ({
        user_id: userId,
        quiz_id: quizId,
        question_id: answer.questionId,
        answer: answer.answer,
        score: score,
      }))
    );

    if (historyError) {
      throw new Error(`Failed to insert quiz history: ${historyError.message}`);
    }
  } catch (error: any) {
    console.error(`Error recording quiz history: ${error?.message}`);
    throw error;
  }
}

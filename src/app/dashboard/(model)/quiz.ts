export interface Quiz {
  id: number;
  title: string;
  type: string;
  slug: string;
}

type QuestionType = "mcq" | "open-ended" | "mcq & open-ended";

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
}


export interface QuizHistory {
  score: number;
  taken_at: string;
  answer: string;
  quiz: Quiz;
  question: Question;
}

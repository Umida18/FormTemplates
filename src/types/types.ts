export interface IRegister {
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}
export interface QuestionOption {
  title: string;
}

export interface Question {
  id: string;
  text: string;
  type: "text" | "number" | "choice";
  options?: QuestionOption[];
}

export interface Template {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
}

export interface IQuestion {
  type: "text" | "number" | "choice";
  text: string;
  options?: QuestionOption[];
}

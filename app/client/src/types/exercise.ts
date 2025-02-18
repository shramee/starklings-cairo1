export interface IExercise {
  id: string;
  name: string;
  path: string;
  mode: "run" | "test";
  exercise_group?: string;
  exercise_order?: number;
  code?: string;
  description?: string;
  completed: boolean;
  disabled: boolean;
  antiCheat?: AntiCheat;
}

export interface AntiCheat {
  append?: Append;
  shouldContain?: string[];
}

export interface Append {
  to?: string;
  code: string;
}

export interface ICompletedExercise {
  exercise_id: string;
  id: number;
  resolution_date: string;
  user_name: string;
}

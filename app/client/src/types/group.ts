import { IExercise } from "./exercise"

export interface IGroup {
  id: string
  label: string
  exercises: IExercise[]
}
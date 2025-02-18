import fs from 'fs';
import util from 'util';
import toml from '@iarna/toml';
import { readFile } from "fs/promises";

const readFileAsync = util.promisify(fs.readFile);

const antiCheatJson = JSON.parse(
  await readFile(new URL("../../anti-cheat.json", import.meta.url))
);

export const getAllExercises = async (req, res, next) => {

  let response;
  try {
    response = await readFileAsync('info.toml', 'utf8');
  } catch (error) {
      throw { statusCode: 500, message: 'Error al leer el archivo' };
  }
  let result = toml.parse(response);
  let i = 1;
  for (let exercise of result.exercises) {
    exercise.exercise_order = i;
    i++;
  }
  return res.json(result.exercises);
};

export const getExercise = async (req, res) => {
  
  let response;
  try {
    response = await readFileAsync('info.toml', 'utf8');
  } catch (error) {
      throw { statusCode: 500, message: 'Error al leer el archivo' };
  }
  let result = toml.parse(response);

  let exercise;
  for (const objeto of result.exercises) {
    if (objeto.id === req.params.id) {
      exercise = objeto;
      break;
    }
  }

  exercise.antiCheat = antiCheatJson[req.params.id]

  try {
      exercise.code = await readFileAsync(exercise.path, 'utf8');
  } catch (error) {
      throw { statusCode: 500, message: 'Error al leer el archivo' };
  }

  return res.json(exercise);
};

export const getHint = async (req, res) => {
  let response;
  try {
    response = await readFileAsync('info.toml', 'utf8');
  } catch (error) {
      throw { statusCode: 500, message: 'Error al leer el archivo' };
  }
  let result = toml.parse(response);

  let exercise;
  for (const objeto of result.exercises) {
    if (objeto.id === req.params.id) {
      exercise = objeto;
      break;
    }
  }

  return res.json({ hints: exercise.hint });
};
import fs from 'fs';
import util from 'util';
import toml from '@iarna/toml';
import { readFile } from "fs/promises";

const readFileAsync = util.promisify(fs.readFile);

const antiCheatJson = JSON.parse(
  await readFile(new URL("../../anti-cheat.json", import.meta.url))
);

/**
 * Parses Starklings exercise code, splitting it into comments and exercise code
 * @param {string} code - The exercise code content
 * @returns {Object} Object containing introComments as HTML and exerciseCode
 */
export const parseExerciseContent = (code) => {
  // Split the code into lines
  const lines = code.split('\n');

  const introComments = [];
  const exerciseCodeLines = [];
  let foundFirstCodeLine = false;

  // Process each line
  for (const line of lines) {
    const trimmedLine = line.trim();

    // If we already found code, just add to exerciseCode
    if (foundFirstCodeLine) {
      exerciseCodeLines.push(line);
      continue;
    }

    // Check if line is a comment (ignoring empty lines)
    if (trimmedLine.startsWith('//')) {
      // Extract the comment text (removing the // prefix)
      const commentText = line.replace(/^(\s*\/\/\s*)/, '').trim();

      // Skip the "I AM NOT DONE" marker comment
      if (!commentText.includes("I AM NOT DONE")) {
        introComments.push(commentText);
      }
    } else if (trimmedLine !== '') {
      // If not a comment and not an empty line, it's the start of code
      foundFirstCodeLine = true;
      exerciseCodeLines.push(line);
    }
  }

  return [
    introComments.join('\n'),
    exerciseCodeLines.join('\n')
  ];
}

export const getAllExercises = async (req, res, next) => {

  let response;
  try {
    response = await readFileAsync('info.toml', 'utf8');
  } catch (error) {
    throw { statusCode: 500, message: 'Error reading exercises info file' };
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
    throw { statusCode: 500, message: 'Error reading exercises info file' };
  }
  let result = toml.parse(response);

  let exercise;
  for (const exerciseInfo of result.exercises) {
    if (exerciseInfo.name === req.params.id) {
      exercise = exerciseInfo;
      break;
    }
  }

  exercise.antiCheat = antiCheatJson[req.params.id]

  try {
    const cairoCode = await readFileAsync(exercise.path, 'utf8');
    const descAndCode = parseExerciseContent(cairoCode);
    exercise.description = exercise.description || descAndCode[0];
    exercise.code = descAndCode[1];
  } catch (error) {
    throw { statusCode: 500, message: 'Error reading exercise file at path ' + exercise.path };
  }

  return res.json(exercise);
};

export const getHint = async (req, res) => {
  let response;
  try {
    response = await readFileAsync('info.toml', 'utf8');
  } catch (error) {
    throw { statusCode: 500, message: 'Error reading exercises info file' };
  }
  let result = toml.parse(response);

  let exercise;
  for (const exerciseInfo of result.exercises) {
    if (exerciseInfo.name === req.params.id) {
      exercise = exerciseInfo;
      break;
    }
  }

  return res.json({ hints: exercise.hint });
};
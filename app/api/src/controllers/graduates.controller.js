import { pool } from "../db.js";
import csv from 'fast-csv';
import fs from 'fs';
import path from "path";

export const getGraduates = async (req, res, next) => {
  const result = await pool.query(
    "SELECT user_name FROM Resolutions GROUP BY user_name HAVING COUNT(DISTINCT exercise_id) = 54;"
  );
  return res.json(result.rows);
};

export const checkGraduate = async (req, res, next) => {
  let userGithub = req.params.github?.match(/^\d/) ? "gh" + req.params.github : req.params.github;
  const result = await pool.query(
    "SELECT COUNT(DISTINCT exercise_id) = 54 AS has_54_exercises FROM Resolutions WHERE user_name ILIKE $1;", [userGithub]
  );
  return res.json({
    "completed": result.rows[0].has_54_exercises
  });
};

export const evaluateGraduates = async (req, res, next) => {
  try {
    const listGraduates = await pool.query(
      "SELECT user_name FROM Resolutions GROUP BY user_name HAVING COUNT(DISTINCT exercise_id) = 54;"
    );

    const graduatesDict = {};
    listGraduates.rows.forEach(graduate => {
      const userName = graduate.user_name?.match(/^\d/)
        ? "gh" + graduate.user_name.toUpperCase()
        : graduate.user_name.toUpperCase();
      graduatesDict[userName] = true;
    });

    const rootDir = process.cwd();
    const filePath = path.join(rootDir, "evaluateGraduates.csv");
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on('finish', () => {
      const results = [];
      let headersValidated = false;

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          if (!headersValidated) {
            const headers = Object.keys(row);
            if (headers[0] !== 'Students') {
              return next({ statusCode: 400, message: "The first column must be 'Students'" });
            }
            headersValidated = true;
          }

          const studentName = row['Students']?.toUpperCase();
          row['Graduate'] = graduatesDict[studentName] ? 'YES' : 'NO';
          results.push(row);
        })
        .on('end', () => {
          const modifiedPath = path.join(rootDir, `modified_${path.basename(filePath)}`);
          const writeStream = fs.createWriteStream(modifiedPath);

          csv.write(results, { headers: true }).pipe(writeStream);

          writeStream.on('finish', () => {
            res.download(modifiedPath, (err) => {
              if (err) {
                return next({ statusCode: 500, message: 'Error downloading the modified file.' });
              }
              fs.unlinkSync(filePath);
              fs.unlinkSync(modifiedPath);
            });
          });

          writeStream.on('error', (error) => {
            next({ statusCode: 500, message: 'Error writing the modified file.' });
          });
        })
        .on('error', (error) => {
          next({ statusCode: 500, message: 'Error reading the uploaded file.' });
        });
    });

    writeStream.on('error', (error) => {
      next({ statusCode: 500, message: 'Error writing the uploaded file.' });
    });
  } catch (error) {
    next({ statusCode: 500, message: 'Unexpected error occurred.' });
  }
};

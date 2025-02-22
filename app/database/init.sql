CREATE TABLE Resolutions (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    exercise_id VARCHAR(255) REFERENCES Exercises(id),
    resolution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_name, exercise_id)
);

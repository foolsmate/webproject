CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  time_of_day TEXT NOT NULL,
  date TEXT NOT NULL,
  sleep_duration DECIMAL(4, 2),
  sleep_quality INTEGER,
  mood INTEGER,
  sports DECIMAL(4, 2),
  studying DECIMAL(4, 2),
  eating INTEGER, 
  user_id INTEGER REFERENCES users(id)
);

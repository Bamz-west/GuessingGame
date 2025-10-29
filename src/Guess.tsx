import React, { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySettings {
  label: string;
  maxAttempts: number;
}

const difficultyLevels: Record<Difficulty, DifficultySettings> = {
  easy: { label: "Easy (10 attempts)", maxAttempts: 10 },
  medium: { label: "Medium (7 attempts)", maxAttempts: 7 },
  hard: { label: "Hard (5 attempts)", maxAttempts: 5 },
};

const NumberGuessingGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [secretNumber, setSecretNumber] = useState<number>(generateRandomNumber());
  const [guess, setGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("Make your guess!");
  const [attemptsLeft, setAttemptsLeft] = useState<number>(difficultyLevels[difficulty].maxAttempts);
  const [gameOver, setGameOver] = useState<boolean>(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const resetGame = () => {
    setSecretNumber(generateRandomNumber());
    setGuess("");
    setMessage("Make your guess!");
    setAttemptsLeft(difficultyLevels[difficulty].maxAttempts);
    setGameOver(false);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleGuess = () => {
    if (gameOver) return;

    const numericGuess = parseInt(guess);

    if (isNaN(numericGuess) || numericGuess < 1 || numericGuess > 100) {
      setMessage("Please enter a valid number between 1 and 100.");
      return;
    }

    if (numericGuess === secretNumber) {
      setMessage(`Correct! The number was ${secretNumber}. You win!`);
      setGameOver(true);
      return;
    }

    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);

    if (newAttemptsLeft <= 0) {
      setMessage(`Out of attempts! The number was ${secretNumber}. You lose.`);
      setGameOver(true);
      return;
    }

    if (numericGuess < secretNumber) {
      setMessage("Too low! Try a higher number.");
    } else {
      setMessage("Too high! Try a lower number.");
    }

    setGuess("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-6 text-gray-800">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6 transition-all">
        <h1 className="text-3xl font-bold text-blue-700">Number Guessing Game</h1>

        <div>
          <label className="font-semibold">Select Difficulty: </label>
          <select
            className="ml-2 p-2 border rounded-lg"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={gameOver === false && attemptsLeft < difficultyLevels[difficulty].maxAttempts}
          >
            {Object.entries(difficultyLevels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-lg font-medium">{message}</div>

        {!gameOver && (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="number"
              className="border rounded-lg p-2 text-center w-32 text-lg"
              placeholder="Enter guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              min={1}
              max={100}
            />
            <button
              onClick={handleGuess}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all"
            >
              Guess
            </button>
          </div>
        )}

        <p className="font-semibold text-gray-700">Attempts Left: {attemptsLeft}</p>

        {gameOver && (
          <button
            onClick={resetGame}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all"
          >
            🔁 Restart Game
          </button>
        )}
      </div>
    </div>
  );
};

export default NumberGuessingGame;

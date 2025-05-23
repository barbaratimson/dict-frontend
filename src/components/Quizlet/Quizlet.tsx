import React, { useRef, useState, useEffect } from "react";
import { useGetQuizletCardsQuery } from "../../store/api/apiSlice";

interface CardItem {
  id: string;
  isAnswer: boolean;
  translate: string;
  value: string;
}

interface GameStats {
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
}

const Quizlet: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [stats, setStats] = useState<GameStats>({
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
  });
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [shuffledCards, setShuffledCards] = useState<CardItem[]>([]);

  const quiz = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const feedbackTimeoutRef = useRef<NodeJS.Timeout>();
  const { data: quizData, refetch: fetchQuizDataFunc } =
    useGetQuizletCardsQuery();

  // Reset game state for new round
  const resetRound = () => {
    setSelectedCard(null);
    setShowFeedback(false);
    if (quiz.current) {
      quiz.current.classList.remove(
        "bg-danger",
        "bg-opacity-70",
        "bg-success",
        "bg-warning",
      );
    }
  };

  useEffect(() => {
    if (quizData) {
      const shuffled = [...quizData].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      resetRound();
      startTimer();
    }
  }, [quizData]);

  useEffect(() => {
    if (timeLeft === 0 && gameStarted && !showFeedback) {
      handleTimeOut();
    }
  }, [timeLeft, gameStarted, showFeedback]);

  const startTimer = () => {
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  const handleTimeOut = () => {
    if (!quiz.current) return;
    quiz.current.classList.add("bg-warning", "bg-opacity-70");
    setScore(0);
    setStats((prev) => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      streak: 0,
    }));
    setShowFeedback(true);

    feedbackTimeoutRef.current = setTimeout(() => {
      fetchQuizData();
    }, 2000);
  };

  const fetchQuizData = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    fetchQuizDataFunc().then(() => {
      setGameStarted(true);
    });
  };

  const handleCardClick = (item: CardItem) => {
    if (selectedCard || !quiz.current) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedCard(item);

    if (item.isAnswer) {
      setScore((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
      }));
      quiz.current.classList.add("bg-success", "bg-opacity-70");
    } else {
      setScore(0);
      setStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
      quiz.current.classList.add("bg-danger", "bg-opacity-70");
    }

    setShowFeedback(true);

    feedbackTimeoutRef.current = setTimeout(
      () => {
        fetchQuizData();
      },
      item.isAnswer ? 1000 : 2000,
    );
  };

  const renderCards = () => {
    return shuffledCards?.map((item: CardItem) => (
      <div
        key={item.id}
        className={`relative w-full cursor-pointer overflow-hidden rounded-lg border-2 p-5 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md ${showFeedback && item.isAnswer ? "border-success bg-background-tertiary" : "border-divider bg-background-secondary"} ${showFeedback && selectedCard?.id === item.id && !item.isAnswer ? "border-danger bg-background-tertiary" : ""} `}
        onClick={() => handleCardClick(item)}
      >
        <p className="m-0 font-medium text-text-primary">{item.value}</p>
        {showFeedback && item.isAnswer && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-tertiary bg-opacity-90">
            <p className="m-0 font-semibold text-success">✓</p>
          </div>
        )}
        {showFeedback && selectedCard?.id === item.id && !item.isAnswer && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-tertiary bg-opacity-90">
            <p className="m-0 font-semibold text-danger">✗</p>
          </div>
        )}
      </div>
    ));
  };

  const getQuestionValue = (): string => {
    const answerItem = shuffledCards?.find((item) => item.isAnswer);
    return answerItem ? `How it translates "${answerItem.translate}"?` : "";
  };

  const renderGameContent = () => {
    if (!gameStarted) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <h2 className="mb-6 text-display font-bold text-text-primary">
            Quiz
          </h2>
          <div className="w-full max-w-md rounded-lg border border-divider bg-background-secondary p-6 shadow-lg">
            <p className="mb-4 text-text-primary">Rules</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 text-text-secondary">
              <li>Choose the correct translation of the word</li>
              <li>You get +1 point for each correct answer.</li>
              <li>An incorrect answer resets the score</li>
              <li>Each question is given 15 seconds.</li>
            </ul>
            <button
              className="w-full cursor-pointer rounded-md bg-primary-500 px-5 py-3 text-body font-medium text-text-primary transition-colors duration-300 hover:bg-primary-600 active:scale-95"
              onClick={fetchQuizData}
            >
              Start
            </button>
          </div>
        </div>
      );
    }

    if (shuffledCards?.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-divider bg-background-secondary p-8 text-center shadow-lg">
            <h2 className="mb-4 text-h1 font-bold text-text-primary">
              Игра завершена!
            </h2>
            <div className="mb-6 space-y-2 text-text-secondary">
              <p>
                Correct answers:{" "}
                <span className="font-bold text-success">{stats.correct}</span>
              </p>
              <p>
                Incorrect answers:{" "}
                <span className="font-bold text-danger">{stats.incorrect}</span>
              </p>
              <p>
                Maximum series:{" "}
                <span className="font-bold text-accent">{stats.maxStreak}</span>
              </p>
              <p>
                Final score:{" "}
                <span className="font-bold text-primary-500">{score}</span>
              </p>
            </div>
            <button
              className="w-full cursor-pointer rounded-md bg-primary-500 px-5 py-3 text-body font-medium text-text-primary transition-colors duration-300 hover:bg-primary-600 active:scale-95"
              onClick={fetchQuizData}
            >
              Играть снова
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={quiz}
        className="flex h-fit w-full max-w-2xl flex-col items-center justify-center p-4 transition-colors duration-300"
      >
        <div className="mb-4 flex w-full items-center justify-between text-text-primary">
          <div className="text-body">
            Score: <span className="font-bold text-primary-500">{score}</span>
          </div>
          <div className="text-body">
            Series: <span className="font-bold text-accent">{stats.streak}</span>
          </div>
          <div
            className={`text-body font-bold ${
              timeLeft <= 5 ? "text-danger" : "text-text-muted"
            }`}
          >
            Time: {timeLeft}с
          </div>
        </div>

        <div className="w-full rounded-lg border border-divider bg-background-secondary p-6 shadow-md">
          <div className="mb-6 rounded-t-lg border-2 border-divider p-4 text-center">
            <p className="text-h3 font-bold text-text-primary">
              {getQuestionValue()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">{renderCards()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background-default flex min-h-screen items-center justify-center p-4">
      {renderGameContent()}
    </div>
  );
};

export default Quizlet;

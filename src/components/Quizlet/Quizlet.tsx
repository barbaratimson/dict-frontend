import React, { useRef, useState } from "react";
import axios from "axios";
import "./Quizlet.css"
import { useGetQuizletCardsQuery } from "../../store/api/apiSlice";

const Quizlet = () => {
  const [score, setScore] = useState(0);
  const [selectedCard, setSelectedCard] = useState<
    {
      isAnswer: boolean;
      translate: string;
      value: string;
    }
  >([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundEnded, setIsRoundEnded] = useState(false);
  const quiz = useRef(null);
  const { data: quizData, refetch: fetchQuizDataFunc } = useGetQuizletCardsQuery();


  const fetchQuizData = () => {
      fetchQuizDataFunc().then(()=>{
        setGameStarted(true)
      })
  }

  const handleCardClick = (item) => {
    if (!quiz.current) return
    if (roundEnded) return;
    if (item.isAnswer) {
      setScore((prevScore) => prevScore + 1);
      quiz.current.style.backgroundColor = "rgba(0,133,5,0.7)";
      setIsRoundEnded(true);
    } else {
      quiz.current.style.backgroundColor = "rgba(225,0,0,0.7)";
      setScore(0);
      setIsRoundEnded(true);
    }
    setSelectedCard(item);

    setTimeout(() => {
      if (!quiz.current) return;
      quiz.current.style.backgroundColor = "";
    }, 700);
  };

  const renderCards = () => {
    return quizData?.map((item, index) => (
      <div
        key={index}
        className={`card ${selectedCard && selectedCard.translate === item.translate ? "selected" : ""}`}
        onClick={() => handleCardClick(item)}
      >
        <p className="value">{item.value}</p>
        {((selectedCard && selectedCard.translate === item.translate) ||
          roundEnded) && (
          <div
            className={`translate-container ${roundEnded ? "show-translate" : ""}`}
          >
            <p className="translate">{item.translate}</p>
          </div>
        )}
      </div>
    ));
  };

  const getQuestionValue = () => {
    const answerItem = quizData?.find((item) => item.isAnswer);
    return answerItem ? `Как переводится \"${answerItem.translate}\"?` : "";
  };

  const renderGameContent = () => {
    if (!gameStarted) {
      return (
        <div className="quiz-button-container">
          <button className="quiz-button" onClick={fetchQuizData}>
            Начать
          </button>
        </div>
      );
    }

    if (quizData?.length === 0) {
      return (
        <div className="quiz-button-container">
          <p>Уровни закончились! Поздравляем!</p>
          <button className="quiz-button" onClick={fetchQuizData}>
            Начать заново
          </button>
        </div>
      );
    }

    return (
      <div ref={quiz} className="quiz-main-wrapper">
        <p className="score-label">Счет: {score}</p>
        <div className="quiz-container">
          <div className="question-box">
            <p className="question-value">{getQuestionValue()}</p>
          </div>
          <div className="card-container">
            <div className="card-grid">{renderCards()}</div>
          </div>
        </div>
        <div className="quiz-button-container">
          <button className="quiz-button" onClick={fetchQuizData}>
            Следующий уровень
          </button>
        </div>
      </div>
    );
  };
  return <>{renderGameContent()}</>;
};

export default Quizlet;

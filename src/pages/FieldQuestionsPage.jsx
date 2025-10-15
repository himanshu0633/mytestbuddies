import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const FieldQuestionsPage = () => {
  const { fieldId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState(null); // For storing the progress result
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/admin/questions/fields/que/${fieldId}`);
        setQuestions(res.data.questions || []);
        setAnswers(res.data.questions.map(() => ""));
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [fieldId]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, submitted]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) =>
      prev.map((a, i) => (questions[i]._id === questionId ? answer : a))
    );
  };

  const handleStartQuiz = () => {
    if (!userName.trim()) {
      alert("Please enter your name to start the quiz");
      return;
    }
    setQuizStarted(true);
  };

  const handleAutoSubmit = async () => {
    try {
      const answersData = questions.map((q, i) => ({
        questionId: q._id,
        answer: answers[i],
      }));

      const res = await api.post(`/admin/questions/fields/submit-answer/${fieldId}`, {
        fieldId,
        userName,
        answers: answersData,
      });

      if (res.data.success) {
        setSubmitted(true);
        // After successful submission, get the progress
        const progressRes = await api.get(`/admin/questions/fields/progress/${fieldId}`);
        setProgress(progressRes.data.progress); // Store the progress result
      }
    } catch (err) {
      console.error("Error auto-submitting answers", err);
      setSubmitted(true); // Still mark as submitted even if API fails
    }
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm("Are you sure you want to submit your quiz?");
    if (!confirmed) return;

    await handleAutoSubmit();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculation
  const answeredCount = answers.filter(answer => answer !== "").length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Function to filter and get the latest question for each question ID
  const getLatestQuestions = (questionsAnswered) => {
    const latestQuestions = {};

    questionsAnswered.forEach((qa) => {
      const questionId = qa.question._id;

      // Only store the question if it's the first one or it has a later createdAt date
      if (!latestQuestions[questionId] || new Date(qa.question.createdAt) > new Date(latestQuestions[questionId].question.createdAt)) {
        latestQuestions[questionId] = qa;
      }
    });

    return Object.values(latestQuestions);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (submitted && progress) {
    const filteredQuestions = getLatestQuestions(progress.questionsAnswered); // Filter for latest questions

    return (
      <div className="submission-success">
        <div className="success-icon">🎉</div>
        <h2>Quiz Submitted Successfully!</h2>
        <p>Thank you, {userName}! Your answers have been recorded.</p>

        {/* Show Progress */}
        <div className="result-container">
          <h3>Quiz Result</h3>
          <div className="result-details">
            <p><strong>Total Questions Answered:</strong> {progress.totalAnswered}</p>
            <p><strong>Correct Answers:</strong> {progress.totalCorrect}</p>
            <p><strong>Score:</strong> {Math.floor((progress.totalCorrect / progress.totalAnswered) * 100)}%</p>
          </div>

          <div className="answered-questions">
            <h4>Answered Questions</h4>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((qa, index) => (
                <div key={qa._id} className="question-result">
                  <div className="question-text">
                    <strong>Q{index + 1}:</strong> {qa.question.text}
                  </div>
                  <div className="user-answer">
                    <strong>Your Answer:</strong> {qa.answer} 
                    {qa.isCorrect ? (
                      <span className="correct">✔ Correct</span>
                    ) : (
                      <span className="incorrect">✘ Incorrect</span>
                    )}
                  </div>
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong> {qa.question.options[parseInt(qa.question.correctAnswer)].text}
                  </div>
                </div>
              ))
            ) : (
              <p>No questions answered.</p>
            )}
          </div>
        </div>

        <button
      className="home-button"
      onClick={() => navigate("/dashboard")} // Navigate to the dashboard
    >
      Back to Home
    </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start-modal">
        <div className="quiz-start-card">
          <div className="quiz-header">
            <h1>📝 Quiz Instructions</h1>
          </div>
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <div>
                <strong>Time Limit</strong>
                <p>30 minutes</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">❓</span>
              <div>
                <strong>Total Questions</strong>
                <p>{questions.length} questions</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⚠️</span>
              <div>
                <strong>Important</strong>
                <p>Timer starts when you click "Start Quiz"</p>
              </div>
            </div>
          </div>

          <div className="name-input-container">
            <label htmlFor="userName">Enter Your Name:</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              className="name-input"
            />
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!userName.trim()}
            className="start-quiz-btn"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header-sticky">
        <div className="header-content">
          <div className="quiz-info-bar">
            <div className="info-section">
              <span className="user-info">👤 {userName}</span>
              <span className="timer">
                ⏰ {formatTime(timeLeft)}
                {timeLeft < 300 && <span className="time-warning"> (Hurry!)</span>}
              </span>
            </div>
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="questions-container">
        <h2 className="quiz-title">Quiz Questions</h2>

        {questions.length === 0 ? (
          <div className="no-questions">
            <p>No questions found for this quiz.</p>
          </div>
        ) : (
          questions.map((q, i) => (
            <div key={q._id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {i + 1}</span>
                <span className="question-type">{q.type.toUpperCase()}</span>
              </div>

              <h3 className="question-text">{q.text}</h3>

              {q.type === "mcq" ? (
                <div className="options-container">
                  {q.options.map((opt, j) => (
                    <label key={j} className="option-label">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt.text}
                        checked={answers[i] === opt.text}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                        className="option-input"
                      />
                      <span className="custom-radio"></span>
                      {opt.text}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-answer-container">
                  <textarea
                    rows="4"
                    value={answers[i]}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="text-answer"
                  />
                </div>
              )}

              <div className="answer-status">
                {answers[i] ? (
                  <span className="answered-badge">✓ Answered</span>
                ) : (
                  <span className="unanswered-badge">⏳ Not answered</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button
          onClick={handleSubmit}
          disabled={answeredCount === 0}
          className={`submit-btn ${answeredCount === 0 ? "disabled" : ""}`}
        >
          Submit Quiz ({answeredCount}/{questions.length})
        </button>

        <div className="time-remaining">
          Time remaining: <strong>{formatTime(timeLeft)}</strong>
        </div>
      </div>
    </div>
  );
};

export default FieldQuestionsPage;

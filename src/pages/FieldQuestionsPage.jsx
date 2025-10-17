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
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/admin/questions/fields/que/${fieldId}`);
        if (res.data?.questions) {
          setQuestions(res.data.questions);
          setAnswers(res.data.questions.map(() => ""));
        } else {
          console.error("Questions data is missing");
        }
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
        const progressRes = await api.get(`/admin/questions/fields/progress/${fieldId}`);
        setProgress(progressRes.data.progress);
      }
    } catch (err) {
      console.error("Error auto-submitting answers", err);
      setSubmitted(true);
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

  const answeredCount = answers.filter(answer => answer !== "").length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const getLatestQuestions = (questionsAnswered) => {
    if (!Array.isArray(questionsAnswered)) {
      console.error("Invalid questionsAnswered data", questionsAnswered);
      return [];
    }

    const latestQuestions = {};
    questionsAnswered.forEach((qa) => {
      const questionId = qa.question._id;
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
    const filteredQuestions = getLatestQuestions(progress.questionsAnswered);
    const scorePercentage = Math.floor((progress.totalCorrect / progress.totalAnswered) * 100) || 0;
    
    const getPerformanceData = (score) => {
      if (score >= 90) return { level: "Excellent", color: "#10b981", emoji: "🎯", bgColor: "#f0fdf4" };
      if (score >= 80) return { level: "Great", color: "#3b82f6", emoji: "🌟", bgColor: "#f0f9ff" };
      if (score >= 70) return { level: "Good", color: "#8b5cf6", emoji: "👍", bgColor: "#faf5ff" };
      if (score >= 60) return { level: "Average", color: "#f59e0b", emoji: "📚", bgColor: "#fffbeb" };
      return { level: "Needs Improvement", color: "#ef4444", emoji: "💪", bgColor: "#fef2f2" };
    };

    const performance = getPerformanceData(scorePercentage);

    return (
      <div className="submission-success-container">
        <div className="success-header">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>
          <h1>Quiz Submitted Successfully!</h1>
          <p className="success-message">
            Thank you, <span className="user-name-highlight">{userName}</span>! Your answers have been recorded.
          </p>
        </div>

        <div className="performance-overview">
          <div className="score-card" style={{ borderColor: performance.color, backgroundColor: performance.bgColor }}>
            <div className="score-circle">
              <div 
                className="score-progress" 
                style={{ 
                  background: `conic-gradient(${performance.color} ${scorePercentage * 3.6}deg, #e5e7eb 0deg)` 
                }}
              >
                <div className="score-inner">
                  <span className="score-percentage">{scorePercentage}%</span>
                </div>
              </div>
            </div>
            <div className="performance-info">
              <h3 style={{ color: performance.color }}>
                {performance.emoji} {performance.level}
              </h3>
              <div className="performance-stats">
                <div className="stat-item">
                  <span className="stat-value" style={{ color: performance.color }}>{progress.totalCorrect}</span>
                  <span className="stat-label">Correct</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" style={{ color: "#ef4444" }}>{progress.totalAnswered - progress.totalCorrect}</span>
                  <span className="stat-label">Incorrect</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" style={{ color: "#6b7280" }}>{progress.totalAnswered}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detailed-results">
          <div className="results-header">
            <h2>Detailed Results</h2>
            <div className="results-summary">
              <span className="summary-item correct-summary">
                <span className="indicator correct-indicator"></span>
                Correct: {progress.totalCorrect}
              </span>
              <span className="summary-item incorrect-summary">
                <span className="indicator incorrect-indicator"></span>
                Incorrect: {progress.totalAnswered - progress.totalCorrect}
              </span>
            </div>
          </div>

          <div className="questions-review">
            {filteredQuestions?.length > 0 ? (
              filteredQuestions.map((qa, index) => (
                <div 
                  key={qa._id} 
                  className={`question-review-card ${qa.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="question-review-header">
                    <div className="question-number-badge">
                      Q{index + 1}
                    </div>
                    <div className="result-status">
                      {qa.isCorrect ? (
                        <span className="status-correct">✓ Correct</span>
                      ) : (
                        <span className="status-incorrect">✗ Incorrect</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <p className="question-text">{qa.question.text}</p>
                    
                    <div className="answer-comparison">
                      <div className="answer-section">
                        <span className="answer-label">Your Answer:</span>
                        <p className={`user-answer ${qa.isCorrect ? 'correct' : 'incorrect'}`}>
                          {qa.answer || "No answer provided"}
                        </p>
                      </div>
                      
                      {!qa.isCorrect && (
                        <div className="answer-section">
                          <span className="answer-label">Correct Answer:</span>
                          <p className="correct-answer">
                            {qa.question.options?.[parseInt(qa.question.correctAnswer)]?.text || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-answers">
                <p>No questions were answered.</p>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="home-button primary"
            onClick={() => navigate("/dashboard")}
          >
            🏠 Back to Home
          </button>
          <button
            className="home-button secondary"
            onClick={() => window.location.reload()}
          >
            🔄 Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start-modal">
        <div className="quiz-start-card">
          <div className="quiz-header">
            <div className="header-icon">📝</div>
            <h1>Quiz Instructions</h1>
            <p>Get ready to test your knowledge!</p>
          </div>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <div className="info-content">
                <strong>Time Limit</strong>
                <p>30 minutes to complete all questions</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">❓</span>
              <div className="info-content">
                <strong>Total Questions</strong>
                <p>{questions.length} questions to answer</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⚠️</span>
              <div className="info-content">
                <strong>Important</strong>
                <p>Timer starts immediately when you begin</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <div className="info-content">
                <strong>Scoring</strong>
                <p>Immediate results with detailed feedback</p>
              </div>
            </div>
          </div>

          <div className="name-input-container">
            <label htmlFor="userName" className="input-label">Enter Your Name</label>
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
            className={`start-quiz-btn ${!userName.trim() ? 'disabled' : ''}`}
          >
            🚀 Start Quiz Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header-sticky">
        <div className="header-content">
          <div className="quiz-info-bar">
            <div className="info-section">
              <div className="user-info">
                <span className="info-emoji">👤</span>
                <span className="info-text">{userName}</span>
              </div>
              <div className="timer-container">
                <span className="timer-emoji">⏰</span>
                <span className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
                  {formatTime(timeLeft)}
                  {timeLeft < 300 && <span className="time-warning"> (Hurry!)</span>}
                </span>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text">
                  {answeredCount}/{questions.length} answered
                </span>
                <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="questions-container">
        <div className="quiz-title-section">
          <h2 className="quiz-title">Quiz Questions</h2>
          <div className="quiz-stats">
            <span className="stat">Total: {questions.length}</span>
            <span className="stat">Answered: {answeredCount}</span>
            <span className="stat">Remaining: {questions.length - answeredCount}</span>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="no-questions">
            <div className="no-questions-icon">❓</div>
            <p>No questions found for this quiz.</p>
          </div>
        ) : (
          <div className="questions-grid">
            {questions.map((q, i) => (
              <div key={q._id} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {i + 1}</span>
                  <span className={`question-type ${q.type}`}>{q.type.toUpperCase()}</span>
                </div>

                <h3 className="question-text">{q.text}</h3>

                {q.type === "mcq" ? (
                  <div className="options-container">
                    {q.options?.map((opt, j) => (
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
                        <span className="option-text">{opt.text}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-answer-container">
                    <textarea
                      rows="4"
                      value={answers[i]}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      placeholder="Type your detailed answer here..."
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
            ))}
          </div>
        )}
      </div>

      <div className="submit-section">
        <div className="submit-content">
          <button
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className={`submit-btn ${answeredCount === 0 ? "disabled" : "active"}`}
          >
            <span className="submit-icon">📤</span>
            Submit Quiz ({answeredCount}/{questions.length})
          </button>
          
          <div className="time-remaining">
            <span className="time-label">Time remaining:</span>
            <strong className="time-value">{formatTime(timeLeft)}</strong>
          </div>
        </div>
        
        {answeredCount === 0 && (
          <div className="submit-warning">
            ⚠️ Please answer at least one question to submit
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldQuestionsPage;
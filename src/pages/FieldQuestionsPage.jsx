import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";

const FieldQuestionsPage = () => {
  const { fieldId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // ✅ GET all questions of the field
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

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) =>
      prev.map((a, i) => (questions[i]._id === questionId ? answer : a))
    );
  };

  const handleSubmit = async () => {
    try {
      const answersData = questions.map((q, i) => ({
        questionId: q._id,
        answer: answers[i],
      }));

      // ✅ POST user answers
      const res = await api.post(`/admin/questions/fields/submit-answer/${fieldId}`, {
        fieldId,
        answers: answersData,
      });

      if (res.data.success) {
        alert("✅ Answers submitted successfully!");
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting answers", err);
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (submitted) return <p>🎉 Quiz submitted successfully!</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Quiz — Field ID: {fieldId}</h2>

      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((q, i) => (
          <div key={q._id} style={{ marginBottom: 20 }}>
            <h4>{i + 1}. {q.text}</h4>
            {q.type === "mcq" ? (
              q.options.map((opt, j) => (
                <label key={j} style={{ display: "block", marginLeft: 10 }}>
                  <input
                    type="radio"
                    name={q._id}
                    value={opt.text}
                    checked={answers[i] === opt.text}
                    onChange={(e) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                  />{" "}
                  {opt.text}
                </label>
              ))
            ) : (
              <textarea
                rows="3"
                style={{ width: "100%", marginTop: 5 }}
                value={answers[i]}
                onChange={(e) =>
                  handleAnswerChange(q._id, e.target.value)
                }
                placeholder="Write your answer..."
              />
            )}
          </div>
        ))
      )}

      <button
        onClick={handleSubmit}
        disabled={answers.some((a) => a === "")}
        style={{
          padding: "10px 20px",
          background: answers.some((a) => a === "") ? "gray" : "green",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: answers.some((a) => a === "") ? "not-allowed" : "pointer",
        }}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default FieldQuestionsPage;

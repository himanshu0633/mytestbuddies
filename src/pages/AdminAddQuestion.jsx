import React, { useState } from 'react';
import api from '../utils/axios';  // Importing axios instance
import FieldDropdown from '../components/FieldDropdown';  // Field selection dropdown component

export default function AdminAddQuestion() {
  const [fieldId, setFieldId] = useState('');  // Store selected field's ID
  const [type, setType] = useState('mcq');  // Default question type is 'mcq'
  const [text, setText] = useState('');  // Question text
  const [options, setOptions] = useState(['', '', '', '']);  // MCQ options
  const [correctAnswer, setCorrectAnswer] = useState('');  // Correct answer for MCQs
  const [solution, setSolution] = useState('');  // Solution or explanation
  const [timeAllocated, setTimeAllocated] = useState('');  // Time allocated for the question
  const [loading, setLoading] = useState(false);  // To show loading state on form submission

  // Submit question to the backend
  const submit = async (e) => {
    e.preventDefault();
    if (!fieldId) return alert('Please select a field first.');

    // Prepare the payload based on the question type
    const payload = {
      type,
      text,
      fieldId,
      options: type === 'mcq'
        ? options
            .filter((o) => o.trim() !== '')
            .map((o) => ({ text: o }))  // Convert options to object form for MCQ
        : [],
      correctAnswer,
      solution,
      timeAllocated: timeAllocated ? Number(timeAllocated) : undefined,
    };

    try {
      setLoading(true);  // Show loading spinner while request is being made
    



      const { data } = await api.post(`/admin/questions/fields/${fieldId}/questions`, payload);
alert('✅ Question created successfully!');
      // Reset form after successful question creation
      setText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setSolution('');
      setTimeAllocated('');
    } catch (err) {
      console.error('Error creating question:', err);
      alert('❌ Error: ' + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);  // Hide loading spinner after request completion
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>🧠 Admin — Add Question</h2>

      {/* Select Field Dropdown */}
      <FieldDropdown value={fieldId} onChange={setFieldId} /> {/* Field selection dropdown */}

      <form onSubmit={submit} style={{ marginTop: 16 }}>
        {/* Type of Question (MCQ or Descriptive) */}
        <label>
          Type:&nbsp;
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: 5 }}
          >
            <option value="mcq">MCQ</option>
            <option value="descriptive">Descriptive</option>
          </select>
        </label>

        {/* Question Text */}
        <textarea
          placeholder="Enter question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{
            width: '100%',
            minHeight: 70,
            marginTop: 10,
            padding: 8,
            fontSize: 15,
          }}
        />

        {/* Display MCQ Options if the type is MCQ */}
        {type === 'mcq' && (
          <div style={{ marginTop: 10 }}>
            <h4>Options:</h4>
            {options.map((opt, idx) => (
              <input
                key={idx}
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const copy = [...options];
                  copy[idx] = e.target.value;
                  setOptions(copy);
                }}
                style={{
                  width: '100%',
                  marginBottom: 5,
                  padding: 6,
                  fontSize: 14,
                }}
              />
            ))}

            <input
              placeholder="Correct answer (exact text or index)"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              style={{
                width: '100%',
                marginTop: 5,
                padding: 6,
                fontSize: 14,
              }}
            />
          </div>
        )}

        {/* Solution/Explanation */}
        <textarea
          placeholder="Solution / explanation"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          style={{
            width: '100%',
            minHeight: 60,
            marginTop: 10,
            padding: 8,
            fontSize: 14,
          }}
        />

        {/* Time allocated for the question */}
        <input
          type="number"
          placeholder="Time allocated (seconds)"
          value={timeAllocated}
          onChange={(e) => setTimeAllocated(e.target.value)}
          style={{
            width: '100%',
            marginTop: 10,
            padding: 6,
            fontSize: 14,
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !fieldId}  // Disable button while loading or if no field is selected
          style={{
            marginTop: 12,
            padding: '8px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Adding...' : '➕ Add Question'}
        </button>
      </form>
    </div>
  );
}

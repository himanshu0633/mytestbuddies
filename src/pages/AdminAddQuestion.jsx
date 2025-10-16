import React, { useState } from 'react';
import api from '../utils/axios';
import FieldDropdown from '../components/FieldDropdown';

export default function AdminAddQuestion() {
  const [fieldId, setFieldId] = useState('');
  const [type, setType] = useState('mcq');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [solution, setSolution] = useState('');
  const [timeAllocated, setTimeAllocated] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!fieldId) {
      alert('Please select a field first.');
      return;
    }

    const payload = {
      type,
      text,
      fieldId,
      options: type === 'mcq'
        ? options
            .filter((o) => o.trim() !== '')
            .map((o) => ({ text: o }))
        : [],
      correctAnswer,
      solution,
      timeAllocated: timeAllocated ? Number(timeAllocated) : undefined,
    };

    try {
      setLoading(true);
      const { data } = await api.post(`/admin/questions/fields/${fieldId}/questions`, payload);
      alert('✅ Question created successfully!');
      
      // Reset form
      setText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setSolution('');
      setTimeAllocated('');
    } catch (err) {
      console.error('Error creating question:', err);
      alert('❌ Error: ' + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-icon">🧠</div>
        <h1>Add New Question</h1>
        <p>Create questions for your assessment system</p>
      </div>

      <div className="form-card">
        {/* Field Selection */}
        <div className="form-section">
          <label className="form-label">Field *</label>
          <p className="label-description">Select the field this question belongs to</p>
          <FieldDropdown value={fieldId} onChange={setFieldId} />
        </div>

        <form onSubmit={submit}>
          {/* Question Type */}
          <div className="form-section">
            <label className="form-label">Question Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${type === 'mcq' ? 'active' : ''}`}
                onClick={() => setType('mcq')}
              >
                <div className="type-icon">📝</div>
                <div className="type-text">
                  <div className="type-title">Multiple Choice</div>
                  <div className="type-desc">Select from options</div>
                </div>
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'descriptive' ? 'active' : ''}`}
                onClick={() => setType('descriptive')}
              >
                <div className="type-icon">📋</div>
                <div className="type-text">
                  <div className="type-title">Descriptive</div>
                  <div className="type-desc">Text-based answer</div>
                </div>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="form-section">
            <label className="form-label">Question Text *</label>
            <textarea
              placeholder="Enter your question here... Be clear and concise."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="text-input large"
              rows="4"
            />
          </div>

          {/* MCQ Options */}
          {type === 'mcq' && (
            <div className="form-section">
              <div className="section-header">
                <label className="form-label">Answer Options</label>
                <button type="button" onClick={addOption} className="add-option-btn">
                  + Add Option
                </button>
              </div>
              
              <div className="options-grid">
                {options.map((opt, idx) => (
                  <div key={idx} className="option-item">
                    <div className="option-number">{idx + 1}</div>
                    <input
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[idx] = e.target.value;
                        setOptions(copy);
                      }}
                      className="text-input"
                    />
                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="remove-option-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="correct-answer-section">
                <label className="form-label">Correct Answer *</label>
                <p className="label-description">Enter the exact text of the correct option</p>
                <input
                  placeholder="Enter correct answer..."
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="text-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Solution */}
          <div className="form-section">
            <label className="form-label">Solution & Explanation</label>
            <textarea
              placeholder="Provide detailed explanation or solution steps..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="text-input large"
              rows="3"
            />
          </div>

          {/* Time Allocation */}
          {/* <div className="form-section">
            <label className="form-label">Time Allocation</label>
            <p className="label-description">Recommended time in seconds for this question</p>
            <div className="time-input-container">
              <input
                type="number"
                placeholder="e.g., 60"
                value={timeAllocated}
                onChange={(e) => setTimeAllocated(e.target.value)}
                className="text-input"
                min="1"
              />
              <span className="time-suffix">seconds</span>
            </div>
          </div> */}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || !fieldId}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Question...
                </>
              ) : (
                <>
                  <span className="btn-icon">➕</span>
                  Add Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-container {
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .admin-header h1 {
          margin: 0;
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
        }

        .admin-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 16px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .label-description {
          font-size: 13px;
          color: #6b7280;
          margin: 4px 0 12px;
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .type-btn {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn:hover {
          border-color: #3b82f6;
        }

        .type-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .type-icon {
          font-size: 24px;
          margin-right: 12px;
        }

        .type-title {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .type-desc {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        .text-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .text-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .text-input.large {
          resize: vertical;
          min-height: 80px;
        }

        .add-option-btn {
          background: #f8fafc;
          border: 1px dashed #d1d5db;
          color: #64748b;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .add-option-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .option-number {
          background: #f1f5f9;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          flex-shrink: 0;
        }

        .remove-option-btn {
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #dc2626;
          font-size: 18px;
          flex-shrink: 0;
        }

        .remove-option-btn:hover {
          background: #fecaca;
        }

        .correct-answer-section {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .time-input-container {
          position: relative;
          max-width: 200px;
        }

        .time-input-container .text-input {
          padding-right: 80px;
        }

        .time-suffix {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 14px;
        }

        .form-actions {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .submit-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.loading {
          background: #6b7280;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-icon {
          font-size: 18px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 16px;
          }

          .form-card {
            padding: 24px;
          }

          .type-selector {
            grid-template-columns: 1fr;
          }

          .time-input-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
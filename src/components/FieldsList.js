import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

export default function FieldsList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Fetch all fields
  const fetchFields = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fields');
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
      alert('Error fetching fields');
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for a specific field
  const fetchFieldQuestions = async (fieldId) => {
    try {
      setQuestionsLoading(true);
      const { data } = await api.get(`/fields/${fieldId}/questions`);
      setSelectedField(data.field);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Error fetching questions');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Close questions view
  const closeQuestionsView = () => {
    setSelectedField(null);
    setQuestions([]);
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Calculate field statistics
  const getFieldStats = (field) => {
    return {
      totalTime: field.defaultTimePerQuestion * 10, // Assuming 10 questions
      difficulty: 'Mixed',
      questionsCount: '10+'
    };
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Available Quiz Fields</h1>
        <p style={subtitleStyle}>
          Choose a field to start practicing. Click on any field to view all questions.
        </p>
      </div>

      {/* Questions Modal */}
      {selectedField && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                Questions for: {selectedField.name}
              </h2>
              <button onClick={closeQuestionsView} style={closeButtonStyle}>
                ✕
              </button>
            </div>

            {questionsLoading ? (
              <div style={loadingStyle}>Loading questions...</div>
            ) : (
              <div style={questionsContainerStyle}>
                {questions.length > 0 ? (
                  <div style={questionsListStyle}>
                    {questions.map((question, index) => (
                      <div key={question._id} style={questionCardStyle}>
                        <div style={questionHeaderStyle}>
                          <h3 style={questionNumberStyle}>
                            Question {index + 1}
                          </h3>
                          <span style={difficultyBadgeStyle}>
                            {question.difficulty || 'Medium'}
                          </span>
                        </div>
                        
                        <p style={questionTextStyle}>
                          {question.questionText}
                        </p>

                        {question.options && question.options.length > 0 && (
                          <div style={optionsStyle}>
                            <h4 style={optionsTitleStyle}>Options:</h4>
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex} 
                                style={{
                                  ...optionStyle,
                                  background: question.correctAnswer === optIndex ? '#d4edda' : '#f8f9fa',
                                  borderColor: question.correctAnswer === optIndex ? '#c3e6cb' : '#dee2e6'
                                }}
                              >
                                <span style={optionLabelStyle}>
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                {option}
                                {question.correctAnswer === optIndex && (
                                  <span style={correctBadgeStyle}>✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={questionFooterStyle}>
                          <span style={timeStyle}>
                            ⏱️ Time: {selectedField.defaultTimePerQuestion}s
                          </span>
                          {question.explanation && (
                            <span style={explanationStyle}>
                              💡 Hint: {question.explanation}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No questions available for this field yet.</p>
                    <p>Check back later or contact admin to add questions.</p>
                  </div>
                )}
              </div>
            )}

            <div style={modalFooterStyle}>
              <button onClick={closeQuestionsView} style={doneButtonStyle}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fields Grid */}
      {loading ? (
        <div style={loadingStyle}>Loading fields...</div>
      ) : (
        <div style={gridStyle}>
          {fields.map(field => {
            const stats = getFieldStats(field);
            return (
              <div 
                key={field._id} 
                style={fieldCardStyle}
                onClick={() => fetchFieldQuestions(field._id)}
              >
                <div style={cardHeaderStyle}>
                  <div style={iconContainerStyle}>
                    <span style={iconStyle}>
                      {field.for === 'Student' ? '🎓' : '🌐'}
                    </span>
                  </div>
                  <div style={fieldInfoStyle}>
                    <h3 style={fieldNameStyle}>{field.name}</h3>
                    <p style={fieldDescriptionStyle}>{field.description}</p>
                  </div>
                </div>

                <div style={statsStyle}>
                  <div style={statItemStyle}>
                    <span style={statValueStyle}>{stats.questionsCount}</span>
                    <span style={statLabelStyle}>Questions</span>
                  </div>
                  <div style={statItemStyle}>
                    <span style={statValueStyle}>{stats.totalTime}m</span>
                    <span style={statLabelStyle}>Total Time</span>
                  </div>
                  <div style={statItemStyle}>
                    <span style={statValueStyle}>{stats.difficulty}</span>
                    <span style={statLabelStyle}>Level</span>
                  </div>
                </div>

                <div style={fieldFooterStyle}>
                  <span style={{
                    ...audienceBadgeStyle,
                    background: field.for === 'Student' ? '#e74c3c' : '#3498db'
                  }}>
                    {field.for}
                  </span>
                  <button style={viewButtonStyle}>
                    View Questions →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fields.length === 0 && !loading && (
        <div style={emptyStateStyle}>
          <p>No fields available at the moment.</p>
          <p>Please check back later or contact support.</p>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '40px',
  padding: '20px'
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: '0 0 10px 0'
};

const subtitleStyle = {
  fontSize: '1.2rem',
  color: '#666',
  margin: 0
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '25px'
};

const fieldCardStyle = {
  background: 'white',
  border: '1px solid #e0e0e0',
  borderRadius: '15px',
  padding: '25px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '15px',
  marginBottom: '20px'
};

const iconContainerStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  padding: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const iconStyle = {
  fontSize: '1.8rem',
  display: 'block'
};

const fieldInfoStyle = {
  flex: 1
};

const fieldNameStyle = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#2d3436',
  margin: '0 0 8px 0'
};

const fieldDescriptionStyle = {
  color: '#636e72',
  margin: 0,
  lineHeight: '1.5'
};

const statsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  background: '#f8f9fa',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '20px'
};

const statItemStyle = {
  textAlign: 'center',
  flex: 1
};

const statValueStyle = {
  display: 'block',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#2d3436'
};

const statLabelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#636e72',
  marginTop: '4px'
};

const fieldFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const audienceBadgeStyle = {
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'white'
};

const viewButtonStyle = {
  background: 'transparent',
  border: '2px solid #667eea',
  color: '#667eea',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

// Modal Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalStyle = {
  background: 'white',
  borderRadius: '15px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '25px',
  borderBottom: '2px solid #f0f0f0'
};

const modalTitleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2d3436'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#636e72',
  padding: '5px'
};

const questionsContainerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '25px'
};

const questionsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const questionCardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  padding: '20px',
  background: '#fafafa'
};

const questionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '15px'
};

const questionNumberStyle = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#2d3436'
};

const difficultyBadgeStyle = {
  padding: '4px 8px',
  background: '#f39c12',
  color: 'white',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: '600'
};

const questionTextStyle = {
  fontSize: '1rem',
  color: '#2d3436',
  lineHeight: '1.6',
  margin: '0 0 15px 0'
};

const optionsStyle = {
  marginBottom: '15px'
};

const optionsTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#636e72',
  margin: '0 0 10px 0'
};

const optionStyle = {
  padding: '10px 15px',
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const optionLabelStyle = {
  fontWeight: 'bold',
  color: '#2d3436'
};

const correctBadgeStyle = {
  background: '#28a745',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '0.7rem',
  fontWeight: '600',
  marginLeft: 'auto'
};

const questionFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.8rem',
  color: '#636e72'
};

const timeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const explanationStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const modalFooterStyle = {
  padding: '20px 25px',
  borderTop: '2px solid #f0f0f0',
  textAlign: 'right'
};

const doneButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  fontSize: '1.1rem',
  color: '#636e72'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#636e72',
  fontSize: '1.1rem'
};
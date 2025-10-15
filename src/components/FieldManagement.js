import { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function FieldManagement() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultTimePerQuestion: 30,
    for: 'general'
  });

  // Fetch all fields
  const fetchFields = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/fields');
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
      alert('Error fetching fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultTimePerQuestion' ? parseInt(value) : value
    }));
  };

  // Create new field
  const handleCreateField = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/fields', formData);
      setFields(prev => [data, ...prev]);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        defaultTimePerQuestion: 30,
        for: 'general'
      });
      alert('Field created successfully!');
    } catch (error) {
      console.error('Error creating field:', error);
      alert('Error creating field');
    }
  };

  // Update field
  const handleUpdateField = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/admin/fields/${editingField._id}`, formData);
      setFields(prev => prev.map(field => 
        field._id === editingField._id ? data : field
      ));
      setEditingField(null);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        defaultTimePerQuestion: 30,
        for: 'general'
      });
      alert('Field updated successfully!');
    } catch (error) {
      console.error('Error updating field:', error);
      alert('Error updating field');
    }
  };

  // Delete field
  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    
    try {
      await api.delete(`/admin/fields/${fieldId}`);
      setFields(prev => prev.filter(field => field._id !== fieldId));
      alert('Field deleted successfully!');
    } catch (error) {
      console.error('Error deleting field:', error);
      alert('Error deleting field');
    }
  };

  // Edit field
  const handleEditField = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      description: field.description,
      defaultTimePerQuestion: field.defaultTimePerQuestion,
      for: field.for
    });
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingField(null);
    setFormData({
      name: '',
      description: '',
      defaultTimePerQuestion: 30,
      for: 'general'
    });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Field Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          style={addButtonStyle}
        >
          + Add New Field
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div style={formOverlayStyle}>
          <div style={formStyle}>
            <h2 style={formTitleStyle}>
              {editingField ? 'Edit Field' : 'Create New Field'}
            </h2>
            <form onSubmit={editingField ? handleUpdateField : handleCreateField}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Field Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{...inputStyle, height: '80px'}}
                  rows="3"
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Default Time Per Question (seconds) *</label>
                <input
                  type="number"
                  name="defaultTimePerQuestion"
                  value={formData.defaultTimePerQuestion}
                  onChange={handleInputChange}
                  style={inputStyle}
                  min="1"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Target Audience *</label>
                <select
                  name="for"
                  value={formData.for}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                >
                  <option value="general">General</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div style={buttonGroupStyle}>
                <button type="submit" style={submitButtonStyle}>
                  {editingField ? 'Update Field' : 'Create Field'}
                </button>
                <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fields List */}
      {loading ? (
        <div style={loadingStyle}>Loading fields...</div>
      ) : (
        <div style={gridStyle}>
          {fields.map(field => (
            <div key={field._id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={fieldNameStyle}>{field.name}</h3>
                <span style={{
                  ...badgeStyle,
                  background: field.for === 'Student' ? '#e74c3c' : '#3498db'
                }}>
                  {field.for}
                </span>
              </div>
              
              <p style={descriptionStyle}>{field.description}</p>
              
              <div style={detailsStyle}>
                <div style={detailItemStyle}>
                  <span style={detailLabelStyle}>Time per Question:</span>
                  <span style={detailValueStyle}>{field.defaultTimePerQuestion}s</span>
                </div>
                <div style={detailItemStyle}>
                  <span style={detailLabelStyle}>Created:</span>
                  <span style={detailValueStyle}>
                    {new Date(field.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={actionButtonsStyle}>
                <button 
                  onClick={() => handleEditField(field)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteField(field._id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
                <button style={viewQuestionsButtonStyle}>
                  View Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fields.length === 0 && !loading && (
        <div style={emptyStateStyle}>
          <p>No fields found. Create your first field to get started!</p>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #f0f0f0'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: 0
};

const addButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const formOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const formStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const formTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2d3436'
};

const inputGroupStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#2d3436'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '2px solid #ddd',
  borderRadius: '8px',
  fontSize: '1rem',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s ease'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px'
};

const submitButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  flex: 1
};

const cancelButtonStyle = {
  background: '#95a5a6',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  flex: 1
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  background: 'white',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '15px'
};

const fieldNameStyle = {
  margin: '0',
  fontSize: '1.3rem',
  fontWeight: 'bold',
  color: '#2d3436'
};

const badgeStyle = {
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'white'
};

const descriptionStyle = {
  color: '#636e72',
  margin: '0 0 15px 0',
  lineHeight: '1.5'
};

const detailsStyle = {
  background: '#f8f9fa',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px'
};

const detailItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px'
};

const detailLabelStyle = {
  fontWeight: '600',
  color: '#2d3436'
};

const detailValueStyle = {
  color: '#636e72'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const editButtonStyle = {
  background: '#3498db',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  flex: 1
};

const deleteButtonStyle = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  flex: 1
};

const viewQuestionsButtonStyle = {
  background: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  width: '100%',
  marginTop: '5px'
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
import React, { useEffect, useState } from 'react'
import api from '../utils/axios'

export default function FieldDropdown({ value, onChange, allowCreate=true }) {
  const [fields, setFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/fields') // backend route
        setFields(data)
      } catch (err) { console.error(err) }
    })()
  }, [])

  const createField = async () => {
    if (!newFieldName.trim()) return;
    try {
      setCreating(true)
      const { data } = await api.post('/admin/fields', { name: newFieldName })
      setFields(prev => [data, ...prev])
      onChange(data._id)
      setNewFieldName('')
    } catch (err) {
      console.error(err)
    } finally { setCreating(false) }
  }

  return (
    <div>
      <select value={value || ''} onChange={e => onChange(e.target.value)}>
        <option value="">-- Select Field / Exam --</option>
        {fields.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
      </select>

      {allowCreate && (
        <div style={{ marginTop: 8 }}>
          <input value={newFieldName} onChange={e => setNewFieldName(e.target.value)} placeholder="Create new field name" />
          <button onClick={createField} disabled={creating || !newFieldName.trim()}>
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../utils/axios'

export default function AdminPayments() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/admin/payments/pending')
      setRows(data || [])
    } catch (e) {
      setErr(e?.response?.data?.error || 'Auth error (need admin token)')
    }
  }

  const verify = async (id, action) => {
    await api.post(`/admin/payments/${id}/verify`, { action })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="container">
      <h2>Admin: Pending Payments</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Order</th><th>User</th><th>Quiz</th><th>Amount</th><th>UTR</th><th>Screenshot</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.order_id}</td>
              <td>{r.name} ({r.email})</td>
              <td>{r.quiz_title}</td>
              <td>₹{r.amount}</td>
              <td>{r.utr || '-'}</td>
              <td>{r.screenshot_url ? <a href={`http://localhost:4000${r.screenshot_url}`} target="_blank">View</a> : '-'}</td>
              <td>
                <button onClick={() => verify(r.id, 'success')}>Success</button>
                <button onClick={() => verify(r.id, 'failed')} style={{marginLeft:6}}>Fail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{marginTop:12}}>Note: Login admin@example.com / Admin@123</p>
    </div>
  )
}

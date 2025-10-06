import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/axios'

export default function JoinQuiz() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [qr, setQr] = useState(null)
  const [utr, setUtr] = useState('')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await api.post('/payments/order', { quiz_id: id })
      setOrder(data)
      const qrRes = await api.get(`/payments/${data.order_id}/qr`)
      setQr(qrRes.data)
    })()
  }, [id])

  const submitUtr = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('utr', utr)
    if (file) form.append('screenshot', file)
    const { data } = await api.post(`/payments/${order.order_id}/utr`, form)
    setMsg(data.message)
  }

  if (!order || !qr) return <div className="container">Loading…</div>

  return (
    <div className="container">
      <h2>Join Quiz</h2>
      <div className="card">
        <div>Order: <b>{order.order_id}</b></div>
        <div>Amount: ₹{order.amount}</div>
        <img src={qr.qr_data_url} alt="UPI QR" style={{ width: 280 }} />
        <div style={{ wordBreak: 'break-all' }}>{qr.upi_uri}</div>
      </div>

      <form onSubmit={submitUtr} className="card">
        <label>Enter Bank UTR/Ref No.</label>
        <input value={utr} onChange={e => setUtr(e.target.value)} required />
        <label>Upload Screenshot (optional)</label>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Submit UTR</button>
      </form>

      {msg && <p style={{color:'green'}}>{msg}</p>}
      <p>Note: Admin verification ke baad “Start Quiz” unlock hoga.</p>
    </div>
  )
}

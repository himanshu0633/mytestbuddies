import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { Link } from 'react-router-dom'
import { LogoutButton } from '../components/authCommon'
import Navbar from '../components/navbar'
export default function Dashboard() {
  const [me, setMe] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/auth/me')
      setMe(data)
      const q = await api.get('/quizzes')
      setQuizzes(q.data || [])
    })()
  }, [])

  return (
    <>
    <Navbar />
    <div className="container">
      <h2>Dashboard</h2>
      <div className="card">
        <p>Welcome, {me?.name || 'Student'}</p>
        <LogoutButton />
      </div>

      <h3>Available Quizzes</h3>
      {quizzes.map(q => (
        <div className="card" key={q._id}>
          <b>{q.title}</b>
          <div>Price: ₹{q.price} • Duration: {q.duration_minutes} min</div>
          <Link to={`/quiz/${q._id}/join`}><button>Join / Pay</button></Link>
        </div>
      ))}
    </div>
  </>)
}

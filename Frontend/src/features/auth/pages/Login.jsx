import React, { useState } from 'react'
import { useNavigate ,Navigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import {useSelector} from 'react-redux'
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

const user=useSelector(state=> state.auth.user)
const loading=useSelector(state=> state.auth.loading)

  const {handleLogin} = useAuth()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    await handleLogin(formData)
    navigate('/')
  }

if (!loading && user) {
    return <Navigate to='/' replace />
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-black from-cyan-900 via-blue-900 to-violet-900 text-white p-6">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur rounded-2xl border border-cyan-500/30 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
        <h1 className='text-3xl font-bold mb-6 text-center tracking-wide'>Welcome Back</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full px-4 py-3 rounded-xl border border-cyan-300/40 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full px-4 py-3 rounded-xl border border-cyan-300/40 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition'
              placeholder='••••••••'
            />
          </div>

          <button type='submit' className='w-full py-3 rounded-xl bg-cyan-600 from-cyan-400 to-blue-500 text-slate-900 font-semibold hover:scale-105 transform transition'>
            Login
          </button>
        </form>

        <p className='mt-5 text-sm text-cyan-200 text-center'>
          Don’t have an account?{' '}
          <button
            type='button'
            onClick={() => navigate('/register')}
            className='font-semibold text-cyan-300 hover:text-white '
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login

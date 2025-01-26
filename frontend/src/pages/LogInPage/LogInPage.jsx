import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();


  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      setErrorMsg('Log In Failed - Try Again');
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  return (
    <>
      <h2>Log In!</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          name="email"
          id="login-email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          name="password"
          id="login-password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" id="login-submit">LOG IN</button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}
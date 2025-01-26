import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

export default function SignUpPage({setUser}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }
  async function handleSubmit(evt){
    evt.preventDefault();
    try {
      const user = await authService.signUp(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.log(err);
      setErrorMsg('Sign Up Failed - Try Again');    }
  }
  

  const disable = formData.password !== formData.confirm;

  return (
    <>
      <h2>Sign Up!</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <label htmlFor="signup-name">Name</label>
        <input
          type="text"
          name="name"
          id="signup-name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="signup-email">Email</label>
        <input
          type="email"
          name="email"
          id="signup-email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="signup-password">Password</label>
        <input
          type="password"
          name="password"
          id="signup-password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="signup-confirm">Confirm Password</label>
        <input
          type="password"
          name="confirm"
          id="signup-confirm"
          value={formData.confirm}
          onChange={handleChange}
          required
        />
        <button type="submit" id="signup-submit" disabled={disable}>
          SIGN UP
        </button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}
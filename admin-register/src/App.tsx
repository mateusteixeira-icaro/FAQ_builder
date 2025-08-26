import React, { useState } from 'react';

interface AdminData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function App() {
  const [formData, setFormData] = useState<AdminData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('All fields are required');
      setMessageType('error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        setMessage('Administrator registered successfully!');
        setMessageType('success');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Registration failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const goToMainApp = () => {
    window.open('http://localhost:3000', '_blank');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            Admin Registration
          </h1>
          <p className="card-description">
            Cirex Help Center - Register a new administrator
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password (min. 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          {message && (
            <div className={`message ${
              messageType === 'success' ? 'message-success' : 'message-error'
            }`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit" 
            className="button button-primary w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register Administrator'}
          </button>
        </form>
        
        <div className="divider">
          <button 
            type="button"
            className="button button-outline w-full" 
            onClick={goToMainApp}
          >
            Go to Help Center
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
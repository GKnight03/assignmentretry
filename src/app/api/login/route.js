'use client';

import { useState } from 'react'; // useState is now safe to use
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // This is the correct way to handle navigation in Next.js 13

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simulate login process and check if the user is a customer or manager
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Log the API response to see what data looks like
    console.log(data);

    if (data.success) {
      if (data.user && data.user.acc_type === 'manager') {
        router.push('/manager'); // Redirect to manager dashboard if manager
      } else if (data.user && data.user.acc_type === 'customer') {
        router.push('/menu'); // Redirect to the menu if customer
      } else {
        setError('Invalid account type.');
      }
    } else {
      setError(data.message || 'Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log In</button>
      {error && <p>{error}</p>}
    </form>
  );
}

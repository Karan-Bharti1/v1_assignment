import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { loginAPI } from '../../utils/api';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginAPI(data.email, data.password);
      login(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded mt-10 bg-white shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: true })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: true })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm font-semibold">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

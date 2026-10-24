'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './SignUpPage.module.css';

const SignUp = () => {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setIsLoading(true);

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const user = await register({ email, password });

      setUser(user);

      router.replace('/profile');
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        if (message === 'User exists') {
          setError('User with this email already exists');
        } else if (err.response?.status === 400) {
          setError('Password must be at least 6 characters long');
        } else {
          setError(message || 'Registration failed');
        }
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            minLength={6}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>

        {error && (
          <p className={css.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
};

export default SignUp;

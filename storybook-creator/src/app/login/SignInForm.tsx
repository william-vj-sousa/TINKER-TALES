import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', fullName: '', role: 'Teacher', password: '', subscribe: true});
  const [error, setError] = useState<string | null>(null);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;

    setFormData((prev) => ({
        ...prev,
        [target.name]: value,
    }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await pb.collection('users').authWithPassword(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password');
      console.error('Login failed:', err);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">

      <h2 className="text-3xl w-[300px] font-bold pb-6">Sign In</h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-500"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:opacity-90"
      >
        Sign In
      </button>

        <p className="text-center text-sm mt-4">
          Don't Have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
          </Link>
        </p>
    </form>
  );
}

"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'Teacher',
    password: '',
    subscribe: true,
  });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    const value =
        target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setFormData((prev) => ({
        ...prev,
        [target.name]: value,
    }));
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);

    // ✅ Navigate to /welcome or any other page
    router.push('/login');
    };

    
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">

      <h2 className="text-3xl font-bold pb-6">Create your Account</h2>

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
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Your Role <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-purple-500"
        >
          <option>Teacher</option>
          <option>Student</option>
          <option>Admin</option>
        </select>
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

      <div className="flex items-center">
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm">Email me about product news.</label>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:opacity-90"
      >
        Sign Up
      </button>

     <p className="text-center text-sm mt-4">
        Have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
            Sign In
        </Link>
    </p>
    
    </form>
  );
}

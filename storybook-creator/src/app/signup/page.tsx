"use client";
import '../globals.css';
import SignupForm from './SignUpForm';

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      {/* Left: Signup Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <SignupForm />
      </div>

      {/* Right: Image */}
      <div
        className="flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/teacher-home.png)' }}
      />
    </div>
  );
}

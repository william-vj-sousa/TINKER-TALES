// app/page.tsx (or your entry point)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";

export default function Home() {
  const [step, setStep] = useState(1);
  const [classroomCode, setClassroomCode] = useState(["", "", "", "", ""]);
  const [authorName, setAuthorName] = useState("");
  const router = useRouter()
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

const beginBook = async () => {
  try {
    const code = classroomCode.join(''); // e.g., "17531"

    // 1. Create student in the "users" collection (not "students") since "students" is a relation to "users"
    // If you actually have a separate "students" collection, skip this or clarify
    const newStudent = await pb.collection('students').create({
      name: authorName,
    });

    // 2. Find story group by joinId array stored in settings.joinId (JSON array)
    // Since you can't query JSON arrays directly, you should add a string field or query all and filter client-side
    const groups = await pb.collection('story_groups').getFullList();

    // Find matching group by comparing joinId array as string
    const group = groups.find(g => (g.settings?.joinId ?? '') === code);

    if (!group) throw new Error('Story group not found');

    // 3. Get existing student IDs, ensure array of strings
    const existingStudentIds = (group.students || []).map((s: any) => s);
    console.log("existing students:", existingStudentIds)

    // 4. Create a unique array of student IDs (no duplicates)
    const updatedStudents = Array.from(new Set([...existingStudentIds, newStudent.id]));

    // 5. Update story group relation field "students" with updated array of IDs
    console.log(updatedStudents)
    await pb.collection('story_groups').update(group.id, {
      students: updatedStudents,
    });

    // 6. Redirect after success
    router.push('/');
  } catch (err) {
    console.error('Failed to begin book:', err);
  }
};

  return (
    <div className="flex h-screen w-screen">
      {/* Left Panel */}
      <div className="flex flex-1 items-center justify-center bg-white">
        {step === 1 && (
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">Story Builder</h1>
            <p className="text-sm text-gray-500 italic">Classroom Code</p>
            <div className="flex space-x-2">
              {classroomCode.map((digit, idx) => (
                <input
                  key={idx}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d?$/.test(value)) {
                      const updated = [...classroomCode];
                      updated[idx] = value;
                      setClassroomCode(updated);
                    }
                  }}
                  className="w-10 h-12 text-xl text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <button
              onClick={nextStep}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
        <div className="flex flex-col items-center space-y-6">
            <label htmlFor="author" className="text-2xl font-semibold text-gray-900">
            Author’s Name
            </label>
            <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="px-4 py-2 w-64 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
            />

            <div className="flex space-x-4 mt-4">
            <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
                Back
            </button>
            <button
                onClick={beginBook}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            >
                Begin
            </button>
            </div>
        </div>
        )}
      </div>

      <div
        className="flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/teacher-home.png)" }}
      />
    </div>
  );
}

"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { group } from "console";
import { useStoryGroupsStore } from "@/store/storyGroupStore";
import { createDefaultStoryGroup } from "@/store/storyGroupStore";
import { StorySettings } from "@/store/storyGroupStore";


interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default function GroupDetailPage({ params }: GroupPageProps) {
  // 1. Resolve the server‐side params promise
  const { id } = use(params);

  // 2. Local state
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [joinId, setJoinId] = useState<string | null>(null);
  const [groupSettings, setGroupSettings] = useState<StorySettings | null>(null);

    // Load from Zustand store on open
    // useEffect(() => {


    //     const { storyGroups, fetchStoryGroups} = useStoryGroupsStore();
    //     fetchStoryGroups()

    //     const selectedGroup = storyGroups.find(g => g.id === id);
    //     if (selectedGroup) {
    //         setLocalSettings(selectedGroup.settings);
    //     }
    // }, []);

  // 3. Fetch group → student IDs → student records
  useEffect(() => {
    let cancelled = false;

    async function fetchConnectedStudents() {
      setLoading(true);
      setError(null);

      try {
        // a) Fetch the group (disable autoCancel so it won't be aborted)
        const group = await pb
          .collection("story_groups")
          .getOne(id, { $autoCancel: false });

        setGroupSettings(group?.settings ?? null)
        // b) Get the relation IDs array
        const studentIds: string[] = Array.isArray(group.students)
          ? group.students
          : [];

        if (studentIds.length === 0) {
          if (!cancelled) setStudents([]);
          return;
        }

        // c) Build filter: id="..." || id="..." ...
        const filter = studentIds.map((sid: string) => `id="${sid}"`).join(" || ");

        // d) Fetch all matching student records
        const allStudents = await pb
          .collection("students")
          .getFullList({ filter, $autoCancel: false });

        if (!cancelled) setStudents(allStudents);
      } catch (err) {
        console.error("Failed to load students:", err);
        if (!cancelled) setError("Failed to load student data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    fetchConnectedStudents();
    
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 4. Render
  

  const joinUrl = "http://localhost:3000/join";

  return (
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex flex-1 flex-col bg-gray-100 p-6">
    <h1 className="text-4xl font-semibold mb-6">{groupSettings?.groupName}</h1>

    <div className="flex flex-col flex-grow align-center mt-16">
      {/* Join Group Card */}
      <div className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto border w-[48rem]">
        <h2 className="text-xl font-semibold mb-2">Join Group</h2>
        <p className="text-sm text-gray-600">Enter this code:</p>
        <div className="text-5xl font-bold my-4 tracking-widest">
          {groupSettings?.joinId}
        </div>
        <p className="text-sm text-gray-600 mb-2">or visit:</p>
        <Link href={joinUrl} className="text-blue-500 underline" target="_blank">
          {joinUrl}
        </Link>
      </div>

      {/* Student List */}
      <div className="mt-6 max-w-md mx-auto">
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-gray-600 text-center">0 Students Have Joined</p>
        ) : (
          <ul className="space-y-2">
            {students.map((stu) => (
              <li key={stu.id} className="bg-white p-4 rounded shadow">
                {stu.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </main>
</div>
  );
}

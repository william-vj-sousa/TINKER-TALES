"use client"
import { useState } from 'react';
import Sidebar from './Sidebar';
import StoryGroupCard from './StoryGroupCard';
import ModalForm from './ModalForm';
import { useStoryGroupsStore } from '@/store/storyGroupStore';
import { createDefaultStoryGroup } from '@/store/storyGroupStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import pb from '@/lib/pocketbase';

const randomFiveDigits = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const user = pb.authStore.record;
  const router = useRouter();
  const pathname = usePathname();

  const fetchStoryGroups    = useStoryGroupsStore(state => state.fetchStoryGroups);
  const storyGroups         = useStoryGroupsStore(state => state.storyGroups);
  const addGroup            = useStoryGroupsStore(state => state.addGroup);
  const setSelectedGroupId  = useStoryGroupsStore(state => state.setSelectedGroupId);


  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'teacher') {
      router.push('/unauthorized');
      return;
    }
    fetchStoryGroups();
  }, []);


  const handleNewGroup = () => {
      const temp_id = `temp-${crypto.randomUUID()}`
      const newGroup = createDefaultStoryGroup(temp_id,randomFiveDigits());
      setSelectedGroupId(temp_id);
      addGroup(newGroup);
      setModalOpen(true);
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Story Groups</h1>
        <div className="flex gap-6 flex-wrap">
          {
            storyGroups.map((group) => (
              <StoryGroupCard
                key = {group.id}
                title={group.settings.groupName!}
                image="/assets/story-group-1.png"
                onClick={
                  () => {
                    router.push(`/groups/${group.id}`);
                  }
                }
                onEdit={
                  () => {
                    setSelectedGroupId(group.id);
                    setModalOpen(true);
                  }
                }
              />
            ))
          }

          <div
            onClick={() => handleNewGroup()}
            className="w-64 h-56 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <span className="text-center">+ New Group</span>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <ModalForm setModalOpen={setModalOpen}/>
      )}
    </div>
  );
}

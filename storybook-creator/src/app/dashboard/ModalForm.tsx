"use client"

import Slider from "./Slider";  
import ModalToggle from "./Toggle";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useStoryGroupsStore } from "@/store/storyGroupStore";
import { StorySettings } from "@/store/storyGroupStore";
import { createDefaultStoryGroup } from "@/store/storyGroupStore";
import { FontSizeDropdown } from "./FontDropDown";
import pb from "@/lib/pocketbase";

interface ModalFormProps {
    setModalOpen: (bool: boolean) => void;
}



const ModalForm:React.FC<ModalFormProps> = ({setModalOpen}) => {
    const { storyGroups, selectedGroupId, updateGroupSettings, deleteGroup, saveAllGroups, fetchStoryGroups} = useStoryGroupsStore();
    const group = storyGroups.find(g => g.id === selectedGroupId);
    const [localSettings, setLocalSettings] = useState(group ? group.settings : createDefaultStoryGroup(`temp-${crypto.randomUUID()}`, "00000").settings); // think this may be confused for handle new group on that sahboard, should double check and refactor accordingly
    const [isEditingName, setIsEditingName] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load from Zustand store on open
    useEffect(() => {
        const selectedGroup = storyGroups.find(g => g.id === selectedGroupId);
        if (selectedGroup) {
            setLocalSettings(selectedGroup.settings);
        }
    }, [storyGroups, selectedGroupId]);

    useEffect(() => {
        if (isEditingName) inputRef.current?.focus();
    }, [isEditingName]);

    const handleChange = (field: keyof typeof localSettings, value: any) => {
        setLocalSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
      if (selectedGroupId !== null) {
          updateGroupSettings(selectedGroupId, localSettings);
          await saveAllGroups();
          fetchStoryGroups();
      }
        setModalOpen(false);
    };

    const handleCancel = () => {
             
        setModalOpen!(false);
    };

    const handleDelete = async () => {
      deleteGroup(selectedGroupId)
      await pb.collection('story_groups').delete(selectedGroupId);
      setModalOpen(false);
    }

    return(
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
          <div className="relative bg-white p-6 rounded-lg w-[42rem] shadow-lg">
            
            <button
              className="absolute left-4 top-4 text-gray-300 hover:text-red-600 text-2xl"
              onClick={() => setModalOpen!(false)}>×
            </button>
            
            {/* <h2 className="text-3xl font-semibold mb-8 text-center">{localSettings.groupName}</h2> */}

            <div className="relative mb-8 flex justify-center">
              {isEditingName ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="text-3xl font-semibold text-center border-b border-gray-400 outline-none"
                  value={localSettings.groupName}
                  onChange={(e) => handleChange("groupName", e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      setIsEditingName(false);
                    }
                  }}
                />
              ) : (
                <h2 className="text-3xl font-semibold text-center cursor-pointer group relative"
                  onClick={() => setIsEditingName(true)}
                >
                  {localSettings.groupName || (
                    <span className="text-gray-400">(e.g. Summer Vacation Stories)</span>
                  )}
                  {/* Edit icon */}
                  <span className="absolute top-4">
                    <svg
                      className="m-1"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.362 4.487L19.049 2.799C19.4007 2.44733 19.8777 2.24976 20.375 2.24976C20.8724 2.24976 21.3493 2.44733 21.701 2.799C22.0527 3.15068 22.2503 3.62766 22.2503 4.125C22.2503 4.62235 22.0527 5.09933 21.701 5.451L11.082 16.07C10.5533 16.5984 9.90137 16.9867 9.185 17.2L6.5 18L7.3 15.315C7.51328 14.5986 7.90164 13.9467 8.43 13.418L17.362 4.487ZM17.362 4.487L20 7.125M18.5 14V18.75C18.5 19.3467 18.263 19.919 17.841 20.341C17.419 20.763 16.8467 21 16.25 21H5.75C5.15326 21 4.58097 20.763 4.15901 20.341C3.73705 19.919 3.5 19.3467 3.5 18.75V8.25001C3.5 7.65327 3.73705 7.08097 4.15901 6.65901C4.58097 6.23706 5.15326 6 5.75 6H10.5"
                        stroke="#525252"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </h2>
              )}
            </div>





            {/* Layout Settings Section */}
            <div className='flex row'>
                {/* Left side */}
                <div className='w-[10rem]'>
                  <div className='text-gray-400'>Layout Settings</div>
                </div>

                {/* Right side */}
                <div className='flex-grow'>

                                     
                  <div className="flex gap-8 w-full  items-center mb-4">
                    {/* Bifold Option */}
                    <div
                      className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${
                        localSettings.bookLayout === "bifold" ? "bg-blue-100 border-blue-400" : ""
                      }`}
                      onClick={() => handleChange("bookLayout", "bifold")}
                    >
                      <svg width="78" height="71" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="35" height="63" rx="9" fill="#D9D9D9"/>
                        <rect x="73" y="42" width="8" height="27" rx="4" transform="rotate(90 73 42)" fill="#D9D9D9"/>
                        <rect x="73" y="30" width="8" height="27" rx="4" transform="rotate(90 73 30)" fill="#D9D9D9"/>
                        <rect x="73" y="18" width="8" height="27" rx="4" transform="rotate(90 73 18)" fill="#D9D9D9"/>
                        <rect x="0.25" y="0.25" width="77.5" height="70.5" rx="6.75" stroke="#979797" strokeWidth="0.5"/>
                        <path d="M42.5 0.5V71" stroke="#CBCBCB" strokeDasharray="2 2"/>
                      </svg>
                      <div className="mt-1">Bifold</div>
                    </div>

                    {/* Unifold Option */}
                    <div
                      className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${
                        localSettings.bookLayout === "unifold" ? "bg-blue-100 border-blue-400" : ""
                      }`}
                      onClick={() => handleChange("bookLayout", "unifold")}
                    >
                      <svg width="78" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="75" y="9" width="41" height="71" rx="9" transform="rotate(90 75 9)" fill="#D9D9D9"/>
                        <rect x="59" y="55" width="8" height="40" rx="4" transform="rotate(90 59 55)" fill="#D9D9D9"/>
                        <rect x="0.25" y="0.25" width="77.5" height="70.5" rx="6.75" stroke="#979797" strokeWidth="0.5"/>
                        <path d="M39 1V71.5" stroke="#898989" strokeOpacity="0.35" strokeDasharray="2 2"/>
                      </svg>
                      <div className="mt-1">Unifold</div>
                    </div>
                  </div>

                    
                    <FontSizeDropdown value={localSettings.fontSize} onChange={(val) => handleChange("fontSize", val)}/>

                    {/* Num Pages Element */}
                    <div className='flex justify-between items-center'>
                      <p >Number of Pages</p>
                      
                      <div className="flex justify-between items-center gap-2 w-[10rem] ">
                        {/* Min Input */}
                        <div className="flex flex-col items-center">
                          <input
                            type="text"
                            placeholder="0"
                            className="border p-2 rounded w-[4rem] text-center placeholder:text-center"
                            onChange={(e) => handleChange("minNumPages", e.target.value)}
                            value={localSettings.minNumPages}
                          />
                          <span className="text-xs text-gray-500 mt-1 ">MIN</span>
                        </div>

                        {/* Dash */}
                        <span className="mb-6">-</span>

                        {/* Max Input */}
                        <div className="flex flex-col items-center">
                          <input
                            type="text"
                            placeholder="&#8734;"
                            className="border p-2 rounded w-[4rem] text-center placeholder:text-center"
                            onChange={(e) => handleChange("maxNumPages", e.target.value)}
                            value={localSettings.maxNumPages}
                          />
                          <span className="text-xs text-gray-500 mt-1 ">MAX</span>
                        </div>
                      </div>
                    </div>


                    {/* <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p className='w-full'>Age Group</p>
                      <Slider
                      onChange={(val) => handleChange("ageGroup", val)}
                      value={localSettings.ageGroup!}
                      />
                    </div>
                    
                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Grammar Assistant</p>
                      <ModalToggle
                      checked={localSettings.grammarAssistant!}
                      onChange={(val) => handleChange("grammarAssistant", val)}
                      />
                    </div>
                    
                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Voice Assistant</p>
                      <ModalToggle
                      checked={localSettings.voiceAssistant!}
                      onChange={(val) => handleChange("voiceAssistant", val)}
                      />
                    </div>

                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Image Verification</p>
                      <ModalToggle
                      checked={localSettings.imageVerification!}
                      onChange={(val) => handleChange("imageVerification", val)}
                      />
                    </div> */}


                </div>
            </div>
            
            {/* Excercise Settings Section */}
            <div className='flex row mt-6'>
                {/* Left side */}
                <div className='w-[10rem]'>
                    <div className='text-gray-400'>Excercise Settings</div>         
                </div>

                {/* Right side */}

                <div className='flex-grow'>
                    <p>Excercise Descrption</p>
                    <textarea
                      placeholder="(e.g. Students will tell a story about their summer vacation with at least 3 different characters.)"
                      className="w-full border p-2 rounded mb-3 h-32"
                      onChange={(e) => handleChange("excerciseDescription", e.target.value)}
                      value={localSettings.excerciseDescription}
                    />

                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p className='w-full'>Age Group</p>
                      <Slider
                      onChange={(val) => handleChange("ageGroup", val)}
                      value={localSettings.ageGroup!}
                      />
                    </div>
                </div>
            </div>



            {/* AI Settings Section */}
            <div className='flex row mt-6'>
                {/* Left side */}
                <div className='w-[10rem]'>
                  <div className='flex flex-col justify-between h-full'>       
                    <div className='text-gray-400'>Assistant Settings</div>    
                    <button
                      className="px-4 py-2 text-red-600"
                      onClick={() => handleDelete()}
                    >Delete
                    </button>
                  </div>


                </div>

                {/* Right side */}

                <div className='flex-grow'>
                    




                    
                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Grammar Assistant</p>
                      <ModalToggle
                      checked={localSettings.grammarAssistant!}
                      onChange={(val) => handleChange("grammarAssistant", val)}
                      />
                    </div>
                    
                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Voice Assistant</p>
                      <ModalToggle
                      checked={localSettings.voiceAssistant!}
                      onChange={(val) => handleChange("voiceAssistant", val)}
                      />
                    </div>

                    <div className='flex justify-between w-full pl-4 pr-4 pt-4'>
                      <p>Image Verification</p>
                      <ModalToggle
                      checked={localSettings.imageVerification!}
                      onChange={(val) => handleChange("imageVerification", val)}
                      />
                    </div>


                    
                    <div className="flex justify-end gap-2 mt-8">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => handleCancel()}
                      >Cancel</button>
                      
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleSave()}
                      >Save</button>
                    </div> 

                      {/* </div> */}
   
                </div>
            </div>
            
            



          </div>
        </div>
    )
}

export default ModalForm
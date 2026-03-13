"use client"
import Image from "next/image";
import { useStoryGroupsStore } from "@/store/storyGroupStore";


type StoryGroupCardProps = {
  title: string;
  subtitle?: string;
  image: string;
  onClick?: () => void;
  onEdit?: () => void;
};


const StoryGroupCard: React.FC<StoryGroupCardProps> = ({ title, subtitle, image, onEdit, onClick}) => {
  // const storyGroups = useStoryGroupsStore((state) => state.storyGroups);

  return (
    <div className="w-64 text-center cursor-pointer">
      <div className="relative group overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={image}
          alt={title}
          width={256}
          height={160}
          className="rounded-xl object-cover"
           onClick={onClick}
        />

      <button
        onClick={onEdit}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out flex items-center justify-center w-9 h-9 bg-white/80 rounded-lg shadow"
      >
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.362 4.487L19.049 2.799C19.4007 2.44733 19.8777 2.24976 20.375 2.24976C20.8724 2.24976 21.3493 2.44733 21.701 2.799C22.0527 3.15068 22.2503 3.62766 22.2503 4.125C22.2503 4.62235 22.0527 5.09933 21.701 5.451L11.082 16.07C10.5533 16.5984 9.90137 16.9867 9.185 17.2L6.5 18L7.3 15.315C7.51328 14.5986 7.90164 13.9467 8.43 13.418L17.362 4.487ZM17.362 4.487L20 7.125M18.5 14V18.75C18.5 19.3467 18.263 19.919 17.841 20.341C17.419 20.763 16.8467 21 16.25 21H5.75C5.15326 21 4.58097 20.763 4.15901 20.341C3.73705 19.919 3.5 19.3467 3.5 18.75V8.25001C3.5 7.65327 3.73705 7.08097 4.15901 6.65901C4.58097 6.23706 5.15326 6 5.75 6H10.5"
            stroke="#525252"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
        
      </div>
      <div className="mt-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
};

export default StoryGroupCard;
import { useState } from "react";
import { useBookStore } from "@/store/useBookStore";
import CharacterModal from "./characterDescriptionModal";

interface EditableTextBoxProps {
  pageNumber: number; // Identify which page to update
  isEditing: boolean;
}

const keywords = ["I", "Me", "You", "Dad", "Mom"];

export default function EditableTextBox({ pageNumber, isEditing }: EditableTextBoxProps) {
  const { book, updatePage } = useBookStore();
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');

  const text = book?.pages[pageNumber - 1].text_content || "";

  const handleSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updatePage(pageNumber, { text_content: newText });
  };

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const parts = text.split(regex);

  const handleKeywordClick = (keyword: string) => {
    setModalContent(`You clicked on keyword: "${keyword}"`);
    setSelectedKeyword(keyword);
    setmodalIsOpen(true);
  };

  const closeModal = () => {
      setmodalIsOpen(false);
    };



  return (
    <>
<div className="w-full h-full flex items-center justify-center p-4">
  {isEditing ? (
    <textarea
      className="w-full h-full max-w-4xl bg-transparent border-none outline-none resize-none font-jacques text-4xl marching-ants bnw"
      value={text}
      onChange={handleSave}
    />
  ) : (
    <div className="whitespace-pre-wrap leading-relaxed text-black text-center font-jacques text-4xl max-w-4xl">
      {parts.map((part, index) => {
        const isKeyword = keywords.some(
          (k) => k.toLowerCase() === part.toLowerCase()
        );
        return isKeyword ? (
          <mark
            key={index}
            onClick={() => handleKeywordClick(part)}
            style={{
              backgroundColor: "#ffeb3b",
              cursor: "pointer",
              fontWeight: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit",
              display: "inline",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </div>
  )}
</div>

      
      {/* Modal */}
      <CharacterModal isOpen={modalIsOpen} closeModal={closeModal} keyword={selectedKeyword}/>

    </>
  );
}

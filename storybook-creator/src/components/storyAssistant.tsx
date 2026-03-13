import { useState, useEffect } from "react";

const StoryAssistant = () => {
  const [isCursorMoved, setIsCursorMoved] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const text = "Hi! Tell me about your summer vacation."; // The text to display
  const typingSpeed = 30; // Speed of typing (ms per character)
  

  // Handle mouse movement to trigger text display
  useEffect(() => {
    const handleMouseMove = () => {
      if (!isCursorMoved) {
        setIsCursorMoved(true);
      }
    };

    const timeoutId = setTimeout(() => {
      setShowText(true);
      
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => {
          if (prevIndex < text.length) {
            return prevIndex + 1;
          }
          clearInterval(interval); // Stop once all text has been shown
          return prevIndex;
        });
      }, typingSpeed);
    }, 500);

    // Event listener for mouse movement
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isCursorMoved]);

  return (
    <div>
      {/* Rectangle at the bottom center */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 bottom-8 p-4 bg-slate-50 bg-opacity-80 text-black  transition-all duration-300 max-w-1/2 rounded-lg shadow-lg ${
          !isCursorMoved ? "opacity-0" : "opacity-100" // Fade in if cursor is moved
        }`}
        style={{ transition: "opacity 0.3s ease" }}
      >
        {/* Typewriter Effect Text */}
        <div className="whitespace-pre-wrap">
          {showText && text.slice(0, currentTextIndex)}
        </div>

        {/* Border Line */}
        <div className="border-t border-gray-200 my-4"></div>

      </div>
    </div>
  );
};

export default StoryAssistant;

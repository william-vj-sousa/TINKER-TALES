'use client';
interface ToggleProps {
  checked: boolean; 
  onChange: (checked: boolean) => void;
  label?: string;
}

const ModalToggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <div className="flex items-center space-x-3">
      {label && <span className="text-gray-700">{label}</span>}
      <button
        onClick={handleToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          checked ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default ModalToggle;

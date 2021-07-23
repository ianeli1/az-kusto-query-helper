export interface ButtonProps {
  children: string;
  onClick: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-gray-700 p-2 m-2 rounded-sm text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

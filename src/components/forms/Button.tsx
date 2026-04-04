// shared/components/Button.tsx

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white p-2 rounded w-full"
    >
      {children}
    </button>
  );
};

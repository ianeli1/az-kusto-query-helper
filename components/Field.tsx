export interface FieldProps {
  value: string;
  onChange: (t: string) => void;
}

export function Field({ onChange, value }: FieldProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border-2 border-blue-300 rounded m-1 p-1"
    />
  );
}

'use client';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Rechercher…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
    />
  );
}

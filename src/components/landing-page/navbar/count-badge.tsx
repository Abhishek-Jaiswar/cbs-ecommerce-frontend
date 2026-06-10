interface CountBadgeProps {
  count: number;
}

export default function CountBadge({ count }: CountBadgeProps) {
  if (count < 1) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c29958] px-1 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

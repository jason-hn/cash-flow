export default function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse bg-gray-100 rounded-md ${className}`}
      aria-label="Loading..."
    />
  );
} 
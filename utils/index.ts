export function getDaysToGoText(eventDate?: string | null): string | null {
  if (!eventDate) return null;

  const parts = eventDate.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;

  const [yyyy, mm, dd] = parts;
  const event = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = event.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(diffDays)) return null;

  if (diffDays > 1) return `${String(diffDays).padStart(2, "0")} days to go`;
  if (diffDays === 1) return "1 day to go";
  if (diffDays === 0) return "Event is today";

  return "Event passed";
}

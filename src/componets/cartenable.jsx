

export default function isCartEnabled(availability) {
  if (!availability) return false;

  const now = new Date();

  // current day as string
  const today = now.toLocaleDateString("en-IN", { weekday: "long" });
  console.log(today)

  // current time in HH:mm format
  const currentTime = now.toTimeString().slice(0, 5);
  console.log(currentTime)

  const { availableDays, availableTime } = availability;

  // check day
  if (!availableDays.includes(today)) return false;

  // check time
  return currentTime >= availableTime.start && currentTime <= availableTime.end;
}

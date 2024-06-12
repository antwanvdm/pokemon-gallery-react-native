function formatMinutes(minutes) {
  if (minutes < 60) {
    return minutes + 'm';
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}h` : `${hours}h${remainingMinutes}m`;
  }
}

export { formatMinutes };

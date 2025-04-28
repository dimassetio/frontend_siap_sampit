// utils/dateFormatter.js

export const dateOptions = {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

export const formatDate = (rawDate) => {
  const formatted = new Intl.DateTimeFormat('id-ID', dateOptions).format(new Date(rawDate));
  return formatted.replace(':', '.').replace(' pukul', ' -');
};

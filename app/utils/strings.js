import { getCalendars } from 'expo-localization';

function dateFormatted(date) {
  let calendar = getCalendars()[0];

  let options = {
    dateStyle: 'short',
    timeZone: calendar.timeZone
  };
  return new Intl.DateTimeFormat('nl-NL', options).format(date);
}

export { dateFormatted };

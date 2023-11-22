import { CalendarEvent } from 'angular-calendar';
import { Playlist } from 'projects/app-api/src/lib/api/models/playlist';
import { RRule } from 'rrule';

export const Color = {
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
};

export interface DsdCalendarEvent extends CalendarEvent {
  rrule?: {
    freq: any;
    byweekday?: any;
  };
  playlist?: Playlist;
}

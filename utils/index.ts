import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);



export const formatDateToTimeAgo = (isoDate: string) => {
  return dayjs(isoDate).fromNow();
};
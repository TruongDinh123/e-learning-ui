import moment from 'moment';

export const getTimePeriod = ({submissionTime}) => {
  const timeMoment = moment(submissionTime);
  const now = moment();

  const momentDiff = timeMoment.diff(now);
  const timeInit = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    timeRefund: null,
  };

  if (momentDiff <= 0) return;

  timeInit.timeRefund = momentDiff;
  timeInit.days = Math.floor(momentDiff / 86400000);

  let milisecondRefund = timeInit.days
    ? momentDiff % (86400000 * timeInit.days)
    : momentDiff % 86400000;

  console.log(milisecondRefund, 'milisecondRefundmilisecondRefund');
  if (milisecondRefund) {
    timeInit.hours = Math.floor(milisecondRefund / 3600000);
    milisecondRefund = timeInit.hours
      ? milisecondRefund % (3600000 * timeInit.hours)
      : milisecondRefund % 3600000;
  }
  if (milisecondRefund) {
    timeInit.minutes = Math.floor(milisecondRefund / 60000);
    milisecondRefund = timeInit.minutes
      ? milisecondRefund % (60000 * timeInit.minutes)
      : milisecondRefund % 60000;
  }
  if (milisecondRefund) {
    timeInit.seconds = Math.floor(milisecondRefund / 1000);
  }

  return timeInit;
};

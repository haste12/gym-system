export const calculateExpirationDate = (paymentDate, monthsCount) => {
  const date = new Date(paymentDate);
  date.setMonth(date.getMonth() + monthsCount);
  return date;
};

export const isExpired = (expirationDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  return expDate < today;
};

export const daysUntilExpiration = (expirationDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  const diff = expDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

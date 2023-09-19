export const getNextMonth = () => {
  const now = new Date();

  now.setMonth(now.getMonth() + 2);
  now.setDate(0);

  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export const parseISODate = (date: string) => {
  const [year, month, day] = date.split("-");

  return { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
};

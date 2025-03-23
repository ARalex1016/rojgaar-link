export const getDateDetails = (dateString, numeric = true) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: numeric ? "numeric" : "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return formattedDate; // e.g. "11 February 2024"
};

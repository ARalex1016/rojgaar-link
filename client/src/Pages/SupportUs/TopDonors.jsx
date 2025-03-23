const donors = [
  {
    name: "Rejina",
    amount: 12,
    message: "Happy to support!",
    keepPrivate: false,
  },
  {
    name: "Aslam",
    amount: 8,
    message:
      "Best of Luck! My name is Aslam. And I'm very happy to be a part of rojgaar link",
    keepPrivate: true,
  },
  {
    name: "",
    amount: 5,
    message: "Keep up the good work!",
    keepPrivate: false,
  },
];

const commonStyles = `border-[1px] border-gray px-2 py-2`;

// Apply this class only to cells that need truncation
const truncateStyles = `truncate`;

const columnWidths = {
  name: "max-w-[100px]", // You can adjust this width as per your design
  message: "max-w-[100px]", // Adjust accordingly to accommodate your data
};

const currentMonth = new Date().toLocaleString(`default`, { month: `long` });

const TopDonors = () => {
  return (
    <>
      <p className="text-neutral text-xl text-center font-medium">
        Top Donors of {currentMonth}
      </p>

      <p className="text-neutral/70 text-sm text-center font-medium">
        Thanks for your support!
      </p>

      {/* Table of Top Donors of the month */}
      <table
        className={`w-full max-w-full border-2 border-gray rounded-md mt-5`}
      >
        <thead className="text-neutral/80 text-left bg-gray/50">
          <tr>
            <th className={`w-1/12 ${commonStyles}`}>S.N</th>
            <th className={`w-4/12 ${commonStyles} ${columnWidths.name}`}>
              Name
            </th>
            <th className={`w-5/12 ${commonStyles} ${columnWidths.message}`}>
              Messages
            </th>
            <th className={`w-2/12 ${commonStyles}`}>Amount</th>
          </tr>
        </thead>
        <tbody className="text-neutral/90 text-sm">
          {donors.map((donor, index) => {
            const displayName = donor.keepPrivate
              ? "Anonymous"
              : donor.name || "---";

            return (
              <tr key={index}>
                <td className={`${commonStyles}`}>{index + 1}</td>
                <td
                  className={`${commonStyles} ${truncateStyles} ${columnWidths.name}`}
                >
                  {displayName}
                </td>
                <td
                  className={`${commonStyles} ${truncateStyles} ${columnWidths.message}`}
                >
                  {donor.message}
                </td>
                <td className={`${commonStyles}`}>${donor.amount}</td>
              </tr>
            );
          })}

          <tr>
            <td
              colSpan="3"
              className={`text-center font-bold py-2 ${commonStyles}`}
            >
              Total Donors of {currentMonth}
            </td>
            <td colSpan="100" className={`font-bold ${commonStyles}`}>
              100
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TopDonors;

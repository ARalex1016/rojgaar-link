import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ data, expanded, onChange }) => {
  const contentLines = data?.content?.split("\n").map((line, index) => (
    <p key={index} className="my-1">
      {line}
    </p>
  ));

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={onChange}
        sx={{
          backgroundColor: expanded ? "rgb(89, 39, 180)" : "rgb(0, 0, 0)",
          color: "white",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: !expanded && "rgb(99, 99, 99)",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-white" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">
            <p className="font-semibold">{data?.title}</p>
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            backgroundColor: "rgb(60, 30, 100)",
            color: "white",
          }}
        >
          <Typography component="span">{contentLines}</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CustomAccordion;

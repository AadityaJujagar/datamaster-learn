/* eslint-disable react/prop-types */
export const HighlightText = ({ text }) => {
  return (
    <span className="font-bold bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent">
      {" "}
      {text}
    </span>
  );
};

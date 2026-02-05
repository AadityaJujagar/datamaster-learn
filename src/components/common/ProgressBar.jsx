/* eslint-disable react/prop-types */
import { Progress } from "flowbite-react";

export function ProgressBar({ progressCount }) {
  const num = parseInt(progressCount);

  if (isNaN(num)) {
    console.error("Invalid progress count:", progressCount);
    return null;
  }

  return <Progress progress={num} size="sm" />;
}

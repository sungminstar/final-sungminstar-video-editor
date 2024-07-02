import React from "react";
import { toTimeString } from "../utils/utils";

const VideoDuration = ({ selectedDuration, totalDuration }) => {
  const formatTime = (timeInSeconds) => {
    return toTimeString(timeInSeconds);
  };

  return (
    <div>
      Total Duration : {formatTime(selectedDuration)} /{" "}
      {formatTime(totalDuration)}
    </div>
  );
};

export default VideoDuration;

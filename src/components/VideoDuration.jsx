import React from "react";

const VideoDuration = ({ selectedDuration, totalDuration }) => {
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 60 / 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeInSeconds / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours} : ${minutes} : ${seconds}`;
  };

  return (
    <div>
      Total Duration : {formatTime(selectedDuration)} /
      {formatTime(totalDuration)}
    </div>
  );
};

export default VideoDuration;

import React from "react";
import { toTimeString } from "../utils/utils";

/* 비디오 재생 시간 구하는 컴포넌트 feat.toTimeString */
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

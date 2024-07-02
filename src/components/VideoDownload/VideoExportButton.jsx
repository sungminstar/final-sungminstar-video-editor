import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../../utils/utils";
import { ExportOutlined } from "@ant-design/icons";
import styles from "./VideoConversionButton.module.css";

const VideoExportButton = ({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart,
  onConversionEnd,
}) => {
  const onCutTheVideo = async () => {
    onConversionStart();

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));
    await ffmpeg.run(
      "-ss",
      `${minTime}`,
      "-i",
      "input.mp4",
      "-t",
      `${maxTime}`,
      "-c",
      "copy",
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const dataURL = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    const link = document.createElement("a");
    link.href = dataURL;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd();
  };

  return (
    <Button onClick={onCutTheVideo} className={styles.out__btn}>
      <ExportOutlined className={styles.export__icon} alt="Export video" />
      <p className={styles.btn__name}>Export Video</p>
    </Button>
  );
};

export default VideoExportButton;

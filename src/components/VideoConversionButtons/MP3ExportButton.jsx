import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../../utils/utils";
import { SoundOutlined } from "@ant-design/icons";
import styles from "./VideoConversionButton.module.css";

const MP3ExportButton = ({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart,
  onConversionEnd,
}) => {
  const convertToMP3 = async () => {
    onConversionStart();

    const inputFileName = "input.mp4";
    const outputFileName = "output.mp3";

    ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    await ffmpeg.run(
      "-i",
      inputFileName,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-vn",
      "-acodec",
      "libmp3lame",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);

    const audioUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/mp3" })
    );

    const link = document.createElement("a");
    link.href = audioUrl;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd();
  };

  return (
    <Button onClick={convertToMP3} className={styles.out__btn}>
      <SoundOutlined className={styles.export__icon} alt="Export voice" />
      <p className={styles.btn__name}>Export Voice</p>
    </Button>
  );
};

export default MP3ExportButton;

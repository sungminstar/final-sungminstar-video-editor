import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../../utils/utils";
import { GifOutlined } from "@ant-design/icons";
import styles from "./VideoConversionButton.module.css";

const GifExportButton = ({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart,
  onConversionEnd,
}) => {
  const convertToGif = async () => {
    onConversionStart();

    const inputFileName = "input.mp4";
    const outputFileName = "output.gif";

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
      "-f",
      "gif",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);

    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    const link = document.createElement("a");
    link.href = gifUrl;
    link.setAttribute("download", "");
    link.click();

    onConversionEnd();
  };

  return (
    <Button onClick={convertToGif} className={styles.out__btn}>
      <GifOutlined className={styles.export__icon} alt="Export GIF" />
      <p className={styles.btn__name}>Export GIF</p>
    </Button>
  );
};

export default GifExportButton;

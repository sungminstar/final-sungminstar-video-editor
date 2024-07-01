import React from "react";
import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../../utils/utils";

import styles from "./VideoConversionButton.module.css";
import { ExportOutlined, SoundOutlined, GifOutlined } from "@ant-design/icons";

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
}) {
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
    <section className={styles.out__btn__section}>
      <Button onClick={convertToGif} className={styles.out__btn}>
        <GifOutlined className={styles.export__icon} alt="Export GIF" />
        <p className={styles.btn__name}>Export GIF</p>
      </Button>

      <Button onClick={onCutTheVideo} className={styles.out__btn}>
        <ExportOutlined className={styles.export__icon} alt="Export video" />
        <p className={styles.btn__name}>Export video</p>
      </Button>

      <Button onClick={convertToMP3} className={styles.out__btn}>
        <SoundOutlined className={styles.export__icon} alt="Export voice" />
        <p className={styles.btn__name}>Export voice</p>
      </Button>
    </section>
  );
}

export default VideoConversionButton;

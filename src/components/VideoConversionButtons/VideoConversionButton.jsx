import React from "react";
import { Button } from "antd";
import GifExportButton from "./GifExportButton";
import VideoExportButton from "./VideoExportButton";
import MP3ExportButton from "./MP3ExportButton";
import styles from "./VideoConversionButton.module.css";

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
}) {
  return (
    <section className={styles.out__btn__section}>
      <GifExportButton
        videoPlayerState={videoPlayerState}
        sliderValues={sliderValues}
        videoFile={videoFile}
        ffmpeg={ffmpeg}
        onConversionStart={onConversionStart}
        onConversionEnd={onConversionEnd}
      />

      <VideoExportButton
        videoPlayerState={videoPlayerState}
        sliderValues={sliderValues}
        videoFile={videoFile}
        ffmpeg={ffmpeg}
        onConversionStart={onConversionStart}
        onConversionEnd={onConversionEnd}
      />

      <MP3ExportButton
        videoPlayerState={videoPlayerState}
        sliderValues={sliderValues}
        videoFile={videoFile}
        ffmpeg={ffmpeg}
        onConversionStart={onConversionStart}
        onConversionEnd={onConversionEnd}
      />
    </section>
  );
}

export default VideoConversionButton;

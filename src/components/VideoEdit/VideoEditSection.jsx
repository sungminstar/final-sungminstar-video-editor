import React from "react";
import MultiRangeSlider from "../VideoEdit/DurationSlider/MultiRangeSlider";
import VideoConversionButton from "../VideoDownload/VideoConversionButton";
import VideoDuration from "../VideoEdit/DurationSlider/VideoDuration";
import styles from "./VideoEditSection.module.css";

const VideoEditSection = ({
  duration,
  sliderValues,
  handleSliderChange,
  calculateSelectedDuration,
  setProcessing,
  setShow,
  ffmpeg,
  videoPlayerState,
  videoFile,
}) => (
  <>
    <section className={styles.duration__slider}>
      {duration && (
        <div className={styles.duration}>
          <VideoDuration
            selectedDuration={calculateSelectedDuration()}
            totalDuration={duration}
          />
        </div>
      )}
      <div className={styles.slider}>
        <MultiRangeSlider min={0} max={100} onChange={handleSliderChange} />
      </div>
    </section>
    <section className={styles.conversion__btn__container}>
      <VideoConversionButton
        onConversionStart={() => setProcessing(true)}
        onConversionEnd={() => {
          setProcessing(false);
          setShow(true);
        }}
        ffmpeg={ffmpeg}
        videoPlayerState={videoPlayerState}
        sliderValues={sliderValues}
        videoFile={videoFile}
      />
    </section>
  </>
);

export default VideoEditSection;

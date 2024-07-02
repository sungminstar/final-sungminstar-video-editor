import React, { useState, useRef, useEffect } from "react";
import Loading from "./Loading";
import VElogo from "../../assets/logo.png";
import styles from "./VideoEditor.module.css";
import { Layout, Flex } from "antd";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";
import MultiRangeSlider from "../../components/DurationSlider/MultiRangeSlider";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import VideoConversionButton from "../../components/VideoConversionButtons/VideoConversionButton";
import { sliderValueToVideoTime } from "../../utils/utils";
import VideoDuration from "../../components/DurationSlider/VideoDuration";
import ToastMessage from "../../components/ToastModal/ToastMessage";
import ProgressModal from "../../components/ToastModal/ProgressModal";
import VideoUploader from "../../components/VideoUpload/VideoUploader";

const { Header, Footer, Content } = Layout;
const ffmpeg = createFFmpeg({ log: true });

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [videoPlayerState, setVideoPlayerState] = useState(null);
  const [played, setPlayed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(null);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [processing, setProcessing] = useState(false);
  const [show, setShow] = useState(false);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const onProgress = ({ ratio }) => {
      setProgress(Math.floor(ratio * 100));
    };

    ffmpeg.setProgress(onProgress);

    return () => {
      ffmpeg.setProgress(null);
    };
  }, []);

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      const [min, max] = sliderValues;
      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(maxTime);
      }
    }
  }, [videoPlayerState]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
    }
  }, [videoFile]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!videoFile) {
      setVideoPlayerState(null);
      setVideoPlayer(null);
      setSliderValues([0, 100]);
    }
  }, [videoFile]);

  const calculateSelectedDuration = () => {
    if (!duration) return 0;
    const [start, end] = sliderValues;
    const startTime = (start / 100) * duration;
    const endTime = (end / 100) * duration;
    return endTime - startTime;
  };

  const handleSliderChange = ({ min, max }) => {
    setSliderValues([min, max]);
  };

  const handleProgress = (progress) => {
    setPlayed(progress.playedSeconds);
  };

  if (!ffmpegLoaded) return <Loading />;

  return (
    <Flex gap="middle" wrap>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <img src={VElogo} alt="Logo" className={styles.img__header} />
        </Header>
        <Content className={styles.content}>
          <div className={styles.div1}>
            <article className={styles.layout__article}>
              <VideoUploader
                videoFile={videoFile}
                setVideoFile={setVideoFile}
              />
              <section className={styles.video__upload__section}>
                {videoFile ? (
                  <VideoPlayer
                    src={videoFile}
                    ref={setVideoPlayer}
                    onPlayerChange={(videoPlayer) =>
                      setVideoPlayer(videoPlayer)
                    }
                    onChange={(videoPlayerState) =>
                      setVideoPlayerState(videoPlayerState)
                    }
                    onProgress={handleProgress}
                  />
                ) : null}
              </section>
              {videoFile && (
                <>
                  <section className={styles.duration__slider}>
                    {duration && (
                      <div className={styles.duration}>
                        <VideoDuration
                          selectedDuration={calculateSelectedDuration()}
                          totalDuration={duration}
                        />{" "}
                      </div>
                    )}
                    <div className={styles.slider}>
                      <MultiRangeSlider
                        min={0}
                        max={100}
                        onChange={handleSliderChange}
                      />
                    </div>
                  </section>
                  <section className={styles.conversion__btn__container}>
                    <VideoConversionButton
                      onConversionStart={() => {
                        setProcessing(true);
                      }}
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
              )}
              <ToastMessage show={show} onClose={() => setShow(false)} />
              <ProgressModal
                show={processing}
                onHide={() => setProcessing(false)}
                progress={progress}
              />
            </article>
          </div>
        </Content>
        <Footer className={styles.footer}>
          <img src={VElogo} alt="Logo" className={styles.img__footer} />©{" "}
          {new Date().getFullYear()} Created By Sungmin Lim
        </Footer>
      </Layout>
      <video
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: "none" }}
      ></video>
    </Flex>
  );
};

export default VideoEditor;

import React, { useState, useRef, useEffect } from "react";
import VElogo from "../../assets/logo.png";
import plz_video_upload from "../../assets/plz_video_upload.png";
import styles from "./VideoEditor.module.css";
import { Button, Modal, ToastContainer, Toast, Spinner } from "react-bootstrap";
import { Layout, Flex } from "antd";
import { VideoPlayer } from "./VideoPlayer";
import MultiRangeSlider from "../../components/DurationSlider/MultiRangeSlider";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import VideoConversionButton from "../../components/VideoConversionButtons/VideoConversionButton";
import "react-circular-progressbar/dist/styles.css";
import { sliderValueToVideoTime } from "../../utils/utils";
import VideoDuration from "../../components/DurationSlider/VideoDuration";
import ToastMessage from "../../components/ToastModal/ToastMessage";
import ProgressModal from "../../components/ToastModal/ProgressModal";

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
  const uploadFile = useRef(null);

  useEffect(() => {
    const onProgress = ({ ratio }) => {
      setProgress(Math.floor(ratio * 100));
    };

    ffmpeg.setProgress(onProgress);

    return () => {
      ffmpeg.setProgress(null);
    };
  }, []);

  /* 편집 화면 실시간 확인 기능
    비디오 시작 : 슬라이더 시작점 : minTime
    비디오 끝  : 슬라이더 끝지점 : maxTime  */
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

      // videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
      // 이거 있으면 렌더링이 업로드가 늦어짐
    }
  }, [videoPlayerState]);

  /* 비디오 파일 업로드 File -> URL */
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
    }
  }, [videoFile]);

  /* 비디오 메타 데이터 로드 -> 전체 지속 시간 설정 */
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

  /* 비디오의 선택된 부분의 지속 시간 */
  const calculateSelectedDuration = () => {
    if (!duration) return 0;
    const [start, end] = sliderValues;
    const startTime = (start / 100) * duration;
    const endTime = (end / 100) * duration;
    return endTime - startTime;
  };

  /* 슬라이더 값 업데이트 */
  const handleSliderChange = ({ min, max }) => {
    setSliderValues([min, max]);
  };

  const handleProgress = (progress) => {
    setPlayed(progress.playedSeconds);
  };

  if (!ffmpegLoaded)
    return (
      <div className={styles.yet__ffmpeg__loading}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  return (
    <Flex gap="middle" wrap>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <img src={VElogo} alt="Logo" className={styles.img__header} />
        </Header>
        <Content className={styles.content}>
          <div className={styles.div1}>
            <article className={styles.layout__article}>
              <div className={styles.div2}>
                <h1 className={styles.title}>Video Edit</h1>
                {videoFile && (
                  <div className={styles.re__upload__div}>
                    <input
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      ref={uploadFile}
                    />

                    <Button
                      className={styles.re__upload__btn}
                      onClick={() => uploadFile.current.click()}
                    >
                      reupload
                    </Button>
                  </div>
                )}
              </div>
              <section className={styles.video__upload__section}>
                {videoFile ? (
                  <div>
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
                  </div>
                ) : (
                  <>
                    <img
                      className={styles.plz__upload__video}
                      src={plz_video_upload}
                      alt="Please upload"
                    />
                    <div>
                      <input
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        ref={uploadFile}
                      />
                      <Button
                        className={styles.upload__btn}
                        onClick={() => uploadFile.current.click()}
                      >
                        Video Upload
                      </Button>
                    </div>
                  </>
                )}
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

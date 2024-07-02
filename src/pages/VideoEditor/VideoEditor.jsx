import React, { useState, useRef, useEffect } from "react";
import VElogo from "../../assets/logo.png";
import plz_video_upload from "../../assets/plz_video_upload.png";
import styles from "./VideoEditor.module.css";
import { Button, Modal, ToastContainer, Toast } from "react-bootstrap";
import { Layout, Flex } from "antd";
import { VideoPlayer } from "./VideoPlayer";
import MultiRangeSlider from "../../components/MultiRangeSlider";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import VideoConversionButton from "./VideoConversionButton";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { sliderValueToVideoTime } from "../../utils/utils";
import { CheckCircleOutlined } from "@ant-design/icons";
import VideoDuration from "../../components/VideoDuration";

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

  useEffect(() => {
    const min = sliderValues[0];
    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
    }
  }, [sliderValues]);

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      const [min, max] = sliderValues;

      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(minTime);
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

    if (videoPlayer && videoPlayerState) {
      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      videoPlayer.seek(minTime);
    }
  };

  if (!ffmpegLoaded) return <div>Loading...</div>;

  const handleProgress = (progress) => {
    setPlayed(progress.playedSeconds);
  };

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
                    <div className={styles.duration}>
                      {duration && (
                        <div>
                          <VideoDuration
                            selectedDuration={calculateSelectedDuration()}
                            totalDuration={duration}
                          />{" "}
                        </div>
                      )}
                    </div>
                    {/* TODO: track과 thumb 불일치  */}
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
                        setProgress(0);
                        setProcessing(true);
                      }}
                      onConversionEnd={() => {
                        setProgress(0);
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
              <ToastContainer
                className="p-3"
                position={"top-center"}
                style={{ zIndex: 1 }}
              >
                <Toast
                  onClose={() => setShow(false)}
                  show={show}
                  delay={2000}
                  autohide
                >
                  <Toast.Body>
                    {" "}
                    <CheckCircleOutlined /> Export completed
                  </Toast.Body>
                </Toast>
              </ToastContainer>
              <Modal
                className={styles.modal}
                show={processing}
                onHide={() => setProcessing(false)}
                backdrop={false}
                keyboard={false}
                centered
                size="sm"
              >
                <div className={styles.modal__container}>
                  <Modal.Body>
                    <div className={styles.progress__container}>
                      <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        styles={buildStyles({
                          textSize: "16px",
                          pathColor: "#383838",
                          textColor: "#383838",
                        })}
                      />
                    </div>
                    <p className={styles.progress__text}>Export in progress</p>
                  </Modal.Body>
                  {/* <Modal.Footer>
                    TODO: cancel 버튼 기능 구현 => 포기
                    <Button
                      className={styles.upload__cancel__btn}
                      onClick={console.log("canceled")}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer> */}
                </div>
              </Modal>
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

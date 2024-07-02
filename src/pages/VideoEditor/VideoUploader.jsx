import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./VideoUploader.module.css";
import plz_video_upload from "../../assets/plz_video_upload.png";

const VideoUploader = ({ videoFile, setVideoFile }) => {
  const uploadFile = useRef(null);

  return (
    <div className={styles.video__upload__section}>
      <div className={styles.title__reupload__container}>
        <h1 className={styles.title}>Video Edit</h1>
        <div className={styles.space}></div> {/* 가운데 공간 추가 */}
        {videoFile && (
          <Button
            className={styles.re__upload__btn}
            onClick={() => uploadFile.current.click()}
          >
            Reupload
          </Button>
        )}
      </div>
      {!videoFile && (
        <>
          <img
            className={styles.plz__upload__video}
            src={plz_video_upload}
            alt="Please upload"
          />
          <Button
            className={styles.upload__btn}
            onClick={() => uploadFile.current.click()}
          >
            Video Upload
          </Button>
        </>
      )}
      <input
        onChange={(e) => setVideoFile(e.target.files[0])}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        ref={uploadFile}
      />
    </div>
  );
};

export default VideoUploader;

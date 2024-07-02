/* sliderValue(0~100) != duration(video) 
    따라서 슬라이더 값을 비디오 재생 시간 단위로 변경 */
export function sliderValueToVideoTime(duration, sliderValue) {
  return Math.round((duration * sliderValue) / 100);
}

export const toTimeString = (sec, showMilliSeconds = true) => {
  sec = parseFloat(sec);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toFixed(showMilliSeconds ? 2 : 0);

  let milliseconds = showMilliSeconds ? seconds.slice(-2) : "";

  seconds = seconds.slice(0, -3);

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const readFileAsBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const download = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  link.click();
};

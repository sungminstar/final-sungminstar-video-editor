import { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import "./SliderDuration.css";
/* 비디오 재생 시간 멀티 슬라이더 0 ~ 100 */
export default function MultiRangeSlider({ min, max, onChange, disabled }) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  // 입력 값의 백분율을 계산
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // 슬라이더 값 min
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // 슬라이더 값 max
  useEffect(() => {
    const minPercent = getPercent(+minValRef.current.value);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // minVal과 maxVal 값 업데이트
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="multi-range-slider">
      {/* 최소 값 입력 */}
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          // minVal이 maxVal - 1보다 작도록 보장
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": minVal > max - 100,
        })}
      />

      {/* 최대 값 입력 */}
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          // maxVal이 minVal + 1보다 크도록 보장
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
        }}
        className="thumb thumb--zindex-4"
      />

      {/* 슬라이더 track 및 range */}
      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
      </div>
    </div>
  );
}

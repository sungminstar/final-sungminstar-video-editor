import { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import "./multiRangeSlider.css";

export default function MultiRangeSlider({ min, max, onChange, disabled }) {
  // 최소 값과 최대 값 상태 설정
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  // 최소 값 및 최대 값의 Ref 설정
  const minValRef = useRef(null);
  const maxValRef = useRef(null);

  // range 요소의 Ref 설정
  const range = useRef(null);

  // 입력 값의 백분율을 계산하는 콜백 함수
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    // minVal의 백분율 계산
    const minPercent = getPercent(minVal);
    // maxVal의 백분율 계산
    const maxPercent = getPercent(maxVal);

    // range 요소의 위치 및 너비 조정
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  useEffect(() => {
    // minValRef의 백분율 계산
    const minPercent = getPercent(+minValRef.current.value);
    // maxVal의 백분율 계산
    const maxPercent = getPercent(maxVal);

    // range 요소의 너비 조정
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // minVal과 maxVal 값이 변경될 때 onChange 함수 호출
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

import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TimeInSeconds } from "../context";
import { eventBus } from "../EventBus";

function Pad({ isPlaying, audioFile }) {
  // console.log(audioFile);
  const [isOn, setIsOn] = useState(false); // pad indicator
  const audioEl = useRef(null); // audio element

  const time = useContext(TimeInSeconds); // global timer
  useEffect(() => {
    // load audio element
    audioEl.current.load();
    audioEl.current.loop = true;
  }, []);
  useEffect(() => {
    eventBus.on("resetPads", () => {
      // reset pads when gets this event
      setIsOn(false);
    });
    eventBus.on("setPadsOn", ({ message }) => {
      // set pads status
      setIsOn(message);
    });
  }, []);

  useEffect(() => {
    if (isPlaying && isOn) {
      audioEl.current.currentTime = time.timeInSeconds;
      audioEl.current.play();
    } else {
      audioEl.current.pause();
    }
  }, [isPlaying, isOn]);
  // switching pad status on click
  // play pad sync with other running pads.
  const handleClick = () => {
    // console.log(isOn);
    if (!isPlaying) return setIsOn(!isOn);
    if (!isOn) {
      audioEl.current.currentTime = time.timeInSeconds;
      audioEl.current.play();
    } else {
      audioEl.current.pause();
    }
    setIsOn(!isOn);
  };

  return (
    <StyledPad
      reset={time.timeInSeconds === 0}
      isPlaying={isPlaying}
      isOn={isOn}
      onClick={() => handleClick()}
    >
      <audio ref={audioEl} src={audioFile}></audio>
    </StyledPad>
  );
}

const StyledPad = styled.div`
  cursor: pointer;
  border: 1px solid #f9f9f9;
  box-shadow: 0 0 5px 2px rgba(50, 50, 50, 0.5);
  ${(props) =>
    props.isOn
      ? props.isPlaying
        ? `
    border: 0 ;
    animation: backgroundDancing 3s ease infinite;
    `
        : `background-color: rgb(110, 126, 214);`
      : `background-color: '';`}
`;
export default Pad;

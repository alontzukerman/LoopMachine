import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
function Record({ record }) {
  const [on, setOn] = useState(false);
  const audioEl = useRef(null);

  useEffect(() => {
    audioEl.current.load();
    audioEl.current.loop = false;
  }, []);

  const play = () => {
    audioEl.current.play();
  };
  const stop = () => {
    audioEl.current.pause();
    audioEl.current.currentTime = 0;
  };
  const handlePlay = () => {
    on ? stop() : play();
    setOn(!on);
  };
  return (
    <RecordContainer>
      <Span onClick={() => handlePlay()}>
        {on ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
      </Span>
      <Span>{record.date}</Span>
      <audio ref={audioEl} src={record.record} />
    </RecordContainer>
  );
}
const RecordContainer = styled.div`
  display: flex;
  padding: 10px;
`;
const Span = styled.span`
  margin-right: 5px;
`;
export default Record;

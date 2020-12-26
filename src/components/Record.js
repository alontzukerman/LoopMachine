import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
function Record({ record }) {
  const [on, setOn] = useState(false); // is record playing
  const audioEl = useRef(null); // audio element ref

  useEffect(() => { // load and set loop setting
    audioEl.current.load();
    audioEl.current.loop = false;
  }, []);

  const play = () => { // play audio record on click
    audioEl.current.play();
  };
  const stop = () => { // stop audio record on click
    audioEl.current.pause();
    audioEl.current.currentTime = 0;
  };
  const handlePlay = () => { // handle play & stop state
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

// styled components 

const RecordContainer = styled.div`
  display: flex;
  padding: 10px;
`;
const Span = styled.span`
  margin-right: 5px;
`;
export default Record;

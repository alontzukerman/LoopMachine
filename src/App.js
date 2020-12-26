import "./App.css";
import Pad from "./components/Pad";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ControlPanel from "./components/ControlPanel";
import { TimeInSeconds } from "./context";
import { files } from "./audio_files";
import Records from "./components/Records";
import { eventBus } from "./EventBus";
function App() {
  const [isPlaying, setIsPlaying] = useState(false); // play indicator
  const [timeInSeconds, setTimeInSeconds] = useState(0); // global timer in seconds
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // running timer as long isPlaying is on
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimeInSeconds((timeInSeconds + 0.01) % 8);
      }, 10);
      return () => clearInterval(interval);
    } else return ;
  });

  return (
    <TimeInSeconds.Provider value={{ timeInSeconds, setTimeInSeconds }}>
      <StyledApp>
        <Title>Welcome To The Looper</Title>
        <StyledPadsContainer>
          {files.map((file, i) => {
            return <Pad isPlaying={isPlaying} audioFile={file} key={i} />;
          })}
        </StyledPadsContainer>
        <Records records={records} />
        <ControlPanel handleState={(bool) => setIsPlaying(bool)} />
      </StyledApp>
    </TimeInSeconds.Provider>
  );
}


// styled components
const StyledApp = styled.div`
  background-color: rgb(20, 20, 20);
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    & > div:nth-child(2) {
      height: 350px;
      width: 350px;
    }
  }
  @media (max-width: 480px) {
    & > div:nth-child(2) {
      height: 330px;
      width: 330px;
    }
  }
`;
const Title = styled.h2`
  text-align: center;
  font-size: 2em;
  color: #f9f9f9;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 50px 0;
`;
const StyledPadsContainer = styled.div`
  height: 400px;
  width: 400px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;

export default App;

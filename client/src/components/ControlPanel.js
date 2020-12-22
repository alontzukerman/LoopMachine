import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TimeInSeconds } from "../context";
import RecordRTC, { StereoAudioRecorder, MediaStreamRecorder } from "recordrtc";
import Recorder from "recorder-js";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StopIcon from "@material-ui/icons/Stop";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";
import { eventBus } from "../EventBus";
import { Icon } from "@material-ui/core";

function ControlPanel({ handleState }) {
  const [start, setStart] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  // const [rec, setRec] = useState(null);
  const recordRef = useRef(null);

  const time = useContext(TimeInSeconds);

  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // const recorder = new Recorder(audioContext, {
  //   // An array of 255 Numbers
  //   // You can use this to visualize the audio stream
  //   // If you use react, check out react-wave-stream
  //   onAnalysed: (data) => console.log(data),
  // });

  // let isRecording = false;
  // let blob = null;

  // navigator.mediaDevices
  //   .getUserMedia({ audio: true })
  //   .then((stream) => recorder.init(stream))
  //   .catch((err) => console.log("Uh oh... unable to get stream...", err));

  // function startRecording() {
  //   recorder.start().then(() => (console.log("recording")));
  // }

  // function stopRecording() {
  //   recorder.stop().then(({ blob, buffer }) => {
  //     blob = blob;
  //     console.log(blob);
  //     // buffer is an AudioBuffer
  //   });
  // }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          autoGainControl: true,
          channelCount: 1,
          deviceId: "default",
          echoCancellation: true,
        },
        video: false,
      })
      // .getUserMedia({
      //   audio: { echoCancellation: true },
      //   video: true ,
      // })
      .then(async function (stream) {
        window.stream = stream;
        console.log(window.stream);
        let recorder = RecordRTC(window.stream, {
          type: "audio",
          mimeType: "audio/webm",
          ondataavailable: function (blob) {
            console.log(blob);
          },
        });
        setRecorder(recorder);
      });
  }, []);

  const startRecord = () => {
    recorder.startRecording();
  };

  const stopRecord = () => {
    recorder.stopRecording(function () {
      let blob = recorder.getBlob();
      console.log(URL.createObjectURL(blob));
      let blobUrl = URL.createObjectURL(blob);
      recordRef.current.src = blobUrl;
      recordRef.current.play();
      setLastRecord(blobUrl);
    });
  };
  const handleClick = (bool) => {
    if (!bool && bool === start) {
      time.setTimeInSeconds(0);
      eventBus.dispatch("resetPads", { message: "reset pads" });
    }
    if (bool !== start) {
      setStart(bool);
      handleState(bool);
    }
  };
  const setAllPads = (bool) => {
    eventBus.dispatch("setPadsOn", { message: bool });
  }
  const handleToggle = () => {
    console.log(toggle);
    setToggle(!toggle);
  };
  // const handleRecord = () => {
  //   recording ? stopRecording() : startRecording();
  //   setRecording(!recording);
  // };
  const handleRecord = () => {
    recording ? stopRecord() : startRecord();
    setRecording(!recording);
  };
  return (
    <StyledPanel toggle={toggle}>
      <TogglePanel onClick={() => handleToggle()}>
        {toggle ? (
          <ExpandMoreIcon fontSize="large" />
        ) : (
          <ExpandLessIcon fontSize="large" />
        )}
      </TogglePanel>
      <PanelButtons>
        <StyledIcons>
          <IconDiv onClick={() => handleClick(!start)}>
            {start ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconDiv>
          <IconDiv onClick={() => handleClick(false)}>
            <StopIcon fontSize="large" />
          </IconDiv>
          <IconDiv onClick={() => setAllPads(false)}>
            <SentimentDissatisfiedRoundedIcon fontSize="large" />
          </IconDiv>
          <IconDiv onClick={() => setAllPads(true)}>
            <SentimentSatisfiedRoundedIcon fontSize="large" />
          </IconDiv>
        </StyledIcons>
        <Time>{`00:0${time.timeInSeconds.toFixed(0)}`}</Time>
      </PanelButtons>
      <audio ref={recordRef} />
    </StyledPanel>
  );
}

const StyledPanel = styled.div`
  height: 100px;
  width: 100%;
  background-color: rgba(100, 100, 100, 0.6);
  color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  transition: transform 0.2s ease;
  transform: ${(props) =>
    props.toggle ? "translateY(0)" : "translateY(90px)"};
`;

const TogglePanel = styled.div`
  cursor: pointer;
  height: 40px;
  width: 40px;
  margin-top: -30px;
`;
const PanelButtons = styled.div`
  height: 90px;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledIcons = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const IconDiv = styled.div`
  cursor: pointer;
  height: 50px;
  width: 50px;
  display: flex;
  background-color: rgb(139, 82, 82);
  border-radius: 50%;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgb(119, 53, 53) ;
  }
`;
const Button = styled.button`
  cursor: pointer;
  border: 0;
  width: 100px;
  height: 100%;
  font-weight: bold;
  color: ${(props) => (props.recording ? "rgb(149, 25, 25)" : "black")};
  background-color: ${(props) =>
    props.on ? "rgb(139, 82, 82)" : "rgb(119, 45, 45)"};
  &:focus {
    outline: none;
  }
`;

const Time = styled.div`
height: 50px ;
width: 150px ;
  font-size: 1.5em;
  font-weight: bold;
  letter-spacing: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(139, 82, 82);
  border-radius: 5px;
`;
export default ControlPanel;

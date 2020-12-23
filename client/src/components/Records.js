import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { eventBus } from "../EventBus";
import Record from "./Record";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
function Records() {
  const [records, setRecords] = useState([]);
  const [openRecords, setOpenRecords] = useState(false);
  console.log(records);
  useEffect(() => {
    eventBus.on("newRecord", ({ newRecord }) => {
      console.log(newRecord);

      setRecords([newRecord]);
    });
  }, []);
  const handleMenu = () => {
    setOpenRecords(!openRecords);
  };
  return (
    <RecordsContainer open={openRecords}>
      <ToggleMenu hasRecord={records.length > 0} onClick={() => handleMenu()}>
        <SyncAltIcon fontSize="large" />
      </ToggleMenu>
      {records.map((record, i) => {
        return <Record record={record} key={i} />;
      })}
    </RecordsContainer>
  );
}

const RecordsContainer = styled.div`
  background-color: rgba(100, 100, 100, 0.6);
  color: #f9f9f9 ;
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.open ? "translateX(0)" : "translateX(100%)")};
`;

const ToggleMenu = styled.div`
cursor: pointer; 
  background-color: rgb(139, 82, 82);
  width: 70px;
  margin: 5px 0;
  margin-left: -60px;
  padding: 5px 0px 5px 10px;
  display: ${props=>props.hasRecord ? 'flex' : 'none'};
  align-items: center;
`;
export default Records;

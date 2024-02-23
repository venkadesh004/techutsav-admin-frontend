import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import { blue } from "@mui/material/colors";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

import { api } from "../api/api";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("admin/getEvents")
      .then((result) => {
        console.log(result.data.result);
        setEvents(result.data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [subLoader, setSubLoader] = useState(false);

  const [currentData, setCurrentData] = useState({
    eventName: "",
    department: "",
    eventAbstract: "",
    eventTiming: "",
    eventDesp: "",
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleEvents = (element) => {
    if (editMode) {
      alert("Save the Current Progress!");
      return;
    }
    setSubLoader(true);
    setOpen(false);
    api
      .post("admin/getEventData", { uniqueName: element })
      .then((result) => {
        setCurrentData(result.data.result);
        console.log(currentData);
        setOpen(true);
        setSubLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSave = () => {
    console.log(currentData);
    api
      .put("admin/updateEvent", currentData)
      .then((result) => {
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var data = [
    {
      department: "Computer Science and Engineering",
      eventName: "Blind Coding",
      eventTiming: "10:00AM-12:00PM",
      eventAbstract:
        "The Best event conducted by the department of Computer Science and Engineering",
    },
  ];

  if (loading) {
    return <div className="mt-10 w-full text-center">Loading...</div>;
  }

  return (
    <div>
      <div className={"flex items-start justify-center"}>
        <Paper
          className={
            "w-[30%] flex items-center flex-col h-[100vh] overflow-y-scroll"
          }
          elevation={2}
        >
          {events.map((element) => {
            console.log(element);
            return (
              <Paper
                elevation={5}
                sx={{
                  width: "calc(100% - 70px)",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: "20px",
                  marginTop: "30px",
                  cursor: "pointer",
                }}
              >
                <Typography>{element}</Typography>
                <IconButton onClick={(e) => handleEvents(element)}>
                  <KeyboardDoubleArrowRightIcon />
                </IconButton>
              </Paper>
            );
          })}
        </Paper>
        <div className={`w-[70%] p-10`}>
          {subLoader && <div>Loading Data...</div>}
          {open && (
            <div>
              <div className={"w-full h-[500px] flex items-start"}>
                <div
                  className={
                    "flex pl-10 flex-col w-full h-full justify-center gap-7"
                  }
                >
                  <h2 className={"w-full text-start font-bold text-4xl"}>
                    {currentData.uniqueName}
                  </h2>
                  <div
                    className={"w-full flex items-center justify-start gap-2"}
                  >
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color={editMode ? "primary" : "success"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          width: "100px",
                        }}
                        onClick={() => {
                          if (editMode) {
                            handleSave();
                          } else {
                            setEditMode(true);
                          }
                        }}
                      >
                        {editMode ? (
                          <SaveIcon
                            sx={{ width: "20px", height: "20px" }}
                            className={"cursor-pointer"}
                          />
                        ) : (
                          <CreateIcon
                            sx={{ width: "20px", height: "20px" }}
                            className={"cursor-pointer"}
                          />
                        )}
                        {editMode ? "Save" : "Edit"}
                      </Button>
                    </ThemeProvider>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        width: "130px",
                      }}
                      onClick={() => {
                        var name = prompt(
                          "Enter the Unique Name of the Project: "
                        );
                        if (name == currentData.uniqueName) {
                          api
                            .put("admin/deleteEvent", {
                              uniqueName: currentData.uniqueName,
                            })
                            .then((result) => {
                              console.log(result);
                              if (result.data.msg === "success") {
                                setOpen(false);
                                setLoading(true);
                                api
                                  .get("admin/getEvents")
                                  .then((result) => {
                                    console.log(result.data.result);
                                    setEvents(result.data.result);
                                    setLoading(false);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              } else {
                                console.log(result);
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        } else {
                          alert("Deletion Failed!");
                        }
                      }}
                    >
                      <DeleteIcon sx={{ width: "20px", height: "20px" }} />{" "}
                      Delete
                    </Button>
                    <IconButton>
                      <UploadFileIcon />
                    </IconButton>
                    <IconButton>
                      <CloudDownloadIcon />
                    </IconButton>
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Event Name: </p>
                    <input
                      type="text"
                      value={currentData.eventName}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          eventName: event.target.value,
                        });
                      }}
                      placeholder="Event Name"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Department: </p>
                    <input
                      type="text"
                      value={currentData.department}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          department: event.target.value,
                        });
                      }}
                      placeholder="Department"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Event Timing: </p>
                    <input
                      type="text"
                      value={currentData.eventTiming}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          eventTiming: event.target.value,
                        });
                      }}
                      placeholder="Event Timing (HH:MMAM-HH:MMPM)"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Event Abstract: </p>
                    <input
                      type="text"
                      value={currentData.eventAbstract}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          eventAbstract: event.target.value,
                        });
                      }}
                      placeholder="Event Abstract"
                    />
                  </div>
                </div>
              </div>
              <div className={"mt-4 pl-10"}>
                <p className={"font-bold text-2xl"}>Event Description: </p>
                <textarea
                  className={"mt-3 w-full h-[200px] border-[1px] pl-3 pt-3"}
                  value={currentData.eventDesp}
                  disabled={!editMode}
                  onChange={(event) => {
                    console.log(event.target.value);
                    setCurrentData({
                      ...currentData,
                      eventDesp: event.target.value,
                    });
                  }}
                  placeholder="Event Description"
                ></textarea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

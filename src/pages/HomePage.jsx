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

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { useMediaQuery } from "@mui/material";
import Navbar from "../components/Navbar";

import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

const HomePage = () => {
  const screenCheck = useMediaQuery("(min-width: 1000px)");
  if (!screenCheck) {
    return (
      <div className="mt-10 w-full text-center">
        Please Open in a Screen Bigger than 1000px
      </div>
    );
  }

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("admin/getEvents")
      .then((result) => {
        // console.log(result.data.result);
        setEvents(result.data.result);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  const [subLoader, setSubLoader] = useState(false);
  const [file, setFile] = useState(null);

  const [currentData, setCurrentData] = useState({
    eventName: "",
    department: "",
    eventAbstract: "",
    eventTiming: "",
    eventDesp: "",
    incharge: "",
    inchargeNumber: "",
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
        // console.log(currentData);
        setOpen(true);
        setSubLoader(false);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleSave = () => {
    // console.log(currentData);
    api
      .put("admin/updateEvent", currentData)
      .then((result) => {
        setEditMode(false);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden`}>
      <Navbar />
      <div className={"flex items-start justify-center"}>
        <Paper
          className={
            "w-[30%] flex items-center flex-col h-[calc(100vh-80px)] overflow-y-scroll pb-10"
          }
          elevation={2}
        >
          {events.map((element, index) => {
            // // console.log(element);
            return (
              <Paper
                key={index}
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
        <div className={`w-[70%] p-10 h-[calc(100vh-80px)] overflow-y-scroll`}>
          {subLoader && <div>Loading Data...</div>}
          {open && (
            <div>
              <div className={"w-full flex items-start"}>
                <div
                  className={
                    "flex pl-10 flex-col w-[70%] h-full justify-center gap-7"
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
                          setOpen(false);
                          setLoading(true);
                          api
                            .put("admin/deleteEvent", {
                              uniqueName: currentData.uniqueName,
                            })
                            .then((result) => {
                              // // console.log(result);
                              if (result.data.msg === "success") {
                                api
                                  .get("admin/getEvents")
                                  .then((result) => {
                                    // // console.log(result.data.result);
                                    setEvents(result.data.result);
                                    setLoading(false);
                                  })
                                  .catch((err) => {
                                    // console.log(err);
                                  });
                              } else {
                                // console.log(result);
                              }
                            })
                            .catch((err) => {
                              // console.log(err);
                            });
                        } else {
                          alert("Deletion Failed!");
                        }
                      }}
                    >
                      <DeleteIcon sx={{ width: "20px", height: "20px" }} />{" "}
                      Delete
                    </Button>
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        if (file !== null) {
                          setSubLoader(true);
                          setOpen(false);
                          const formData = new FormData();
                          formData.append("uniqueName", currentData.uniqueName);
                          formData.append("image", file);
                          api
                            .post("admin/uploadFile", formData, {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            })
                            .then((result) => {
                              setSubLoader(false);
                              setOpen(true);
                              window.location.reload();
                              alert("Image Uploaded Successfully");
                            })
                            .catch((err) => {
                              // console.log(err);
                              alert("Image Uploading Failed!");
                              setSubLoader(false);
                              setOpen(true);
                            });
                        }
                      }}
                    >
                      <UploadFileIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        window.location.href = `https://techutsav2024.blob.core.windows.net/eventimages/${currentData.uniqueName}.jpg`;
                      }}
                    >
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
                        // console.log(event.target.value);
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
                        // console.log(event.target.value);
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
                        // console.log(event.target.value);
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
                        // console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          eventAbstract: event.target.value,
                        });
                      }}
                      placeholder="Please Add about 35 to 40 words"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Event Incharge: </p>
                    <input
                      type="text"
                      value={currentData.incharge}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        // console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          incharge: event.target.value,
                        });
                      }}
                      placeholder="Incharge Name"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Incharge Phone: </p>
                    <input
                      type="text"
                      value={currentData.inchargeNumber}
                      className={"border-[1px] w-[450px] h-[40px] pl-3"}
                      disabled={!editMode}
                      onChange={(event) => {
                        // console.log(event.target.value);
                        setCurrentData({
                          ...currentData,
                          inchargeNumber: event.target.value,
                        });
                      }}
                      placeholder="Incharge Phone Number"
                    />
                  </div>
                  <div
                    className={
                      "flex items-center w-[full] max-w-[650px] justify-between"
                    }
                  >
                    <p className={"font-bold text-2xl"}>Flagship Event: </p>
                    <FormControl className={"w-[450px]"}>
                      <InputLabel
                        id="flagshipEventSelection"
                        className={"w-[200px]"}
                        disabled={!editMode}
                      >
                        Flagship Event
                      </InputLabel>
                      <Select
                        labelId="flagshipEventSelection"
                        id=""
                        value={currentData.flagship}
                        label="Event Type"
                        onChange={(event) => {
                          setCurrentData({
                            ...currentData,
                            flagship: event.target.value,
                          });
                        }}
                      >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div
                  className={
                    "w-[30%] h-full aspect-auto flex items-center justify-center"
                  }
                >
                  <img
                    src={`https://techutsav2024.blob.core.windows.net/eventimages/${currentData.uniqueName}.jpg`}
                    alt=""
                  />
                </div>
              </div>
              <div className={"mt-4 pl-10"}>
                <p className={"font-bold text-2xl"}>Event Description: </p>
                <textarea
                  className={
                    "mt-3 w-full h-[200px] border-[1px] pl-3 pt-3 whitespace-pre-wrap"
                  }
                  value={currentData.eventDesp}
                  disabled={!editMode}
                  onChange={(event) => {
                    // console.log(event.target.value);
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

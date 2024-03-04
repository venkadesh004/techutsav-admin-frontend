import React, { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";

import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import CloseIcon from "@mui/icons-material/Close";

import CircularProgress from "@mui/material/CircularProgress";

import { api } from "../api/api";
import Navbar from "../components/Navbar";

const columns = [
  { id: "email", label: "Email", minWidth: 50 },
  { id: "fullName", label: "Full Name", minWidth: 50 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 50 },
  { id: "collegeName", label: "College Name", minWidth: 50 },
  { id: "department", label: "Department", minWidth: 50 },
  { id: "paid", label: "Paid", minWidth: 50 },
  { id: "transactionNumber", label: "Transaction Number", minWidth: 100 },
  { id: "confirm", label: "Confirm Payment", minWidth: 70 },
];

const StudentList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restartEffect, setRestartEffect] = useState(true);

  useEffect(() => {
    api
      .get("/admin/getStudents")
      .then((result) => {
        setRows(result.data.sort((a, b) => (a && !b) ? 1:-1).sort((a, b) => (a.transactionNumber.length > b.transactionNumber.length) ? -1:1));
        setRestartEffect(false);
        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);
      });
  }, [restartEffect]);

  if (loading) {
    return <div className={"w-full h-screen flex items-center justify-center"}><CircularProgress /></div>;
  }

  return (
    <div>
      <Navbar />
      <div className="w-full">
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: "20px",
          }}
        >
          <TableContainer
            sx={{ minHeight: "830px", maxHeight: "950px", overflow: "scroll" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflow: "scroll" }}>
                {rows.map((row, index) => {
                  // //console.log(row);
                  return (
                    <TableRow hover role="checkbox" key={index}>
                      {columns.map((column, index) => {
                        if (column.id === "paid") {
                          return (
                            <TableCell key={index}>
                              {row[column.id] ? (
                                <FileDownloadDoneIcon color="success" />
                              ) : (
                                <CloseIcon color="error" />
                              )}
                            </TableCell>
                          );
                        }
                        if (column.id === "confirm") {
                          return (
                            <TableCell
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100px",
                                gap: "10px",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="success"
                                sx={{ width: "20px", aspectRatio: "2/1" }}
                                disabled={row["transactionNumber"] === ""}
                                onClick={() => {
                                  setLoading(true);
                                  api
                                    .put("/admin/updateUser", {
                                      _id: row["_id"],
                                      paid: true,
                                      fullName: row["fullName"],
                                      email: row["email"],
                                      transactionNumber:
                                        row["transactionNumber"],
                                    })
                                    .then((result) => {
                                      setRestartEffect(true);
                                      setLoading(false);
                                    })
                                    .catch((err) => {
                                      //console.log(err);
                                    });
                                }}
                              >
                                <FileDownloadDoneIcon />
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{ width: "20px", aspectRatio: "2/1" }}
                                disabled={row["transactionNumber"] === ""}
                                onClick={() => {
                                  setLoading(true);
                                  api
                                    .put("/admin/updateUser", {
                                      _id: row["_id"],
                                      paid: false,
                                      fullName: row["fullName"],
                                      email: row["email"],
                                      transactionNumber: "",
                                    })
                                    .then((result) => {
                                      setRestartEffect(true);
                                      setLoading(false);
                                    })
                                    .catch((err) => {
                                      //console.log(err);
                                    });
                                }}
                              >
                                <CloseIcon />
                              </Button>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={index}>{row[column.id]}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default StudentList;

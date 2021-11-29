import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../firebase/AuthContext";

//firebase
import { db } from "../firebase/firebase";
import { makeStyles } from "@material-ui/core/styles";
import { collection, getDocs, query, where } from "firebase/firestore";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import MovieIcon from "@material-ui/icons/Movie";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CreateIcon from "@material-ui/icons/Create";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    minWidth: 268,
  },
  head: {
    backgroundColor: theme.palette.primary,
    color: theme.palette.common.white,
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  table: {
    minWidth: 1500,
  },
}));

const columns = [
  {
    id: "mname",
    label: "Movie Name",
    minWidth: 300,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "description",
    label: "Description",
    minWidth: 300,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "director",
    label: "Director",
    minWidth: 200,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "url",
    label: "URL",
    minWidth: 50,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },

];

function createData(mname, description, director, url) {
  return { mname, description, director, url};
}

const MovieList = () => {
  const user = useContext(AuthContext);
  console.log(user.user.userDetails);

  const history = useHistory();
  const [nrows, setNrows] = useState([]);
  const [type, setType] = useState("viewer");
  const [active, setActive] = useState(false);
  const [array, setArray] = useState([]);

  useEffect(async () => {
    setArray([]);
    getDocs(query(collection(db, "Movie"))).then((query) => {
      query.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        array.push(
          createData(
            doc.data().mname,
            doc.data().description,
            doc.data().director,
            doc.data().url,
          )
        );
      });
      setNrows(array);
      //console.log(array);
    });
  }, []);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container style={{ minHeight: "80vh" }} maxWidth="sm">
     
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          className={classes.avatar}
          style={{ backgroundColor: "#e65100" }}
        >
          <MovieIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          style={{ marginBottom: "20px" }}
        >
          View Movies
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/view-bookings");
            
          }}
        >
          View Bookings
        </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/edit-users");

            }}
        >
          Edit profile
        </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
         <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/addbooking");

          }}
        >
          Add Bookings
        </Button>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "40px" }}>
          <br />
          <br />
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#bf360c",
                          color: "white",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nrows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={nrows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </Container>
  );
};
export default MovieList;

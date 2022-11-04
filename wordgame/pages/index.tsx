import {
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  Divider,
  Modal,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import type { NextPage } from "next";
import React from "react";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";
import {
  checkLastLetter,
  deleteNameFromArray,
  pickName,
  searchName,
} from "../helpers";
import names from "../../names.json";
import { IWindow } from "../constants";
import { useMicrophone } from "../hooks";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

let nameArray = [
  ...names.filter((name) => {
    return name.slice(-1) !== "ğ";
  }),
];

const WordGame: NextPage = () => {
  const [nickname, setNickname] = React.useState("");
  const [turnSide, setTurnSide] = React.useState("computer");
  const [timer, setTimer] = React.useState(true);
  const [modalText, setModalText] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("easy");
  const [lastPickedName, setLastPickedName] = React.useState<string>("");
  const [pickedArray, setPickedArray] = React.useState<string[]>([]);
  const [picked, setPicked] = React.useState<string>("");
  const [winner, setWinner] = React.useState<string>("");
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const nicknameInputRef = React.useRef<HTMLInputElement>(null);

  const { startRecording, stopRecording, isRecording } =
    useMicrophone(setPicked);

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDifficulty((event.target as HTMLInputElement).value);
  };

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (turnSide === "computer" && nickname !== "") {
      stopRecording();
      timeout = setTimeout(() => {
        let newPicked = pickName(
          nameArray,
          difficulty,
          pickedArray,
          lastPickedName as string
        );
        if (newPicked == null) {
        } else {
          if (pickedArray.includes(newPicked as string)) {
            setModalText(`Computer said ${newPicked} and it was already said.`);
            setWinner("user");
            setOpenModal(true);
          }
          setPickedArray((prevArray: string[]) => {
            return [newPicked as string, ...prevArray];
          });
          setLastPickedName(newPicked as string);
          deleteNameFromArray(nameArray, newPicked as string);
          setTurnSide("user");
        }
      }, Math.floor(Math.random() * 8000));
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [
    turnSide,
    nickname,
    stopRecording,
    pickedArray,
    startRecording,
    lastPickedName,
    difficulty,
  ]);

  React.useEffect(() => {
    if (turnSide === "user" && picked === "") {
      startRecording();
      return;
    }
    if (turnSide === "user") {
      let newUserPickedName = picked.toLocaleLowerCase().trim();
      if (!checkLastLetter(lastPickedName, newUserPickedName)) {
        setModalText(
          `${nickname} said "${newUserPickedName}" which doesn't start with the letter ${lastPickedName.slice(
            -1
          )}`
        );
        setWinner("computer");
        setOpenModal(true);
      } else if (
        checkLastLetter(lastPickedName, newUserPickedName) &&
        searchName(nameArray, newUserPickedName) == -1
      ) {
        setModalText(
          `${nickname} said "${newUserPickedName}" which is not a valid name`
        );
        setWinner("computer");
        setOpenModal(true);
      } else if (
        checkLastLetter(lastPickedName, newUserPickedName) &&
        searchName(nameArray, newUserPickedName) !== -1
      ) {
        setPickedArray((prevArray: string[]) => {
          return [newUserPickedName, ...prevArray];
        });
        setLastPickedName(newUserPickedName);
        deleteNameFromArray(nameArray, newUserPickedName);
        setTurnSide("computer");
      } else {
        setWinner("computer");
        setOpenModal(true);
      }
      setPicked("");
    }
  }, [lastPickedName, nickname, picked, startRecording, turnSide]);

  return (
    <Grid
      container
      display={"flex"}
      minHeight={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        backgroundColor: "#EFC8B1",
        background: "url(/background2.jpeg)",
        backgroundSize: "cover",
      }}
    >
      <Paper
        sx={{
          borderRadius: "10px",
          padding: "16px",
          minWidth: "100vh",
          minHeight: nickname === "" ? "50vh" : "60vh",
        }}
        elevation={5}
      >
        {nickname === "" ? (
          <Grid
            container
            spacing={2}
            item
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            minHeight="inherit"
          >
            <Grid item>
              <Typography>Please enter your nickname</Typography>
            </Grid>
            <Grid item>
              <TextField
                inputRef={nicknameInputRef}
                size="small"
                fullWidth
              ></TextField>
            </Grid>
            <Grid item>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Difficulty
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                >
                  <FormControlLabel
                    value="easy"
                    control={<Radio />}
                    label="Easy"
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value="hard"
                    control={<Radio />}
                    label="Hard"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  fontFamily: "Courier New",
                }}
                variant="contained"
                onClick={(e) => {
                  setNickname(nicknameInputRef.current!.value);
                }}
              >
                PLAY
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            item
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems="center"
            minHeight={"inherit"}
          >
            <Grid
              item
              display={"flex"}
              flexDirection="column"
              alignItems={"center"}
            >
              <Typography>Computer</Typography>
              <ComputerIcon
                sx={{
                  fontSize: "5rem",
                }}
                fontSize="large"
              />
              {turnSide === "computer" ? (
                <>
                  <CountdownCircleTimer
                    isPlaying={timer}
                    duration={8}
                    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                    colorsTime={[7, 5, 2, 0]}
                    size={50}
                    onComplete={() => {
                      if (!openModal) {
                        setModalText(
                          `Computer couldn't find any names starting with the letter ${lastPickedName.slice(
                            -1
                          )}`
                        );
                        setWinner("user");
                        setOpenModal(true);
                      }
                    }}
                  >
                    {({ remainingTime }) => remainingTime}
                  </CountdownCircleTimer>
                </>
              ) : (
                <Typography>{lastPickedName}</Typography>
              )}
            </Grid>
            <Modal
              open={openModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography
                  paddingBottom={5}
                  color="black"
                  variant="h6"
                  component="h2"
                >
                  YOU {winner === "user" ? "WON" : "LOST"}
                </Typography>
                <Typography
                  paddingBottom={2}
                  color="black"
                  variant="h6"
                  component="h2"
                >
                  {modalText}
                </Typography>
                <Typography paddingBottom={5} color="black" component="h2">
                  GAME WENT ON {pickedArray.length} ROUNDS
                </Typography>
                <Typography paddingBottom={5} color="black" component="h2">
                  {pickedArray.join(" ")}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPicked("");
                    setLastPickedName("");
                    setWinner("");
                    setPickedArray([]);
                    nameArray = [...names];
                    setTurnSide("computer");
                    setOpenModal(false);
                    setTimer(true);
                  }}
                >
                  PLAY AGAIN
                </Button>
              </Box>
            </Modal>
            <Divider
              sx={{
                minWidth: "90vh",
              }}
              variant="middle"
            >
              vs
            </Divider>
            <Grid
              item
              display={"flex"}
              flexDirection="column"
              alignItems={"center"}
            >
              {turnSide === "user" ? (
                <CountdownCircleTimer
                  isPlaying
                  duration={8}
                  colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                  colorsTime={[7, 5, 2, 0]}
                  size={50}
                  onComplete={() => {
                    if (!openModal) {
                      setModalText(
                        `User couldn't find any names starting with the letter ${lastPickedName.slice(
                          -1
                        )}`
                      );
                      setWinner("computer");
                      setOpenModal(true);
                    }
                  }}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              ) : (
                <Typography>{lastPickedName}</Typography>
              )}
              <PersonIcon
                sx={{
                  fontSize: "5rem",
                }}
                fontSize="large"
              />
              <Typography>{nickname}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default WordGame;

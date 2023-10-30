import * as React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import Alert from '@mui/material/Alert';
import MicIcon from '@mui/icons-material/Mic';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

function App() {
  const [text, setText] = useState("");
  const [isCopied, setCopied] = useClipboard(text,{successDuration:1000});




  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

    const [listening, setListening] = useState(false);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [micAlert, setMicAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");


    useEffect(() => {
      // check mic access at mount
      checkMicrophoneAccess();
    }, []);

    // call this method whenever want to check for mic access
    const checkMicrophoneAccess = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsMicrophoneAvailable(true);
        })
        .catch((error) => {
          setIsMicrophoneAvailable(false);
        });
    };

    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    });
    function SlideTransition(props) {
      return <Slide {...props} direction="up" />;
    }
    

  // const toggleSpeechRecognition = () => {
  //   if (!isMicrophoneAvailable) {
  //     // Ask for permission if microphone is not available

  //     //first
  //     //<Alert severity="info">This is an info alert — check it out!</Alert>

  //     //second
  //     // const confirmed = window.confirm("Allow access to your microphone?");
  //     // if (confirmed) {
  //     //   resetTranscript();
  //     //   SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  //     //   setListening(true);
  //     //   alert("Microphone is now turned on!");
  //     // }
      
  //     //third
  //     navigator.mediaDevices.getUserMedia({ audio: true })
  //       .then(() => {
  //         // Permission granted, start listening
  //         resetTranscript();
  //         SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  //         setListening(true);
  //         alert("Microphone is now turned on!");
  //       })
  //       .catch(error => {
  //         console.error('Error accessing microphone:', error);
  //       });
  //   } else {
  //     if (listening) {
  //       SpeechRecognition.stopListening()
  //     } else {
  //       resetTranscript();
  //       SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  //     }
  //     setListening(!listening);
  //   }
  // };

  const toggleSpeechRecognition = () => {
    console.log("avaiable: ", isMicrophoneAvailable);
    if (!isMicrophoneAvailable) {
      // mic permission not give so show alert

      //Transition Dialog
       {setOpen(true)};
      //Transition Dialog
    } else {
      if (listening) {
        SpeechRecognition.stopListening();
        setMicAlert(true);
        setAlertMessage("Listening stopped");
      } else {
        resetTranscript();
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
        });
        setMicAlert(true);
        setAlertMessage("Listening now");
      }
      setListening(!listening);
    }
  };


  // const toggleSpeechRecognition = () => {
  //   console.log("avaiable: ", isMicrophoneAvailable);
  //   if (!isMicrophoneAvailable) {
  //     // mic permission not give so show alert
  //     alert("Please give permission and follow these steps to allow");
  //   } else {
  //     if (listening) {
  //       SpeechRecognition.stopListening();
  //       alert("Listening stopped");
  //     } else {
  //       resetTranscript();
  //       SpeechRecognition.startListening({
  //         continuous: true,
  //         language: "en-IN",
  //       });
  //       alert("Listening now");
  //     }
  //     setListening(!listening);
  //   }
  // };


  const handleClose = () => {
    setOpen(false);
  };
  const handleContentChange = (event) => {
    setText(event.target.innerText);
  };

  if (!browserSupportsSpeechRecognition) {
    return <Alert severity="error">Web Speech API is not supported in this browser.</Alert>;
  }
  return (
    <>
      <div className="container">
        <h2>Speech-to-Text</h2>
        <br />
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis alias
          quidem, consectetur impedit pariatur cumque dicta velit dolor
          laboriosam eveniet?
        </p>

        <div className="main-content" onClick={() => setText(transcript)} >
          {transcript}
        </div>
        {console.log(transcript)}
        <div className="btn-style">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={setCopied}>{isCopied ? "Copied! 👍" : "Copy"}</Button>
          <Button
              onClick={toggleSpeechRecognition}
              size="small"
              variant="contained"
              style={{ backgroundColor: listening ? "red" : "#1976d2" }}>
              <MicIcon style={{ color: "white" }} />
          </Button>
          </Stack>
          <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Allow microphone access to this site"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Go to site information icon on search bar to enable microphone access.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>OK</Button>
                </DialogActions>
          </Dialog>
          <Snackbar
            open={micAlert}
            autoHideDuration={6000}
            onClose={() => setMicAlert(false)}
            message={alertMessage}
            TransitionComponent={Slide} // Add this line
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Customize as needed
          />
          

        </div>
      </div>
    </>
  );
}

export default App;

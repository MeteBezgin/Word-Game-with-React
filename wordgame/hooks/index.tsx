import React from "react";
import { IWindow, SpeechRecognitionEvent } from "../constants";

export const useMicrophone = (onResult: (val: string) => void) => {
  const micRef = React.useRef<IWindow["webkitSpeechRecognition"]>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [results, setResults] = React.useState();
  const startRecording = React.useCallback(() => {
    if (micRef.current && !isRecording) {
      micRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  const stopRecording = React.useCallback(() => {
    if (micRef.current && isRecording) {
      micRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  React.useEffect(() => {
    if (!micRef.current) {
      const customWindow: IWindow = window;
      const SpeechRecognition = customWindow.webkitSpeechRecognition;
      const microphone = new SpeechRecognition();
      microphone.lang = "tr-TR";
      microphone.start();
      microphone.stop();

      micRef.current = microphone;
    }
  }, [onResult]);

  React.useEffect(() => {
    let microphone = micRef.current;
    let microphoneCallback = (event: SpeechRecognitionEvent) => {
      onResult(event.results[event.results.length - 1][0].transcript);
    };
    if (microphone) {
      microphone.addEventListener("result", microphoneCallback);
    }

    return () => {
      if (microphone)
        microphone.removeEventListener("result", microphoneCallback);
    };
  }, [onResult]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    micRef,
  };
};

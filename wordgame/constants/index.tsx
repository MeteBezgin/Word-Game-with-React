export interface IDifficultyValues {
  [index: string]: number;
}

export interface IWindow extends Window {
  webkitSpeechRecognition?: any; //These doesn't have any other option other than creating the interface for constructor on my own
  webkitSpeechGrammarList?: any;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export const difficultyValues: IDifficultyValues = {
  easy: 0.3,
  medium: 0.2,
  hard: 0.1,
};

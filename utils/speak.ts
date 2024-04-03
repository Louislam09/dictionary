import * as Speech from "expo-speech";

const speakWord = (wordToSay: string) => {
    Speech.speak(wordToSay, {
        language: "es-DO",
    });
};

export default speakWord
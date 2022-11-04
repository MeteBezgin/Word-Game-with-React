import { SetStateAction } from "react";
import { difficultyValues, IDifficultyValues } from "../constants";

export const pickName = (
  nameArray: string[],
  difficulty: keyof IDifficultyValues,
  pickedArray: string[],
  pickedName?: string
) => {
  //This is for determining if computer loses
  if (
    pickedArray.length !== 0 &&
    Math.random() < difficultyValues[difficulty]
  ) {
    //Computer's losing variety between two options
    if (Math.random() < 0.5) {
      //Computer losing because it picks name from already picked name
      let newNameArray = pickedArray.filter(
        (name) => name.slice(0, 1) === pickedName?.slice(-1)
      );
      return newNameArray[Math.floor(Math.random() * newNameArray.length)];
    }
    //Computer losing because it can't pick any name in given time
    return null;
  }
  //Computer is not losing in this draw
  if (pickedName && pickedName !== "") {
    let newNameArray = nameArray.filter((e) => {
      return checkLastLetter(pickedName, e);
    });
    return newNameArray[Math.floor(Math.random() * newNameArray.length)];
  }
  //First draw of names for computer
  return nameArray[Math.floor(Math.random() * nameArray.length)];
};

export const deleteNameFromArray = (nameArray: string[], lastName: string) => {
  const index = nameArray.indexOf(lastName);
  nameArray.splice(index, 1);
  return nameArray;
};

export const searchName = (nameArray: string[], value: string) => {
  return nameArray.indexOf(value);
};

export const checkLastLetter = (lastName: string, pickedName: string) => {
  if (
    lastName.slice(-1).toLocaleLowerCase() ===
    pickedName.slice(0, 1).toLocaleLowerCase()
  )
    return true;
  return false;
};

/**
 *
 * This is normally the way to search big arrays but in our case the array is not that big and doesn't provide us
 * more value than Array.indexOf() function. The array isn't sorted already so to sort it and then searching through it
 * with binary is not more efficient.
 *
 * **/

/* export const searchNameWithBinary = (nameArray: string[], value: string) => {
  let startIndex = 0,
    stopIndex = nameArray.length - 1,
    middle = Math.floor((stopIndex + startIndex) / 2);
  const localeSort = Array.from(nameArray).sort((a, b) => {
    return a.localeCompare(b, "tr", { sensitivity: "base" });
  });

  while (localeSort[middle] != value && startIndex < stopIndex) {
    if (value < localeSort[middle]) {
      stopIndex = middle - 1;
    } else if (value > localeSort[middle]) {
      startIndex = middle + 1;
    }
    middle = Math.floor((stopIndex + startIndex) / 2);
  }
  console.log(startIndex, stopIndex);
  return localeSort[middle] != value ? -1 : middle;
}; */

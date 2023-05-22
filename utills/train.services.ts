import { readFile } from "fs/promises";
import { TrainPayload } from "./types";

export const takeDbFromFile = async (trainDbPath: string) => {
  //take train db
  const trainsDbFile = await readFile(trainDbPath, "utf-8");

  //parse to readable data array
  const trainDbData: TrainPayload[] = JSON.parse(trainsDbFile);

  return trainDbData;
};

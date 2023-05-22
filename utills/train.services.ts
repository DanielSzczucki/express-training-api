import { writeFile, readFile } from "fs/promises";
import { TrainPayload } from "./types";
import { Response } from "express";

export const takeDbFromFile = async (trainDbPath: string) => {
  //take train db
  const trainsDbFile = await readFile(trainDbPath, "utf-8");

  //parse to readable data array
  const trainDbData: TrainPayload[] = JSON.parse(trainsDbFile);

  return trainDbData;
};

export const saveTrainDb = async (db: TrainPayload[], dbPath: string) => {
  await writeFile(dbPath, JSON.stringify(db), "utf-8");
};

export const handleServerError = (res: Response) => {
  res.status(500).json({ message: "Something went wrong, sorry" });
};

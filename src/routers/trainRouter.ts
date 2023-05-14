import express from "express";
import { promises as fsPromises } from "fs";
import { trainDbPath } from "../../utills/dbmockup";

export const trainRouter = express.Router();

trainRouter.post("/trains", async (req, res) => {
  const newTrain = req.body.train;

  try {
    //take train db
    const trainsDbFile = await fsPromises.readFile(trainDbPath, "utf-8");

    //parse to readable data string
    const trainDbData: TrainPayload[] = JSON.parse(trainsDbFile);

    //add id to train
    const updatedTrain: TrainPayload = {
      id: `${trainDbData.length + 1}`,
      ...newTrain,
    };

    //add new train to array
    trainDbData.push(updatedTrain);

    // save updated db
    await fsPromises.writeFile(
      trainDbPath,
      JSON.stringify(trainDbData),
      "utf-8"
    );

    res.status(200).json({ message: "Train saved" });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, sorry" });
  }
});
import express from "express";
import { promises as fsPromises } from "fs";
import { trainDbPath } from "../../utills/dbmockup";
import { TrainPayload } from "../../utills/types";

export const trainRouter = express.Router();

trainRouter
  .post("/trains", async (req, res) => {
    const newTrain = req.body.train;

    try {
      //take train db
      const trainsDbFile = await fsPromises.readFile(trainDbPath, "utf-8");

      //parse to readable data array
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

      res.status(200).json({ message: "Train saved", train: updatedTrain });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  })

  .get("/trains", async (req, res) => {
    try {
      //take train db
      const trainsDbFile = await fsPromises.readFile(trainDbPath, "utf-8");

      //parse to readable data array
      const trainDbData: TrainPayload[] = JSON.parse(trainsDbFile);

      res
        .status(200)
        .json({ message: "All trains are downloaded", trains: trainDbData });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  })

  .put("/trains/:id", async (req, res) => {
    try {
      const newTrainData = req.body.train;
      const idToUpdate = req.params.id;
      //take train db
      const trainsDbFile = await fsPromises.readFile(trainDbPath, "utf-8");

      //parse to readable data array
      const trainDbData: TrainPayload[] = JSON.parse(trainsDbFile);

      //find a train and update array

      const updatedDbTrainsArray = trainDbData.map((train) => {
        if (train.id === idToUpdate) {
          // update drain if has matched id
          const updatedTrain: TrainPayload = {
            id: idToUpdate,
            ...newTrainData,
          };
          return updatedTrain;
        }
        return train;
      });

      // save updated db
      await fsPromises.writeFile(
        trainDbPath,
        JSON.stringify(updatedDbTrainsArray),
        "utf-8"
      );

      const updatedTrainIdNumber = Number(idToUpdate) - 1;

      res.status(200).json({
        message: "Train saved",
        train: updatedDbTrainsArray[updatedTrainIdNumber],
      });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  });

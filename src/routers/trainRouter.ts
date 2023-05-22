import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { TrainPayload } from "../../utills/types";
import {
  handleServerError,
  saveTrainDb,
  takeDbFromFile,
} from "../../utills/train.services";

const trainsDbPath = process.env.DB_PATH;

export const trainRouter = express.Router();

trainRouter
  .post("/trains", async (req, res) => {
    try {
      const newTrain = req.body.train;
      const trainsDb = await takeDbFromFile(trainsDbPath);

      const updatedTrain: TrainPayload = {
        id: `${trainsDb.length + 1}`,
        ...newTrain,
      };

      trainsDb.push(updatedTrain);
      await saveTrainDb(trainsDb, trainsDbPath);

      res.status(200).json({ message: "Train saved", train: updatedTrain });
    } catch (e) {
      handleServerError(res);
    }
  })

  .get("/trains", async (req, res) => {
    try {
      const trainsDb = await takeDbFromFile(trainsDbPath);

      res
        .status(200)
        .json({ message: "All trains are downloaded", trains: trainsDb });
    } catch (e) {
      handleServerError(res);
    }
  })

  .put("/trains/:id", async (req, res) => {
    try {
      const newTrainData = req.body.train;
      const idToUpdate = req.params.id;
      const trainsDb = await takeDbFromFile(trainsDbPath);

      //find a train and update array
      const updatedDbTrainsArray = trainsDb.map((train) => {
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

      await saveTrainDb(updatedDbTrainsArray, trainsDbPath);
      const updatedTrainIdNumber = Number(idToUpdate) - 1;

      res.status(200).json({
        message: "Train updated",
        train: updatedDbTrainsArray[updatedTrainIdNumber],
      });
    } catch (e) {
      handleServerError(res);
    }
  })

  .delete("/trains/:id", async (req, res) => {
    try {
      let deletedTrain = null;
      const idToDelete = req.params.id;
      const trainsDb = await takeDbFromFile(trainsDbPath);

      const updatedDbTrainsArray = trainsDb.filter((train) => {
        if (train.id !== idToDelete) {
          return true;
        } else {
          deletedTrain = train;
          return false;
        }
      });

      await saveTrainDb(updatedDbTrainsArray, trainsDbPath);

      res.status(200).json({
        message: "Train deleted",
        train: deletedTrain,
      });
    } catch (e) {
      handleServerError(res);
    }
  });

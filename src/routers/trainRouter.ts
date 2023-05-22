import express from "express";
import { promises as fsPromises } from "fs";
import { trainDbPath } from "../../utills/dbmockup";
import { TrainPayload } from "../../utills/types";
import { takeDbFromFile } from "../../utills/train.services";

export const trainRouter = express.Router();

trainRouter
  .post("/trains", async (req, res) => {
    const newTrain = req.body.train;

    try {
      //take train db
      const trainsDb = await takeDbFromFile(trainDbPath);

      //add id to train
      const updatedTrain: TrainPayload = {
        id: `${trainsDb.length + 1}`,
        ...newTrain,
      };

      //add new train to array
      trainsDb.push(updatedTrain);

      // save updated db
      await fsPromises.writeFile(
        trainDbPath,
        JSON.stringify(trainsDb),
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
      const trainsDb = await takeDbFromFile(trainDbPath);

      res
        .status(200)
        .json({ message: "All trains are downloaded", trains: trainsDb });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  })

  .put("/trains/:id", async (req, res) => {
    try {
      const newTrainData = req.body.train;
      const idToUpdate = req.params.id;
      //take train db
      const trainsDb = await takeDbFromFile(trainDbPath);

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

      // save updated db
      await fsPromises.writeFile(
        trainDbPath,
        JSON.stringify(updatedDbTrainsArray),
        "utf-8"
      );

      const updatedTrainIdNumber = Number(idToUpdate) - 1;

      res.status(200).json({
        message: "Train updated",
        train: updatedDbTrainsArray[updatedTrainIdNumber],
      });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  })

  .delete("/trains/:id", async (req, res) => {
    try {
      const idToDelete = req.params.id;
      let deletedItem = null;

      //take train db
      const trainsDb = await takeDbFromFile(trainDbPath);

      //find a train and delete it, return new array and deleted train

      const updatedDbTrainsArray = trainsDb.filter((train) => {
        if (train.id !== idToDelete) {
          return true; // eturning true for elements witch are not deleted
        } else {
          deletedItem = train; // assigns an train to a variable
          return false; // returning false for elements witch are deletet
        }
      });

      // save updated db
      await fsPromises.writeFile(
        trainDbPath,
        JSON.stringify(updatedDbTrainsArray),
        "utf-8"
      );

      res.status(200).json({
        message: "Train deleted",
        train: deletedItem,
      });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, sorry" });
    }
  });

interface CreateTrainPayload {
  trainExpressName: string;
  countryOfOrigin: string;
  yearOfConstruction: string;
  maxKilometerPerHour: string;
  destinationFrom: string;
  destinationTo: string;
}

interface TrainPayload extends CreateTrainPayload {
  id: string;
}

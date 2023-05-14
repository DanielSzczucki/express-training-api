export interface CreateTrainPayload {
  trainExpressName: string;
  countryOfOrigin: string;
  yearOfConstruction: string;
  maxKilometerPerHour: string;
  destinationFrom: string;
  destinationTo: string;
}

export interface TrainPayload extends CreateTrainPayload {
  id: string;
}

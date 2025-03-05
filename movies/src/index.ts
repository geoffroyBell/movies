import express from "express";
import { json } from "express";
import mongoose from "mongoose";
import { moviesRouter } from "./routes/movies";
import { errorHandler } from "./middlewares/error-handler";
// import { KafkaService } from "./services/kafka";

// const initKafka = async () => {
//   const kafkaService = new KafkaService({ enableConsumer: true });
//   await kafkaService.connect();
//   kafkaService.subscribe("signup-user", async (data) => {
//     console.log("Message reçu du topic signup-user:", data);
//     // Ajoutez ici votre logique de traitement des données utilisateur
//   });
// };

// initKafka();

const app = express();

app.use(json());
//app.use(messageRouter);
app.use("/api/movies", moviesRouter);
app.use(errorHandler as express.ErrorRequestHandler);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://root:root@mongodb:27017/goodfood?authSource=admin"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }

  app.listen(4004, "0.0.0.0", () => {
    console.log("Listen on 4004------movies");
  });
};

start();

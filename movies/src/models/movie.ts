import mongoose from "mongoose";

interface IMovie {
  type: string;
  title: string;
  year: number;
  genres: string[];
  awards: {
    wins: number;
    nominations: number;
    text: string;
  };
}

const movieSchema = new mongoose.Schema<IMovie>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: Number },
  genres: [{ type: String }],
  awards: {
    wins: { type: Number, default: 0 },
    nominations: { type: Number, default: 0 },
    text: String,
  },
});

export const Movie = mongoose.model<IMovie>("Movie", movieSchema, "restaurant");

import express from "express";
import { MoviesController } from "../controllers/movies";

const router = express.Router();

router.get("/total-movies", MoviesController.getTotalMovies);
router.get("/total-series", MoviesController.getTotalSeries);
router.get("/content-types", MoviesController.getContentTypes);
router.get("/genres", MoviesController.getGenres);
router.get("/recent-movies", MoviesController.getRecentMovies);
router.get("/award-winning", MoviesController.getAwardWinningMovies);

// Nouvelles routes ajoutées
router.get("/french-movies-count", MoviesController.getFrenchMoviesCount);
router.get("/thriller-drama-count", MoviesController.getThrillerDramaCount);
router.get("/crime-thriller-movies", MoviesController.getCrimeThrillerMovies);
router.get("/french-italian-movies", MoviesController.getFrenchItalianMovies);
router.get("/high-rated-movies", MoviesController.getHighRatedMovies);
router.get("/four-actors-count", MoviesController.getFourActorsCount);
router.post("/add-movie", MoviesController.addMovie);

export { router as moviesRouter };

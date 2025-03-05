import { Request, Response } from "express";
import { Movie } from "../models/movie";
import { BadRequestError, NotFoundError } from "../errors";

export class MoviesController {
  // 1. Nombre total de films
  static async getTotalMovies(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({ type: "movie" });
      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des films",
      });
    }
  }

  // 2. Nombre total de séries
  static async getTotalSeries(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({ type: "series" });
      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des séries",
      });
    }
  }

  // 3. Types de contenu différents
  static async getContentTypes(req: Request, res: Response) {
    try {
      const types = await Movie.distinct("type");
      res.status(200).json({
        success: true,
        types,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des types",
      });
    }
  }

  // 4. Liste des genres
  static async getGenres(req: Request, res: Response) {
    try {
      const genres = await Movie.distinct("genres");
      res.status(200).json({
        success: true,
        genres,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des genres",
      });
    }
  }

  // 5. Films depuis 2015 par ordre décroissant
  static async getRecentMovies(req: Request, res: Response) {
    try {
      const movies = await Movie.find({
        year: { $gte: 2015 },
        type: "movie",
      })
        .sort({ year: -1 })
        .select("title year genres");

      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des films récents",
      });
    }
  }

  // 6. Films depuis 2015 avec 5+ récompenses
  static async getAwardWinningMovies(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({
        year: { $gte: 2015 },
        type: "movie",
        "awards.wins": { $gte: 5 },
      });

      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des films primés",
      });
    }
  }

  // 7. Nombre de films disponibles en français
  static async getFrenchMoviesCount(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({
        languages: "French",
        type: "movie",
      });
      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des films en français",
      });
    }
  }

  // 8. Films de genre Thriller ET Drama
  static async getThrillerDramaCount(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({
        genres: { $all: ["Thriller", "Drama"] },
      });
      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des films Thriller et Drama",
      });
    }
  }

  // 9. Films de genre Crime OU Thriller
  static async getCrimeThrillerMovies(req: Request, res: Response) {
    try {
      const movies = await Movie.find({
        genres: { $in: ["Crime", "Thriller"] },
      }).select("title genres");
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des films Crime ou Thriller",
      });
    }
  }

  // 10. Films disponibles en français ET italien
  static async getFrenchItalianMovies(req: Request, res: Response) {
    try {
      const movies = await Movie.find({
        languages: { $all: ["French", "Italian"] },
      }).select("title languages");
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la récupération des films en français et italien",
      });
    }
  }

  // 11. Films avec note IMDB > 9
  static async getHighRatedMovies(req: Request, res: Response) {
    try {
      const movies = await Movie.find({
        "imdb.rating": { $gt: 9 },
      }).select("title genres");
      res.status(200).json({
        success: true,
        count: movies.length,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des films bien notés",
      });
    }
  }

  // 12. Contenus avec exactement 4 acteurs
  static async getFourActorsCount(req: Request, res: Response) {
    try {
      const count = await Movie.countDocuments({
        $expr: { $eq: [{ $size: "$cast" }, 4] },
      });
      res.status(200).json({
        success: true,
        total: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des contenus avec 4 acteurs",
      });
    }
  }

  // Ajouter un nouveau film
  static async addMovie(req: Request, res: Response): Promise<any> {
    // Validation des données requises
    const requiredFields = ["title", "type", "year"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new BadRequestError(`Le champ ${field} est obligatoire`);
      }
    }

    // Validation du type
    if (!["movie", "series"].includes(req.body.type)) {
      throw new BadRequestError("Le type doit être 'movie' ou 'series'");
    }

    // Validation de l'année
    const year = parseInt(req.body.year);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      throw new BadRequestError("L'année n'est pas valide");
    }

    // Validation du rating IMDB si présent
    if (req.body.imdb?.rating) {
      const rating = parseFloat(req.body.imdb.rating);
      if (isNaN(rating) || rating < 0 || rating > 10) {
        throw new BadRequestError(
          "La note IMDB doit être comprise entre 0 et 10"
        );
      }
    }

    // Création du nouveau film
    const newMovie = new Movie({
      title: req.body.title,
      type: req.body.type,
      year: year,
      genres: req.body.genres || [],
      languages: req.body.languages || [],
      cast: req.body.cast || [],
      directors: req.body.directors || [],
      imdb: req.body.imdb || {},
      awards: req.body.awards || { wins: 0, nominations: 0, text: "" },
    });

    await newMovie.save();

    res.status(201).json({
      success: true,
      message: "Film ajouté avec succès",
      data: newMovie,
    });
  }
}

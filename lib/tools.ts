import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const tools: FunctionDeclaration[] = [
  {
    name: "getMovies",
    description:
      "Get all movies on the watchlist. Call this when the user wants to see their movies or when you need to find a movie id before marking as watched or removing.",
  },
  {
    name: "addMovie",
    description: "Add a new movie to the watchlist.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "The title of the movie to add",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "markAsWatched",
    description: "Mark a movie as watched using its id.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: {
          type: SchemaType.STRING,
          description: "The id of the movie to mark as watched",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "removeMovie",
    description: "Remove a movie from the watchlist using its id.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: {
          type: SchemaType.STRING,
          description: "The id of the movie to remove",
        },
      },
      required: ["id"],
    },
  },
];

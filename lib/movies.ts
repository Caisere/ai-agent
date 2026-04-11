import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

type Movie = {
  id: string;
  title: string;
  watched: boolean;
  addedAt: string;
};

const filePath = path.join(process.cwd(), "data/movies.json");

export async function getMovies(): Promise<Movie[]> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function saveMovies(movies: Movie[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(movies, null, 2));
}

export async function addMovie(title: string): Promise<Movie> {
  const movies = await getMovies();
  const newMovie: Movie = {
    id: uuidv4(),
    title,
    watched: false,
    addedAt: new Date().toISOString(),
  };
  await saveMovies([...movies, newMovie]);
  return newMovie;
}

export async function markAsWatched(id: string): Promise<Movie | null> {
  const movies = await getMovies();
  const updated = movies.map((m) =>
    m.id === id ? { ...m, watched: true } : m,
  );
  await saveMovies(updated);
  return updated.find((m) => m.id === id) || null;
}

export async function removeMovie(id: string): Promise<boolean> {
  const movies = await getMovies();
  const filtered = movies.filter((m) => m.id !== id);
  await saveMovies(filtered);
  return filtered.length < movies.length;
}
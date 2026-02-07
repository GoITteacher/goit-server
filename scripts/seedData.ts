import mongoose from "mongoose";

import { env } from "../src/utils/env.ts";

const SEED_COUNT = 25;

const makeUri = () => {
  const user = env("MONGODB_USER");
  const password = env("MONGODB_PASSWORD");
  const url = env("MONGODB_URL");
  const db = env("MONGODB_DB");
  return `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&ssl=true`;
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = (arr: string[], count: number) => {
  const set = new Set<string>();
  while (set.size < Math.min(count, arr.length)) {
    set.add(pick(arr));
  }
  return Array.from(set);
};

const randomDate = (daysOffset: number, future = false) => {
  const direction = future ? 1 : -1;
  const delta = Math.floor(Math.random() * daysOffset);
  return new Date(Date.now() + direction * delta * 24 * 60 * 60 * 1000);
};

const randomBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

const insertMany = async (collectionName: string, entries: object[]) => {
  await mongoose.connection.collection(collectionName).insertMany(entries);
  console.log(`${collectionName} seeded: ${entries.length}`);
};

const seedCatalogNews = () => {
  const categories = ["technology", "business", "health", "lifestyle", "science", "entertainment"];
  const sources = ["Global Post", "Daily Reporter", "Streamline News", "DataPulse"];
  const tags = ["insight", "feature", "trending", "analysis", "spotlight", "update"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    title: `Seeded Catalog Story #${index + 1}`,
    summary: `Summary for catalog story ${index + 1}.`,
    source: pick(sources),
    category: pick(categories),
    publishedAt: randomDate(90),
    url: `https://example.com/catalog/${index + 1}`,
    tags: pickMultiple(tags, 3),
  }));
};

const seedSongs = () => {
  const artists = ["Aurora Bloom", "Neon Tide", "Solar Drift", "Velvet Pulse"];
  const genres = ["pop", "indie", "electronic", "rock"];
  const labels = ["Northwind Records", "Silk & Steel", "Arcadia Sound", ""];
  const languages = ["English", "Spanish", "Ukrainian", "French"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    title: `Seeded Track ${index + 1}`,
    artist: pick(artists),
    album: `Seed Album ${Math.ceil((index + 1) / 5)}`,
    genre: pick(genres),
    releaseYear: randomBetween(2000, 2025),
    durationSeconds: randomBetween(120, 360),
    label: pick(labels),
    language: pick(languages),
  }));
};

const seedCars = () => {
  const makes = ["Orion", "Horizon", "Atlas", "Solstice"];
  const models = ["LX", "Sport", "GT", "Prime"];
  const colors = ["white", "black", "silver", "ruby"];
  const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"];

  return Array.from({ length: SEED_COUNT }, () => ({
    make: pick(makes),
    model: pick(models),
    year: randomBetween(2015, 2025),
    color: pick(colors),
    price: randomBetween(15000, 75000),
    mileage: randomBetween(0, 120000),
    fuelType: pick(fuelTypes),
    description: "Seeded car entry ready for showcase.",
  }));
};

const seedMovies = () => {
  const directors = ["Elias Moore", "Kira Patel", "Jin-Soo Park", "Marcelo Diaz"];
  const genres = ["drama", "thriller", "sci-fi", "documentary"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    title: `Seeded Movie ${index + 1}`,
    director: pick(directors),
    genre: pick(genres),
    releaseYear: randomBetween(1995, 2025),
    rating: Number((Math.random() * 4 + 6).toFixed(1)),
    durationMinutes: randomBetween(80, 150),
    language: "English",
    summary: `A sample summary for movie ${index + 1}.`,
  }));
};

const seedStudents = () => {
  const majors = ["Computer Science", "Design", "Business", "Data Science"];
  const names = ["Alex", "Rina", "Marco", "Daria", "Sophia"];
  const surnames = ["Peterson", "Koval", "Nguyen", "Malik", "Santos"];

  return Array.from({ length: SEED_COUNT }, () => ({
    firstName: pick(names),
    lastName: pick(surnames),
    major: pick(majors),
    cohortYear: randomBetween(2018, 2025),
    gpa: Number((Math.random() * 4).toFixed(2)),
    enrolled: Math.random() < 0.8,
  }));
};

const seedLessons = () => {
  const subjects = ["Mathematics", "Art History", "Biology", "Philosophy"];
  const teachers = ["Jordan Reed", "Mina Alvarez", "Sophie Zelenko", "Imani Brook"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    title: `Seeded Lesson ${index + 1}`,
    subject: pick(subjects),
    level: pick(["beginner", "intermediate", "advanced"]),
    durationMinutes: randomBetween(30, 120),
    teacher: pick(teachers),
    publishedAt: randomDate(180, true),
    summary: `Lesson summary ${index + 1}.`,
  }));
};

const seedProtectedNews = (userId: string, typeAccount: string) => {
  const topics = ["Growth", "Launch", "Reflection", "Guidance"];
  const types = ["updates", "news", "testimonials", "video stories"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    userId,
    topic: `${pick(topics)} ${index + 1}`,
    text: `Protected news body ${index + 1} for ${typeAccount}.`,
    type: pick(types),
    typeAccount,
    files: [`https://cdn.example.com/news/${index + 1}.jpg`],
  }));
};

const seedTasks = (userId: string) => {
  const statuses = ["todo", "in-progress", "done"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    userId,
    title: `Seeded Task ${index + 1}`,
    description: `Task description ${index + 1}.`,
    status: pick(statuses),
    dueDate: randomDate(30, true),
  }));
};

const seedNotes = (userId: string) => {
  const tagsPool = ["urgent", "idea", "follow-up", "reference"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    userId,
    title: `Seeded Note ${index + 1}`,
    content: `Note content for index ${index + 1}.`,
    tags: pickMultiple(tagsPool, 2),
    archived: Math.random() < 0.4,
  }));
};

const seedTodos = () => {
  const categories = ["Work", "Personal", "Errands", "Learning"];

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    title: `Seeded Todo ${index + 1}`,
    description: `Todo description ${index + 1}.`,
    completed: Math.random() < 0.5,
    priority: pick(["low", "medium", "high"]),
    dueDate: randomDate(15, true),
    category: pick(categories),
    tags: pickMultiple(["home", "office", "research", "gym"], 2),
  }));
};

const run = async () => {
  const uri = makeUri();
  await mongoose.connect(uri);
  console.log("Connected to MongoDB for seeding.");

  const userResult = await mongoose.connection.collection("users").insertOne({
    email: `seed-user-${Date.now()}@example.com`,
    name: "Seed User",
    passwordHash: "seed-hash",
    typeAccount: "freeUser",
  });

  const userId = userResult.insertedId.toString();
  const userType = "freeUser";

  await Promise.all([
    insertMany("catalognews", seedCatalogNews()),
    insertMany("songs", seedSongs()),
    insertMany("cars", seedCars()),
    insertMany("movies", seedMovies()),
    insertMany("students", seedStudents()),
    insertMany("lessons", seedLessons()),
    insertMany("news", seedProtectedNews(userId, userType)),
    insertMany("tasks", seedTasks(userId)),
    insertMany("notes", seedNotes(userId)),
    insertMany("todos", seedTodos()),
  ]);

  await mongoose.disconnect();
  console.log("Seeding complete. Disconnected.");
};

run().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});

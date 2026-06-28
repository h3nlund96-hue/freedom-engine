// Alpha storage only. Replace with database-backed storage later.

const STORAGE_KEY = "freedom-engine:idea-vault:v1";

export type IdeaStatus =
  | "raw"
  | "future-quest"
  | "side-quest-candidate"
  | "experiment";

export interface Idea {
  id: string;
  text: string;
  status: IdeaStatus;
  createdAt: string;
}

const SEED_IDEAS: Idea[] = [
  { id: "seed-1", text: "Environment Art Pass",    status: "raw", createdAt: new Date(Date.now() - 3000).toISOString() },
  { id: "seed-2", text: "Product Vision Docs",     status: "raw", createdAt: new Date(Date.now() - 2000).toISOString() },
  { id: "seed-3", text: "GitHub Repository Setup", status: "raw", createdAt: new Date(Date.now() - 1000).toISOString() },
];

export function getStoredIdeas(): Idea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) return JSON.parse(raw) as Idea[];
    // First visit — seed with examples
    saveStoredIdeas(SEED_IDEAS);
    return SEED_IDEAS;
  } catch {
    return [];
  }
}

export function saveStoredIdeas(ideas: Idea[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    // Storage unavailable — fail silently
  }
}

export function createIdea(text: string): Idea {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    status: "raw",
    createdAt: new Date().toISOString(),
  };
}

export function updateIdeaStatus(
  ideas: Idea[],
  id: string,
  status: IdeaStatus
): Idea[] {
  return ideas.map((idea) => (idea.id === id ? { ...idea, status } : idea));
}

export function deleteIdea(ideas: Idea[], id: string): Idea[] {
  return ideas.filter((idea) => idea.id !== id);
}

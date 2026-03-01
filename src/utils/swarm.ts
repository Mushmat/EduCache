import { Device, saveDevices } from "./storage";

const FAKE_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan",
  "Fiona", "George", "Hannah", "Ivan", "Julia",
];

const DOMAINS = ["Biology", "Physics", "Computer Science", "Mathematics", "Chemistry"];

export function generateFakeDevices(count: number = 5): Device[] {
  const shuffled = [...FAKE_NAMES].sort(() => Math.random() - 0.5);
  const devices: Device[] = shuffled.slice(0, count).map((name, i) => ({
    id: `fake-${i}`,
    name,
    conceptCount: Math.floor(Math.random() * 15) + 1,
    online: Math.random() > 0.2,
    lastSeen: Date.now() - Math.floor(Math.random() * 60000),
  }));
  saveDevices(devices);
  return devices;
}

export function generateFakeConcept(): { topic: string; domain: string; content: string } {
  const topics = [
    { topic: "DNA Replication", domain: "Biology", content: "Process of producing two identical replicas from one original DNA molecule" },
    { topic: "Ohm's Law", domain: "Physics", content: "V = IR, voltage equals current times resistance" },
    { topic: "Quick Sort", domain: "Computer Science", content: "Divide-and-conquer sorting algorithm with O(n log n) average" },
    { topic: "Pythagorean Theorem", domain: "Mathematics", content: "a² + b² = c² for right triangles" },
    { topic: "Periodic Table", domain: "Chemistry", content: "Tabular arrangement of chemical elements by atomic number" },
    { topic: "Graph Theory", domain: "Mathematics", content: "Study of graphs as mathematical structures modeling pairwise relations" },
    { topic: "Enzyme Catalysis", domain: "Biology", content: "Biological catalysts that speed up chemical reactions in cells" },
    { topic: "Wave Theory", domain: "Physics", content: "Description of light and sound as wave phenomena" },
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

export function getRandomSender(devices: Device[]): Device | null {
  const online = devices.filter(d => d.online);
  if (online.length === 0) return null;
  return online[Math.floor(Math.random() * online.length)];
}

export function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    "Biology": "text-success",
    "Physics": "text-primary",
    "Computer Science": "text-secondary",
    "Mathematics": "text-warning",
    "Chemistry": "text-destructive",
  };
  return map[domain] || "text-muted-foreground";
}

export function getDomainBg(domain: string): string {
  const map: Record<string, string> = {
    "Biology": "bg-success/10 border-success/30",
    "Physics": "bg-primary/10 border-primary/30",
    "Computer Science": "bg-secondary/10 border-secondary/30",
    "Mathematics": "bg-warning/10 border-warning/30",
    "Chemistry": "bg-destructive/10 border-destructive/30",
  };
  return map[domain] || "bg-muted border-border";
}

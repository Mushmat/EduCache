export interface Concept {
  id: string;
  topic: string;
  domain: string;
  content: string;
  source: string;
  timestamp: number;
}

export interface Device {
  id: string;
  name: string;
  conceptCount: number;
  online: boolean;
  lastSeen: number;
}

const CONCEPTS_KEY = "swarm_concepts";
const DEVICES_KEY = "swarm_devices";
const DEVICE_ID_KEY = "swarm_device_id";
const DEVICE_NAME_KEY = "swarm_device_name";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = "device-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceName(): string {
  return localStorage.getItem(DEVICE_NAME_KEY) || "You";
}

export function setDeviceName(name: string) {
  localStorage.setItem(DEVICE_NAME_KEY, name);
}

export function getConcepts(): Concept[] {
  const data = localStorage.getItem(CONCEPTS_KEY);
  return data ? JSON.parse(data) : getDefaultConcepts();
}

export function saveConcepts(concepts: Concept[]) {
  localStorage.setItem(CONCEPTS_KEY, JSON.stringify(concepts));
}

export function addConcept(concept: Concept) {
  const concepts = getConcepts();
  if (!concepts.find(c => c.id === concept.id)) {
    concepts.push(concept);
    saveConcepts(concepts);
  }
}

export function getDevices(): Device[] {
  const data = localStorage.getItem(DEVICES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDevices(devices: Device[]) {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
}

export function exportConcepts(conceptIds: string[]): string {
  const concepts = getConcepts().filter(c => conceptIds.includes(c.id));
  return JSON.stringify({
    type: "swarm_transfer",
    sender: getDeviceName(),
    senderId: getDeviceId(),
    concepts,
    timestamp: Date.now(),
  });
}

export function importTransfer(json: string): { sender: string; concepts: Concept[] } | null {
  try {
    const data = JSON.parse(json);
    if (data.type !== "swarm_transfer") return null;
    return { sender: data.sender, concepts: data.concepts };
  } catch {
    return null;
  }
}

function getDefaultConcepts(): Concept[] {
  const defaults: Concept[] = [
    { id: "c1", topic: "Photosynthesis", domain: "Biology", content: "Process by which plants convert light energy into chemical energy", source: "local", timestamp: Date.now() },
    { id: "c2", topic: "Newton's Laws", domain: "Physics", content: "Three fundamental laws of classical mechanics", source: "local", timestamp: Date.now() },
    { id: "c3", topic: "Bubble Sort", domain: "Computer Science", content: "Simple sorting algorithm that repeatedly swaps adjacent elements", source: "local", timestamp: Date.now() },
    { id: "c4", topic: "Mitochondria", domain: "Biology", content: "The powerhouse of the cell, generates ATP", source: "local", timestamp: Date.now() },
    { id: "c5", topic: "Binary Search", domain: "Computer Science", content: "Efficient search algorithm on sorted arrays, O(log n)", source: "local", timestamp: Date.now() },
  ];
  saveConcepts(defaults);
  return defaults;
}

import { Concept } from "@/types";

export const initialConcepts: Concept[] = [
  {
    id: "c1",
    topic: "Binary Search",
    domain: "Data Structures & Algorithms",
    difficulty: "intermediate",
    explanation: "Binary search is a search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element and eliminates half of the remaining elements in each step, achieving O(log n) time complexity."
  },
  {
    id: "c2",
    topic: "Photosynthesis",
    domain: "Biology",
    difficulty: "beginner",
    explanation: "Photosynthesis is the process by which green plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It occurs in the chloroplasts and is essential for life on Earth."
  },
  {
    id: "c3",
    topic: "Newton's Laws of Motion",
    domain: "Physics",
    difficulty: "beginner",
    explanation: "Newton's three laws describe the relationship between a body and the forces acting upon it. The first law states that an object at rest stays at rest unless acted upon by a force. The second law defines F=ma. The third law states every action has an equal and opposite reaction."
  },
  {
    id: "c4",
    topic: "TCP/IP Model",
    domain: "Computer Networks",
    difficulty: "intermediate",
    explanation: "The TCP/IP model is a four-layer networking framework: Application, Transport, Internet, and Network Access. It defines how data is packetized, addressed, transmitted, routed, and received across networks."
  },
  {
    id: "c5",
    topic: "Recursion",
    domain: "Data Structures & Algorithms",
    difficulty: "intermediate",
    explanation: "Recursion is a method of solving problems where a function calls itself as a subroutine. It requires a base case to terminate and is commonly used in tree traversals, divide-and-conquer algorithms, and dynamic programming."
  },
  {
    id: "c6",
    topic: "Ohm's Law",
    domain: "Physics",
    difficulty: "beginner",
    explanation: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points: V = IR, where V is voltage, I is current, and R is resistance."
  },
  {
    id: "c7",
    topic: "DNA Replication",
    domain: "Biology",
    difficulty: "advanced",
    explanation: "DNA replication is the biological process of producing two identical replicas of DNA from one original molecule. It involves helicase unwinding, primase adding RNA primers, DNA polymerase synthesizing new strands, and ligase sealing fragments."
  },
  {
    id: "c8",
    topic: "Hash Tables",
    domain: "Data Structures & Algorithms",
    difficulty: "intermediate",
    explanation: "A hash table is a data structure that maps keys to values using a hash function. It provides average O(1) time complexity for insertions, deletions, and lookups. Collision resolution strategies include chaining and open addressing."
  }
];

export const syllabusData: Concept[] = [
  {
    id: "s1",
    topic: "Graph Traversal (BFS/DFS)",
    domain: "Data Structures & Algorithms",
    difficulty: "advanced",
    explanation: "BFS explores all neighbors at the present depth before moving to nodes at the next depth level using a queue. DFS explores as far as possible along each branch before backtracking using a stack or recursion."
  },
  {
    id: "s2",
    topic: "Electromagnetic Induction",
    domain: "Physics",
    difficulty: "advanced",
    explanation: "Electromagnetic induction is the production of an electromotive force across an electrical conductor in a changing magnetic field, as described by Faraday's law. It is the fundamental operating principle of transformers, generators, and inductors."
  },
  {
    id: "s3",
    topic: "Cell Division – Mitosis",
    domain: "Biology",
    difficulty: "intermediate",
    explanation: "Mitosis is a type of cell division where a single cell divides to produce two genetically identical daughter cells. It consists of prophase, metaphase, anaphase, and telophase, followed by cytokinesis."
  },
  {
    id: "s4",
    topic: "HTTP Protocol",
    domain: "Computer Networks",
    difficulty: "beginner",
    explanation: "HTTP (HyperText Transfer Protocol) is an application-layer protocol for transmitting hypermedia documents. It follows a request-response model between a client and server, using methods like GET, POST, PUT, and DELETE."
  },
  {
    id: "s5",
    topic: "Sorting Algorithms",
    domain: "Data Structures & Algorithms",
    difficulty: "intermediate",
    explanation: "Sorting algorithms arrange elements in a particular order. Common algorithms include Bubble Sort O(n²), Merge Sort O(n log n), and Quick Sort O(n log n) average. Each has different space complexity and stability characteristics."
  }
];

/** Content extracted from the original single-page index.html. */

export interface TimelineEntry {
  era: string; year: string; date: string; role: string;
  href: string | null; body: string;
  badgeIcon: string | null; badgeLabel: string | null;
}

export const TIMELINE: TimelineEntry[] = [
  {
    "era": "era-current",
    "year": "2026",
    "date": "Jun 2026 — Present",
    "role": "Co-Founder at Updraft Consulting",
    "href": null,
    "body": "AI consulting firm with paying clients in mortgage and healthcare staffing. Architected seven AI workflows for a mortgage brokerage, from contract date extraction to refinance targeting, and built a GLBA-aligned data-handling framework classifying client data by sensitivity and approved processing environments. Co-lead sales — scoping and pitching engagements to presidents and review committees at firms up to $1B in revenue.",
    "badgeIcon": "⚡",
    "badgeLabel": "34 professionals trained — 83% requested more"
  },
  {
    "era": "era-current",
    "year": "2026",
    "date": "2026 — Present",
    "role": "Founder at Guleki",
    "href": "https://guleki.com",
    "body": "App publishing company focused on AI-native mobile experiences. Our first product, Geolocate Me, gives AI assistants real-time location context through a private GPS tracker with MCP integration — live on iOS and Android.",
    "badgeIcon": null,
    "badgeLabel": null
  },
  {
    "era": "era-career",
    "year": "2025",
    "date": "Sep 2025 — Mar 2026",
    "role": "Co-Founder & Technical Lead at Agori",
    "href": null,
    "body": "Early-stage fintech startup. Architected and shipped a real-time quantitative paper trading platform in 14 weeks using AI-native development workflows, then deployed it for a trading competition run with Old Mission Capital at the University of Michigan. Owned AWS infrastructure, security, developer tooling, and GitHub CI/CD. Recruited 4 team members and managed 3 reports while leading product strategy and supporting an angel raise.",
    "badgeIcon": "⚡",
    "badgeLabel": "Production platform shipped in 14 weeks"
  },
  {
    "era": "era-career",
    "year": "2025",
    "date": "Jun 2025 — Sep 2025",
    "role": "Technology Consultant — SC Sports",
    "href": null,
    "body": "Built the auction pricing system behind two live deployments, converting each lot into a max-bid recommendation against an ROI target. Encoded buyer's fees and bid multipliers for 18 auction houses so recommendations reflected true landed cost.",
    "badgeIcon": "⚡",
    "badgeLabel": "2,800 lots priced across two deployments"
  },
  {
    "era": "era-college",
    "year": "2024",
    "date": "2024 — Present",
    "role": "Wisconsin Quantum Computing Club",
    "href": null,
    "body": "Participating in seminars on quantum computing and quantum information. Competed in the 2024 IBM Fall Fest hackathon.",
    "badgeIcon": "🏆",
    "badgeLabel": "IBM Fall Fest — Community Favorite + First to Finish"
  },
  {
    "era": "era-college",
    "year": "2024",
    "date": "Oct 2024 — Dec 2025",
    "role": "Member At-Large — UW-Madison Vice Chancellor Study Group",
    "href": null,
    "body": "Selected through the Associated Students of Madison (ASM) Shared Governance process to represent the student body. Advised the Vice Chancellor for Finance and Administration and senior leaders monthly on food security, budget model changes, and renewable energy initiatives.",
    "badgeIcon": null,
    "badgeLabel": null
  },
  {
    "era": "era-career",
    "year": "2023",
    "date": "Mar 2023 — Jul 2024",
    "role": "Technology Consultant — Backpack Society",
    "href": null,
    "body": "Architected and pitched a systems overhaul for a nonprofit serving 70+ schools with kids in unstable food situations, winning funding from the leadership team. Designed and built the organization's new website on AWS, then advised the board on technology selection, implementation tradeoffs, and budget requests.",
    "badgeIcon": "⚡",
    "badgeLabel": "45% infrastructure cost reduction"
  },
  {
    "era": "era-highschool",
    "year": "2020",
    "date": "2020 — 2024",
    "role": "Cyberpatriots — Cisco Lead",
    "href": null,
    "body": "Competed in a national cybersecurity competition run by the Air Force Association. Led Cisco networking for my school team and trained 2+ members each year. Hardened Ubuntu 22, Fedora 36, Windows 10, and Windows Server 2019 systems for competition.",
    "badgeIcon": "🏅",
    "badgeLabel": "12th Place Nationally / 5,000+ Teams"
  }
];

export const EDUCATION = [
  {
    "title": "University of Wisconsin-Madison",
    "year": "Sep 2024 — May 2028",
    "desc": "BS in Applied Mathematics, Engineering & Physics (AMEP). Coursework spanning Modern Physics, Numerical Linear Algebra, Mathematical Computing, and Philosophy of AI."
  },
  {
    "title": "University of New South Wales — Study Abroad",
    "year": "Jan — May 2026",
    "desc": "Semester abroad at UNSW Kensington in Sydney, Australia. Coursework in Numerical Linear Algebra, Philosophy of AI, and Mathematical Computing."
  }
];

export const SKILLS = [
  {
    "name": "Languages",
    "accent": false,
    "items": [
      "Python",
      "SQL",
      "Java",
      "Matlab",
      "HTML/CSS",
      "Bash/Shell"
    ]
  },
  {
    "name": "Technologies",
    "accent": false,
    "items": [
      "AWS",
      "Azure",
      "GCP",
      "Agentic AI",
      "Model Context Protocol",
      "LangChain",
      "Strands",
      "Local LLM Inference",
      "PyTorch",
      "NumPy",
      "OpenCV",
      "Docker",
      "Git",
      "React Native/Expo",
      "Qiskit",
      "Cisco Networking",
      "Linux/Unix",
      "DynamoDB",
      "Supabase",
      "Claude API",
      "OpenAI API",
      "Ollama"
    ]
  },
  {
    "name": "Skills",
    "accent": false,
    "items": [
      "Systems Architecture",
      "Prompt Engineering",
      "AI-Assisted Development",
      "Technical Writing",
      "CI/CD",
      "Penetration Testing",
      "Leadership",
      "Agile"
    ]
  },
  {
    "name": "Certifications & Workshops",
    "accent": true,
    "items": [
      "AWS Braket Badge",
      "Foundational Matlab",
      "Qiskit Global Summer School",
      "UCLA 2025 Quantum Device Workshop"
    ]
  }
];

export const INTERESTS = [
  "☕ Coffee roasting — building the software I wanted for my own roaster",
  "⚛ Quantum computing — from Qiskit summer schools to Rydberg simulations",
  "🤖 AI systems — building agents, RAG, memory systems, running local models, prompt engineering",
  "🏁 F1 racing — the intersection of engineering and competition",
  "💪 Longevity training — optimizing for the long game"
];

export const BIO = "Right now I'm building AI systems and the businesses around them — an AI consulting firm with clients in mortgage and healthcare, an app publisher shipping location-aware assistants, and software that runs a coffee roastery end to end. Co-founded a fintech startup before that and shipped its trading platform in 14 weeks. When I'm not shipping, I'm usually reading, roasting coffee, or watching F1.";

export const TAGLINE = "Founder & Builder — AI & Quantitative Systems";

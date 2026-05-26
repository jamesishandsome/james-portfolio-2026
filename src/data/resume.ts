export const experience = [
  {
    id: 1,
    role: "Software Engineer",
    company: "Morgan Stanley",
    period: "Apr 2025 - Present",
    description:
      "E-trading platform work: UI flows, review habits, and small architecture choices that keep releases less risky.",
    color: "bg-gradient-to-br from-sky-950 via-blue-700 to-cyan-400",
    accent: "#38d5ff",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Morgan_Stanley_Logo_1.svg/512px-Morgan_Stanley_Logo_1.svg.png",
  },
  {
    id: 2,
    role: "Software Developer",
    company: "Bare Cove Technology",
    period: "Jun 2022 - Apr 2025",
    description:
      "Built reporting and operations tooling; spent plenty of time making AWS-backed workflows less brittle.",
    color: "bg-gradient-to-br from-indigo-950 via-indigo-700 to-fuchsia-500",
    accent: "#8d7cff",
    logo: "https://logo.clearbit.com/barecovetech.com",
  },
  {
    id: 3,
    role: "Lead Advanced Technology Engineer",
    company: "XenseTech Limited",
    period: "Apr 2021 - Jun 2022",
    description:
      "Led a small team, translated client requirements into shipped web systems, and reviewed the awkward parts of implementation.",
    color: "bg-gradient-to-br from-purple-950 via-violet-700 to-pink-500",
    accent: "#ff67d8",
    logo: "https://logo.clearbit.com/xensetech.hk",
  },
  {
    id: 4,
    role: "Full Stack Developer",
    company: "Stemhub Holdings Limited",
    period: "May 2019 - Apr 2021",
    description:
      ".NET APIs, Django services, and Blockly-based classroom tools; lots of glue code between product ideas and working software.",
    color: "bg-gradient-to-br from-emerald-950 via-teal-700 to-lime-400",
    accent: "#7cff70",
    logo: "https://logo.clearbit.com/stemhub.com",
  },
  {
    id: 5,
    role: "Junior Engineer (Internship)",
    company: "Sierra Wireless Corporation",
    period: "Jun 2017 - May 2018",
    description:
      "Automation scripts, React tools, and test dashboards for engineering teams who needed faster feedback.",
    color: "bg-gradient-to-br from-slate-950 via-slate-700 to-zinc-300",
    accent: "#d9e3f0",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sierra_Wireless_logo.svg/512px-Sierra_Wireless_logo.svg.png",
  },
];

export const projects = [
  {
    id: 1,
    title: "WebAssembly Lab",
    description:
      "Rust plus Workers: a small benchmark for browser compute that does not freeze the page.",
    color: "bg-gradient-to-br from-orange-950 via-red-700 to-amber-400",
    accent: "#ff9a3d",
    link: "/wasm",
    metric: "2 workers",
  },
  {
    id: 2,
    title: "Three.js Field",
    description:
      "A WebGL scene for testing camera feel, material distortion, and lightweight 3D presentation.",
    color: "bg-gradient-to-br from-slate-950 via-cyan-900 to-white",
    accent: "#5ee9ff",
    link: "/three",
    metric: "WebGL2",
  },
  {
    id: 3,
    title: "D3.js Graph",
    description:
      "A force graph of this site's stack, messy enough to feel closer to a dependency map than a tag cloud.",
    color: "bg-gradient-to-br from-yellow-950 via-orange-700 to-lime-300",
    accent: "#d8ff4f",
    link: "/d3",
    metric: "Force net",
  },
];

export const skills = {
  frontend: ["React", "TypeScript", "WebAssembly", "Web Socket", "Web3.js", "Tauri"],
  backend: ["Python (Django, Flask, FastAPI)", "Node.js", "Go", "Rust"],
  database: ["MongoDB", "PostgreSQL", "Redis"],
  cloud: ["AWS", "Azure", "Kubernetes", "Docker"],
  certifications: [
    "AWS Certified Developer",
    "Microsoft Azure Fundamentals",
    "Microsoft 365 Certified: Fundamentals",
  ],
};

export const profile = {
  name: "James Hu",
  title: "Full-stack Developer",
  email: "me@jameshu.me",
  github: "https://github.com/jamesishandsome",
  location: "Hong Kong",
  education: "Bachelor of Science in Computer Science - HKBU",
};

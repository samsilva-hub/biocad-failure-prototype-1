"use strict";

const app = document.querySelector("#app");
const toastRoot = document.querySelector("#toast-root");

const HERO_ASSET = "./assets/biocad-hero-lab.png";

const categories = [
  "Molecular Biology",
  "Microbiology",
  "Biochemistry",
  "Genetics",
  "Cell Biology",
  "Bioinformatics",
];

const equipment = [
  { id: "pipette", name: "Smart Pipette", hint: "Transfer precise microliter volumes", icon: "pipette" },
  { id: "centrifuge", name: "Microcentrifuge", hint: "Spin down samples at 12,000 RPM", icon: "centrifuge" },
  { id: "thermal", name: "PCR Cycler", hint: "Program denature, anneal, extend", icon: "cycler" },
  { id: "gel", name: "Gel Box", hint: "Separate DNA fragments by size", icon: "gel" },
  { id: "scope", name: "Imaging Scope", hint: "Capture fluorescent readouts", icon: "scope" },
  { id: "hood", name: "Aseptic Hood", hint: "Maintain a sterile workflow", icon: "hood" },
];

const labs = [
  {
    id: "pcr",
    title: "PCR Amplification Technique",
    category: "Molecular Biology",
    difficulty: "Beginner",
    duration: 42,
    rating: 4.9,
    color: "#00f5d4",
    summary: "Amplify a DNA target with primer design, master mix setup, and thermal cycling.",
    icon: "dna",
    steps: [
      ["Prime", "Inspect DNA template quality and select primers with matched melting temperatures.", "pipette"],
      ["Mix", "Build the master mix with buffer, dNTPs, primers, polymerase, and template.", "pipette"],
      ["Spin", "Briefly centrifuge tubes to collect droplets and remove bubbles.", "centrifuge"],
      ["Cycle", "Configure the PCR machine and start denature, anneal, and extension cycles.", "thermal"],
      ["Verify", "Load the amplicon on an agarose gel and inspect band size.", "gel"],
    ],
  },
  {
    id: "gel-electrophoresis",
    title: "Gel Electrophoresis",
    category: "Molecular Biology",
    difficulty: "Beginner",
    duration: 36,
    rating: 4.8,
    color: "#38bdf8",
    summary: "Cast a gel, load DNA samples, run voltage, and interpret migration patterns.",
    icon: "gel",
    steps: [
      ["Cast gel", "Prepare agarose gel with safe stain and a clean comb.", "gel"],
      ["Load ladder", "Pipette DNA ladder into the first well for size reference.", "pipette"],
      ["Load samples", "Place each sample into its labeled well without puncturing the gel.", "pipette"],
      ["Run", "Apply voltage and track the dye front through the gel matrix.", "gel"],
      ["Image", "Capture the band profile and estimate fragment sizes.", "scope"],
    ],
  },
  {
    id: "crispr",
    title: "CRISPR-Cas9 Gene Editing",
    category: "Genetics",
    difficulty: "Advanced",
    duration: 68,
    rating: 4.9,
    color: "#a78bfa",
    summary: "Design guide RNA, deliver Cas9, screen edits, and verify knockout efficiency.",
    icon: "crispr",
    steps: [
      ["Design guide", "Select a guide RNA adjacent to a valid PAM site with low off-target risk.", "scope"],
      ["Prepare complex", "Assemble Cas9 and guide RNA ribonucleoprotein complex.", "pipette"],
      ["Transfect", "Deliver RNP into cells under sterile hood conditions.", "hood"],
      ["Recover", "Incubate cells and monitor viability after editing.", "hood"],
      ["Screen", "Run genotyping assay and interpret edit percentage.", "thermal"],
    ],
  },
  {
    id: "western-blot",
    title: "Western Blot Analysis",
    category: "Biochemistry",
    difficulty: "Intermediate",
    duration: 58,
    rating: 4.7,
    color: "#b5ff3a",
    summary: "Separate proteins, transfer to membrane, probe antibodies, and quantify bands.",
    icon: "protein",
    steps: [
      ["Lyse", "Prepare protein lysate with inhibitors and normalize concentration.", "pipette"],
      ["Separate", "Load SDS-PAGE lanes and run electrophoresis.", "gel"],
      ["Transfer", "Move proteins to membrane using a wet transfer stack.", "gel"],
      ["Probe", "Incubate with primary and secondary antibodies.", "pipette"],
      ["Detect", "Image chemiluminescent signal and compare target expression.", "scope"],
    ],
  },
  {
    id: "elisa",
    title: "ELISA Assay",
    category: "Biochemistry",
    difficulty: "Intermediate",
    duration: 47,
    rating: 4.6,
    color: "#fbbf24",
    summary: "Quantify antigen concentration with standards, antibody binding, and absorbance.",
    icon: "plate",
    steps: [
      ["Coat", "Add capture antibody or antigen to a microplate.", "pipette"],
      ["Block", "Block non-specific binding sites with protein buffer.", "pipette"],
      ["Incubate", "Apply standards and unknown samples in duplicate.", "hood"],
      ["Wash", "Remove unbound material with repeated wash cycles.", "pipette"],
      ["Read", "Develop color and read absorbance curve.", "scope"],
    ],
  },
  {
    id: "cell-culture",
    title: "Cell Culture & Aseptic Technique",
    category: "Cell Biology",
    difficulty: "Beginner",
    duration: 45,
    rating: 4.8,
    color: "#fb7185",
    summary: "Practice sterile handling, passaging, confluency checks, and contamination control.",
    icon: "cells",
    steps: [
      ["Sterilize", "Prepare the hood, wipe surfaces, and arrange sterile consumables.", "hood"],
      ["Inspect", "Check cells for confluency and contamination under the microscope.", "scope"],
      ["Detach", "Add dissociation reagent and neutralize at the right moment.", "pipette"],
      ["Spin", "Pellet cells and remove spent reagent.", "centrifuge"],
      ["Seed", "Resuspend cells and seed a fresh culture vessel.", "hood"],
    ],
  },
  {
    id: "plant-dna",
    title: "DNA Extraction from Plant Cells",
    category: "Genetics",
    difficulty: "Beginner",
    duration: 39,
    rating: 4.6,
    color: "#22c55e",
    summary: "Break plant cell walls, lyse membranes, precipitate DNA, and assess purity.",
    icon: "leaf",
    steps: [
      ["Grind", "Disrupt plant tissue in extraction buffer.", "pipette"],
      ["Lyse", "Release DNA using detergent and salt.", "pipette"],
      ["Clarify", "Centrifuge debris away from the nucleic acid solution.", "centrifuge"],
      ["Precipitate", "Add cold alcohol and spool visible DNA strands.", "pipette"],
      ["Check", "Estimate yield using a purity readout.", "scope"],
    ],
  },
  {
    id: "transformation",
    title: "Bacterial Transformation",
    category: "Microbiology",
    difficulty: "Intermediate",
    duration: 51,
    rating: 4.7,
    color: "#2dd4bf",
    summary: "Introduce plasmids into competent cells and select colonies on antibiotic plates.",
    icon: "bacteria",
    steps: [
      ["Thaw", "Handle competent cells gently on ice.", "hood"],
      ["Add DNA", "Mix plasmid DNA without damaging cell membranes.", "pipette"],
      ["Heat shock", "Apply timed heat shock and rapid recovery.", "thermal"],
      ["Recover", "Incubate cells in recovery medium.", "hood"],
      ["Plate", "Spread cells on selective agar and predict colony outcomes.", "hood"],
    ],
  },
  {
    id: "microscopy",
    title: "Microscopy & Cell Imaging",
    category: "Cell Biology",
    difficulty: "Beginner",
    duration: 34,
    rating: 4.5,
    color: "#60a5fa",
    summary: "Prepare slides, focus objective lenses, tune fluorescence, and annotate images.",
    icon: "scope",
    steps: [
      ["Mount", "Prepare a clean slide with sample and coverslip.", "pipette"],
      ["Focus", "Use coarse then fine focus to locate cells.", "scope"],
      ["Tune", "Adjust exposure without saturating signal.", "scope"],
      ["Capture", "Record brightfield and fluorescence images.", "scope"],
      ["Annotate", "Mark organelles and quantify cell counts.", "scope"],
    ],
  },
  {
    id: "chromatography",
    title: "Protein Purification",
    category: "Biochemistry",
    difficulty: "Advanced",
    duration: 72,
    rating: 4.8,
    color: "#f472b6",
    summary: "Run chromatography fractions, track absorbance, and select purified protein peaks.",
    icon: "columns",
    steps: [
      ["Equilibrate", "Prepare column buffer and remove air pockets.", "pipette"],
      ["Load lysate", "Apply clarified protein lysate onto the column.", "pipette"],
      ["Wash", "Remove non-specific proteins with wash buffer.", "pipette"],
      ["Elute", "Collect fractions using increasing imidazole concentration.", "pipette"],
      ["Analyze", "Inspect chromatogram peaks and choose pooled fractions.", "scope"],
    ],
  },
  {
    id: "flow-cytometry",
    title: "Flow Cytometry",
    category: "Cell Biology",
    difficulty: "Advanced",
    duration: 64,
    rating: 4.7,
    color: "#818cf8",
    summary: "Stain cells, configure gates, compensate channels, and interpret populations.",
    icon: "flow",
    steps: [
      ["Stain", "Incubate cells with fluorescent antibodies.", "pipette"],
      ["Wash", "Remove unbound antibody and resuspend cells.", "centrifuge"],
      ["Set gates", "Define forward and side scatter gates.", "scope"],
      ["Compensate", "Correct spectral overlap between channels.", "scope"],
      ["Analyze", "Quantify population percentages and report results.", "scope"],
    ],
  },
  {
    id: "blast",
    title: "Sequence Alignment (BLAST)",
    category: "Bioinformatics",
    difficulty: "Intermediate",
    duration: 31,
    rating: 4.6,
    color: "#06b6d4",
    summary: "Query a DNA sequence, tune alignment parameters, and interpret homology hits.",
    icon: "code",
    steps: [
      ["Import", "Load unknown sequence and check base quality.", "scope"],
      ["Configure", "Select nucleotide database and scoring parameters.", "thermal"],
      ["Run", "Submit the alignment job and monitor results.", "thermal"],
      ["Inspect", "Compare E-value, identity, and query coverage.", "scope"],
      ["Report", "Summarize the most likely gene identity.", "scope"],
    ],
  },
].map((lab) => ({
  ...lab,
  quiz: [
    {
      question: `What is the first control point in ${lab.title}?`,
      choices: [
        `Confirm the setup matches the protocol goal`,
        "Skip preparation and run the final instrument",
        "Use the highest temperature available",
        "Ignore labels until the end",
      ],
      answer: 0,
      explanation: "A reliable experiment starts with a verified setup, known controls, and clear sample identity.",
    },
    {
      question: "Which habit prevents the most avoidable lab errors?",
      choices: [
        "Document each action while it happens",
        "Memorize every observation at the end",
        "Change multiple variables at once",
        "Leave samples unlabeled to save time",
      ],
      answer: 0,
      explanation: "Real-time notes preserve context and make results traceable.",
    },
    {
      question: "When should a sample be rechecked?",
      choices: [
        "When a result conflicts with expected controls",
        "Only after publishing the result",
        "Never, if the instrument started",
        "Only when a teammate asks",
      ],
      answer: 0,
      explanation: "Unexpected control behavior is a signal to pause, troubleshoot, and protect data quality.",
    },
    {
      question: "What makes a simulation score stronger?",
      choices: [
        "Completing steps in sequence with accurate interactions",
        "Clicking every instrument as fast as possible",
        "Opening the notebook only at the end",
        "Restarting before recording observations",
      ],
      answer: 0,
      explanation: "The platform rewards protocol discipline, correct tool use, and interpretation.",
    },
  ],
}));

const articles = [
  {
    id: "primer-design",
    title: "Primer Design Without Guesswork",
    category: "Molecular Biology",
    readTime: "8 min",
    related: "pcr",
    summary: "Tm, GC balance, specificity, and how to avoid primer dimers before a PCR run.",
    body: [
      "Good primers behave like precise coordinates. They bind the intended target, avoid secondary structures, and work as a pair under the same annealing conditions.",
      "A practical review checks melting temperature, GC content, amplicon length, and off-target similarity before ordering or simulating a run.",
    ],
  },
  {
    id: "sterility",
    title: "Aseptic Technique That Actually Holds Up",
    category: "Cell Biology",
    readTime: "6 min",
    related: "cell-culture",
    summary: "Build a sterile workspace, move deliberately, and catch contamination patterns early.",
    body: [
      "Aseptic work is less about speed and more about choreography. Each movement should protect open vessels and keep hands, tips, and reagents inside clean airflow.",
      "Contamination is a pattern problem. Track timing, source material, shared reagents, and hood handling to narrow the root cause.",
    ],
  },
  {
    id: "crispr-guide",
    title: "Guide RNA Design for Clean Edits",
    category: "Genetics",
    readTime: "10 min",
    related: "crispr",
    summary: "PAM selection, cut-site placement, off-target screening, and edit validation strategy.",
    body: [
      "CRISPR design starts with the biological question: knockout, precise edit, or transcriptional control. The guide is then chosen around target accessibility and validation constraints.",
      "Strong guide selection balances on-target activity with low off-target similarity, then pairs the edit with a genotyping strategy.",
    ],
  },
  {
    id: "chromatogram",
    title: "Reading Chromatograms Like a Purification Lead",
    category: "Biochemistry",
    readTime: "7 min",
    related: "chromatography",
    summary: "Understand peak shape, fraction quality, wash behavior, and pooling decisions.",
    body: [
      "Peak position tells only part of the story. Peak width, shoulder formation, and baseline behavior all hint at sample quality and column performance.",
      "Pooling decisions should combine chromatogram signal with downstream validation rather than absorbance alone.",
    ],
  },
];

const testimonials = [
  {
    quote: "BioCad turns abstract protocols into muscle memory. It feels like a training cockpit for biotech.",
    by: "Dr. Aisha Raman, Molecular Biology Faculty",
  },
  {
    quote: "The simulations give students a place to make mistakes before they touch expensive reagents.",
    by: "Nolan Reed, Lab Operations Lead",
  },
  {
    quote: "The dashboard finally makes skill growth visible across protocols, quizzes, and lab habits.",
    by: "Mira Chen, Graduate Research Mentor",
  },
];

const defaultUser = {
  name: "Maya Sen",
  email: "maya@biocad.edu",
  role: "Student",
  institution: "Nova Institute of Biotechnology",
  bio: "Building confidence in molecular biology, cell culture, and computational analysis.",
  goals: "Complete the core wet-lab pathway and unlock advanced CRISPR simulations.",
  avatarColor: "#00f5d4",
};

const gamePresets = {
  pcr: {
    vessel: "PCR tube A1",
    items: [
      { id: "reaction-tube", label: "PCR tube A1", kind: "tube", color: "#00f5d4", reusable: true },
      { id: "template-dna", label: "Template DNA", kind: "tube", color: "#38bdf8" },
      { id: "primer-mix", label: "Forward + reverse primers", kind: "vial", color: "#a78bfa" },
      { id: "master-mix", label: "2x PCR master mix", kind: "bottle", color: "#b5ff3a" },
      { id: "polymerase", label: "Hot-start polymerase", kind: "vial", color: "#fbbf24" },
      { id: "loading-dye", label: "Loading dye", kind: "bottle", color: "#fb7185" },
      { id: "gel-tray", label: "Agarose gel tray", kind: "gel", color: "#38bdf8", reusable: true },
    ],
    targets: [
      { id: "reaction-tube", label: "Reaction tube", kind: "tube", slot: "bench", color: "#00f5d4" },
      { id: "centrifuge", label: "Microcentrifuge", kind: "centrifuge", slot: "instrument", color: "#38bdf8" },
      { id: "thermal", label: "PCR cycler", kind: "thermal", slot: "instrument", color: "#fbbf24" },
      { id: "gel-lane", label: "Gel lane 3", kind: "gel", slot: "instrument", color: "#00f5d4" },
      { id: "imager", label: "Blue-light imager", kind: "scope", slot: "instrument", color: "#a78bfa" },
    ],
    steps: [
      {
        title: "Load template DNA",
        detail: "Move the DNA template into the chilled reaction tube without contaminating the rim.",
        item: "template-dna",
        target: "reaction-tube",
        result: "Template DNA added",
        observation: "Tube A1 now contains target DNA at the expected starting volume.",
      },
      {
        title: "Add primer mix",
        detail: "Add matched forward and reverse primers to define the amplicon boundaries.",
        item: "primer-mix",
        target: "reaction-tube",
        result: "Primers annealing-ready",
        observation: "Primer mix is logged with matched melting temperatures.",
      },
      {
        title: "Add master mix",
        detail: "Add buffer, magnesium, and dNTPs from the 2x PCR master mix.",
        item: "master-mix",
        target: "reaction-tube",
        result: "Reaction chemistry complete",
        observation: "Reaction volume reached the target mark with balanced salts.",
      },
      {
        title: "Add polymerase last",
        detail: "Add hot-start polymerase after the reaction chemistry is assembled.",
        item: "polymerase",
        target: "reaction-tube",
        result: "Polymerase added",
        observation: "Enzyme was added last to protect reaction specificity.",
      },
      {
        title: "Spin down droplets",
        detail: "Move tube A1 into the microcentrifuge to collect liquid at the bottom.",
        item: "reaction-tube",
        target: "centrifuge",
        result: "Droplets collected",
        observation: "No bubbles remain on the tube wall after spin-down.",
      },
      {
        title: "Run thermal cycle",
        detail: "Move tube A1 into the PCR cycler and run denature, anneal, and extend.",
        item: "reaction-tube",
        target: "thermal",
        result: "Amplicon generated",
        observation: "Cycler profile completed with a clean amplification signal.",
      },
      {
        title: "Add loading dye",
        detail: "Add dye to the amplified sample so it sinks into the gel well.",
        item: "loading-dye",
        target: "reaction-tube",
        result: "Sample ready for gel",
        observation: "Sample color changed uniformly after dye mixing.",
      },
      {
        title: "Load gel lane",
        detail: "Move tube A1 to gel lane 3 and avoid spilling into adjacent wells.",
        item: "reaction-tube",
        target: "gel-lane",
        result: "Gel lane loaded",
        observation: "Lane 3 contains the amplified sample with a visible loading front.",
      },
      {
        title: "Image the gel",
        detail: "Move the gel tray to the blue-light imager to verify band size.",
        item: "gel-tray",
        target: "imager",
        result: "Band verified",
        observation: "Single bright band appears at the expected fragment length.",
      },
    ],
  },
  "gel-electrophoresis": {
    vessel: "Agarose gel",
    items: [
      { id: "gel-tray", label: "Cast agarose gel", kind: "gel", color: "#38bdf8", reusable: true },
      { id: "running-buffer", label: "TAE buffer", kind: "bottle", color: "#00f5d4" },
      { id: "dna-ladder", label: "DNA ladder", kind: "tube", color: "#b5ff3a" },
      { id: "sample-a", label: "Sample A", kind: "tube", color: "#a78bfa" },
      { id: "sample-b", label: "Sample B", kind: "tube", color: "#fb7185" },
      { id: "power-leads", label: "Power leads", kind: "lead", color: "#fbbf24", reusable: true },
    ],
    targets: [
      { id: "gel-tank", label: "Gel tank", kind: "gel", slot: "bench", color: "#38bdf8" },
      { id: "lane-1", label: "Lane 1", kind: "lane", slot: "instrument", color: "#b5ff3a" },
      { id: "lane-2", label: "Lane 2", kind: "lane", slot: "instrument", color: "#a78bfa" },
      { id: "lane-3", label: "Lane 3", kind: "lane", slot: "instrument", color: "#fb7185" },
      { id: "power-supply", label: "Power supply", kind: "thermal", slot: "instrument", color: "#fbbf24" },
      { id: "imager", label: "Transilluminator", kind: "scope", slot: "instrument", color: "#00f5d4" },
    ],
    steps: [
      { title: "Flood the gel tank", detail: "Add TAE buffer until the gel is just submerged.", item: "running-buffer", target: "gel-tank", result: "Buffer level set", observation: "Gel wells are submerged without overflowing the tank." },
      { title: "Seat the gel", detail: "Place the cast agarose gel into the electrophoresis tank.", item: "gel-tray", target: "gel-tank", result: "Gel seated", observation: "Wells face the black electrode so DNA migrates forward." },
      { title: "Load ladder", detail: "Load the DNA ladder into lane 1 for size reference.", item: "dna-ladder", target: "lane-1", result: "Ladder loaded", observation: "Lane 1 has a clean reference ladder meniscus." },
      { title: "Load sample A", detail: "Load sample A into lane 2 while keeping the pipette tip inside the well.", item: "sample-a", target: "lane-2", result: "Sample A loaded", observation: "Lane 2 remains separated from neighboring wells." },
      { title: "Load sample B", detail: "Load sample B into lane 3 with a steady pipette angle.", item: "sample-b", target: "lane-3", result: "Sample B loaded", observation: "Lane 3 is filled cleanly with no surface spillover." },
      { title: "Apply voltage", detail: "Connect the power leads to run DNA through the gel matrix.", item: "power-leads", target: "power-supply", result: "Gel running", observation: "Dye front began migrating toward the red electrode." },
      { title: "Image lanes", detail: "Move the gel tray onto the transilluminator for band inspection.", item: "gel-tray", target: "imager", result: "Bands imaged", observation: "Bands separate clearly against the gel background." },
    ],
  },
  crispr: {
    vessel: "Editing complex",
    items: [
      { id: "guide-rna", label: "Guide RNA", kind: "tube", color: "#a78bfa" },
      { id: "cas9", label: "Cas9 enzyme", kind: "vial", color: "#00f5d4" },
      { id: "rnp-complex", label: "RNP complex", kind: "tube", color: "#b5ff3a", reusable: true },
      { id: "cell-plate", label: "Target cells", kind: "plate", color: "#fb7185", reusable: true },
      { id: "recovery-media", label: "Recovery media", kind: "bottle", color: "#38bdf8" },
      { id: "edit-sample", label: "Edited cell sample", kind: "tube", color: "#fbbf24", reusable: true },
    ],
    targets: [
      { id: "rnp-complex", label: "Assembly tube", kind: "tube", slot: "bench", color: "#b5ff3a" },
      { id: "cell-plate", label: "Cell plate", kind: "plate", slot: "bench", color: "#fb7185" },
      { id: "hood", label: "Sterile hood", kind: "hood", slot: "instrument", color: "#00f5d4" },
      { id: "thermal", label: "Genotyping block", kind: "thermal", slot: "instrument", color: "#fbbf24" },
      { id: "scope", label: "Edit analyzer", kind: "scope", slot: "instrument", color: "#a78bfa" },
    ],
    steps: [
      { title: "Add guide RNA", detail: "Load the validated guide RNA into the assembly tube.", item: "guide-rna", target: "rnp-complex", result: "Guide staged", observation: "Guide RNA sequence is matched to a valid PAM-adjacent locus." },
      { title: "Add Cas9 enzyme", detail: "Combine Cas9 with the guide to form the editing RNP.", item: "cas9", target: "rnp-complex", result: "RNP assembled", observation: "RNP complex formed without changing guide identity." },
      { title: "Deliver RNP to cells", detail: "Move the RNP complex into the target cell plate under sterile conditions.", item: "rnp-complex", target: "cell-plate", result: "Cells edited", observation: "Delivery pulse completed with cells still evenly distributed." },
      { title: "Recover cells", detail: "Add recovery media to support viability after editing.", item: "recovery-media", target: "cell-plate", result: "Recovery started", observation: "Cells remain adherent with no visible stress plume." },
      { title: "Genotype edit site", detail: "Move edited sample to the genotyping block.", item: "edit-sample", target: "thermal", result: "Genotyping complete", observation: "Amplicon signal is ready for edit analysis." },
      { title: "Analyze edit rate", detail: "Move edited sample to the analyzer for knockout readout.", item: "edit-sample", target: "scope", result: "Edit rate measured", observation: "Primary edit population passes the simulated threshold." },
    ],
  },
  elisa: {
    vessel: "ELISA plate",
    items: [
      { id: "microplate", label: "96-well plate", kind: "plate", color: "#fbbf24", reusable: true },
      { id: "capture-antibody", label: "Capture antibody", kind: "vial", color: "#00f5d4" },
      { id: "sample-serum", label: "Unknown sample", kind: "tube", color: "#a78bfa" },
      { id: "wash-buffer", label: "Wash buffer", kind: "bottle", color: "#38bdf8" },
      { id: "enzyme-antibody", label: "Enzyme antibody", kind: "vial", color: "#b5ff3a" },
      { id: "substrate", label: "TMB substrate", kind: "bottle", color: "#fb7185" },
    ],
    targets: [
      { id: "microplate", label: "Microplate wells", kind: "plate", slot: "bench", color: "#fbbf24" },
      { id: "washer", label: "Plate washer", kind: "washer", slot: "instrument", color: "#38bdf8" },
      { id: "reader", label: "Plate reader", kind: "scope", slot: "instrument", color: "#00f5d4" },
    ],
    steps: [
      { title: "Coat wells", detail: "Add capture antibody into the microplate wells.", item: "capture-antibody", target: "microplate", result: "Wells coated", observation: "Capture antibody is distributed across the active wells." },
      { title: "Add sample", detail: "Add unknown sample to bind target antigen.", item: "sample-serum", target: "microplate", result: "Sample incubating", observation: "Sample has entered the coated wells evenly." },
      { title: "Wash plate", detail: "Move wash buffer to the washer to remove unbound material.", item: "wash-buffer", target: "washer", result: "Plate washed", observation: "Background signal reduced after repeated wash cycles." },
      { title: "Add detection antibody", detail: "Add enzyme-linked antibody to reveal bound antigen.", item: "enzyme-antibody", target: "microplate", result: "Detector bound", observation: "Detector antibody has bound to captured antigen." },
      { title: "Develop color", detail: "Add TMB substrate to develop the blue color reaction.", item: "substrate", target: "microplate", result: "Color developed", observation: "Positive wells shifted color in a concentration-dependent pattern." },
      { title: "Read absorbance", detail: "Move the microplate into the reader for quantitative output.", item: "microplate", target: "reader", result: "Absorbance read", observation: "Standard curve fit is within the accepted simulation range." },
    ],
  },
  "western-blot": {
    vessel: "Membrane strip",
    items: [
      { id: "lysate-tube", label: "Protein lysate", kind: "tube", color: "#b5ff3a" },
      { id: "loading-buffer", label: "SDS loading buffer", kind: "bottle", color: "#38bdf8" },
      { id: "gel-tray", label: "SDS-PAGE gel", kind: "gel", color: "#a78bfa", reusable: true },
      { id: "transfer-stack", label: "Transfer stack", kind: "plate", color: "#fbbf24", reusable: true },
      { id: "primary-ab", label: "Primary antibody", kind: "vial", color: "#00f5d4" },
      { id: "secondary-ab", label: "HRP secondary", kind: "vial", color: "#fb7185" },
      { id: "membrane", label: "PVDF membrane", kind: "slide", color: "#b5ff3a", reusable: true },
    ],
    targets: [
      { id: "prep-zone", label: "Sample prep zone", kind: "tube", slot: "bench", color: "#b5ff3a" },
      { id: "gel-tank", label: "PAGE tank", kind: "gel", slot: "instrument", color: "#a78bfa" },
      { id: "transfer-unit", label: "Transfer unit", kind: "gel", slot: "instrument", color: "#fbbf24" },
      { id: "wash-tray", label: "Antibody tray", kind: "plate", slot: "bench", color: "#00f5d4" },
      { id: "imager", label: "Chemiluminescence imager", kind: "scope", slot: "instrument", color: "#fb7185" },
    ],
    steps: [
      { title: "Normalize lysate", detail: "Combine protein lysate with loading buffer in the prep zone.", item: "lysate-tube", target: "prep-zone", result: "Lysate prepared", observation: "Protein concentration normalized with loading dye." },
      { title: "Add loading buffer", detail: "Add SDS loading buffer to denature proteins before separation.", item: "loading-buffer", target: "prep-zone", result: "Samples denatured", observation: "Samples heated and ready for gel loading." },
      { title: "Load SDS-PAGE gel", detail: "Place the gel into the PAGE tank for electrophoresis.", item: "gel-tray", target: "gel-tank", result: "Gel running", observation: "Protein bands separate by molecular weight." },
      { title: "Transfer to membrane", detail: "Move proteins from gel to PVDF membrane via wet transfer.", item: "transfer-stack", target: "transfer-unit", result: "Transfer complete", observation: "Proteins immobilized on the membrane surface." },
      { title: "Probe with primary antibody", detail: "Incubate membrane with target-specific primary antibody.", item: "primary-ab", target: "wash-tray", result: "Primary bound", observation: "Target protein captured on the membrane." },
      { title: "Add secondary antibody", detail: "Add enzyme-linked secondary for detection.", item: "secondary-ab", target: "wash-tray", result: "Secondary bound", observation: "Detection complex assembled on target bands." },
      { title: "Image chemiluminescence", detail: "Move membrane to imager and capture band signal.", item: "membrane", target: "imager", result: "Bands quantified", observation: "Target band intensity matches expected expression level." },
    ],
  },
  "plant-dna": {
    vessel: "Plant extract",
    items: [
      { id: "plant-tissue", label: "Plant tissue", kind: "tube", color: "#22c55e" },
      { id: "extraction-buffer", label: "Extraction buffer", kind: "bottle", color: "#38bdf8" },
      { id: "lysis-mix", label: "Lysis mixture", kind: "tube", color: "#a78bfa", reusable: true },
      { id: "clarified-lysate", label: "Clarified lysate", kind: "tube", color: "#00f5d4", reusable: true },
      { id: "cold-alcohol", label: "Cold ethanol", kind: "bottle", color: "#fbbf24" },
      { id: "dna-spool", label: "Precipitated DNA", kind: "tube", color: "#22c55e", reusable: true },
    ],
    targets: [
      { id: "grind-mortar", label: "Grinding station", kind: "tube", slot: "bench", color: "#22c55e" },
      { id: "lysis-mix", label: "Lysis tube", kind: "tube", slot: "bench", color: "#a78bfa" },
      { id: "centrifuge", label: "Centrifuge", kind: "centrifuge", slot: "instrument", color: "#38bdf8" },
      { id: "precipitation-tube", label: "Precipitation tube", kind: "tube", slot: "bench", color: "#fbbf24" },
      { id: "scope", label: "Purity analyzer", kind: "scope", slot: "instrument", color: "#00f5d4" },
    ],
    steps: [
      { title: "Grind plant tissue", detail: "Disrupt plant cell walls in extraction buffer.", item: "plant-tissue", target: "grind-mortar", result: "Tissue disrupted", observation: "Cell walls broken releasing cellular contents." },
      { title: "Lyse membranes", detail: "Add detergent buffer to release DNA from organelles.", item: "extraction-buffer", target: "lysis-mix", result: "DNA released", observation: "Nucleic acids freed into the aqueous phase." },
      { title: "Clarify lysate", detail: "Spin down debris to isolate the DNA-containing supernatant.", item: "lysis-mix", target: "centrifuge", result: "Lysate clarified", observation: "Pellet separated from clear supernatant." },
      { title: "Precipitate DNA", detail: "Add cold ethanol to precipitate visible DNA strands.", item: "cold-alcohol", target: "precipitation-tube", result: "DNA precipitated", observation: "White fibrous DNA visible at the interface." },
      { title: "Check purity", detail: "Move spooled DNA to the analyzer for A260/A280 readout.", item: "dna-spool", target: "scope", result: "Purity verified", observation: "DNA yield and purity within acceptable range." },
    ],
  },
  transformation: {
    vessel: "Competent cells",
    items: [
      { id: "competent-cells", label: "Competent E. coli", kind: "tube", color: "#2dd4bf" },
      { id: "plasmid-dna", label: "Plasmid DNA", kind: "tube", color: "#a78bfa" },
      { id: "cell-mix", label: "Cell-DNA mix", kind: "tube", color: "#00f5d4", reusable: true },
      { id: "recovery-media", label: "SOC recovery media", kind: "bottle", color: "#38bdf8" },
      { id: "cell-suspension", label: "Recovered cells", kind: "tube", color: "#2dd4bf", reusable: true },
      { id: "spread-plate", label: "Selective agar plate", kind: "plate", color: "#fbbf24", reusable: true },
    ],
    targets: [
      { id: "ice-bucket", label: "Ice bucket", kind: "tube", slot: "bench", color: "#2dd4bf" },
      { id: "cell-mix", label: "Transformation tube", kind: "tube", slot: "bench", color: "#00f5d4" },
      { id: "heat-block", label: "Heat shock block", kind: "thermal", slot: "instrument", color: "#fb7185" },
      { id: "hood", label: "Sterile hood", kind: "hood", slot: "instrument", color: "#00f5d4" },
      { id: "incubator", label: "37°C incubator", kind: "thermal", slot: "instrument", color: "#fbbf24" },
    ],
    steps: [
      { title: "Thaw cells on ice", detail: "Gently thaw competent cells on ice without agitation.", item: "competent-cells", target: "ice-bucket", result: "Cells thawed", observation: "Cells remain cold and viable on ice." },
      { title: "Add plasmid DNA", detail: "Mix plasmid DNA with cells without vortexing.", item: "plasmid-dna", target: "cell-mix", result: "DNA added", observation: "Plasmid distributed evenly in cell suspension." },
      { title: "Heat shock", detail: "Apply brief heat pulse to increase membrane permeability.", item: "cell-mix", target: "heat-block", result: "Heat shock done", observation: "Timed pulse completed without overheating." },
      { title: "Recovery incubation", detail: "Add SOC media and incubate for expression recovery.", item: "recovery-media", target: "hood", result: "Cells recovering", observation: "Cells express antibiotic resistance gene." },
      { title: "Plate on selective agar", detail: "Spread recovered cells on antibiotic-selective plates.", item: "cell-suspension", target: "incubator", result: "Plates incubating", observation: "Colonies expected where transformation succeeded." },
    ],
  },
  microscopy: {
    vessel: "Microscope slide",
    items: [
      { id: "sample-tube", label: "Cell sample", kind: "tube", color: "#60a5fa" },
      { id: "slide-prep", label: "Prepared slide", kind: "slide", color: "#00f5d4", reusable: true },
      { id: "coverslip", label: "Coverslip", kind: "slide", color: "#a78bfa" },
      { id: "stain", label: "Fluorescent stain", kind: "bottle", color: "#fb7185" },
      { id: "stained-slide", label: "Stained slide", kind: "slide", color: "#fbbf24", reusable: true },
    ],
    targets: [
      { id: "prep-bench", label: "Slide prep bench", kind: "tube", slot: "bench", color: "#60a5fa" },
      { id: "microscope", label: "Microscope stage", kind: "scope", slot: "instrument", color: "#a78bfa" },
      { id: "imaging-station", label: "Imaging station", kind: "scope", slot: "instrument", color: "#00f5d4" },
      { id: "analysis-screen", label: "Analysis screen", kind: "scope", slot: "instrument", color: "#fbbf24" },
    ],
    steps: [
      { title: "Mount sample", detail: "Place cell sample on a clean slide with coverslip.", item: "sample-tube", target: "prep-bench", result: "Slide mounted", observation: "Sample evenly distributed without air bubbles." },
      { title: "Apply stain", detail: "Add fluorescent stain to highlight cellular structures.", item: "stain", target: "slide-prep", result: "Sample stained", observation: "Stain penetrated cells with even distribution." },
      { title: "Focus objective", detail: "Move slide to microscope and locate cells in focus.", item: "stained-slide", target: "microscope", result: "Cells in focus", observation: "Sharp brightfield image at optimal focal plane." },
      { title: "Tune fluorescence", detail: "Adjust exposure and filter for fluorescence imaging.", item: "stained-slide", target: "imaging-station", result: "Fluorescence captured", observation: "Signal strong without saturation artifacts." },
      { title: "Annotate image", detail: "Mark organelles and count cells on the analysis screen.", item: "stained-slide", target: "analysis-screen", result: "Analysis complete", observation: "Cell counts and annotations saved to notebook." },
    ],
  },
  chromatography: {
    vessel: "Chromatography column",
    items: [
      { id: "column-buffer", label: "Equilibration buffer", kind: "bottle", color: "#f472b6" },
      { id: "clarified-lysate", label: "Clarified lysate", kind: "tube", color: "#38bdf8" },
      { id: "wash-buffer", label: "Wash buffer", kind: "bottle", color: "#00f5d4" },
      { id: "elution-buffer", label: "Elution buffer", kind: "bottle", color: "#a78bfa" },
      { id: "fraction-tube", label: "Collected fractions", kind: "tube", color: "#b5ff3a", reusable: true },
    ],
    targets: [
      { id: "column", label: "FPLC column", kind: "columns", slot: "bench", color: "#f472b6" },
      { id: "load-port", label: "Sample load port", kind: "tube", slot: "bench", color: "#38bdf8" },
      { id: "wash-port", label: "Wash port", kind: "tube", slot: "bench", color: "#00f5d4" },
      { id: "elution-port", label: "Elution port", kind: "tube", slot: "bench", color: "#a78bfa" },
      { id: "chromatogram", label: "UV chromatogram", kind: "scope", slot: "instrument", color: "#b5ff3a" },
    ],
    steps: [
      { title: "Equilibrate column", detail: "Flush column with equilibration buffer to remove air.", item: "column-buffer", target: "column", result: "Column equilibrated", observation: "Baseline pressure stable with no air bubbles." },
      { title: "Load lysate", detail: "Apply clarified protein lysate onto the column.", item: "clarified-lysate", target: "load-port", result: "Lysate loaded", observation: "Proteins binding to the affinity resin." },
      { title: "Wash column", detail: "Remove non-specific proteins with wash buffer.", item: "wash-buffer", target: "wash-port", result: "Column washed", observation: "UV trace returns to baseline." },
      { title: "Elute protein", detail: "Elute bound protein with imidazole gradient.", item: "elution-buffer", target: "elution-port", result: "Protein eluted", observation: "Sharp absorbance peak in elution fractions." },
      { title: "Analyze chromatogram", detail: "Inspect UV trace and select peak fractions.", item: "fraction-tube", target: "chromatogram", result: "Fractions selected", observation: "Pure protein peak identified for pooling." },
    ],
  },
  "flow-cytometry": {
    vessel: "Cell suspension",
    items: [
      { id: "cell-suspension", label: "Cell suspension", kind: "tube", color: "#818cf8" },
      { id: "antibody-cocktail", label: "Fluorescent antibodies", kind: "vial", color: "#fb7185" },
      { id: "stained-cells", label: "Stained cells", kind: "tube", color: "#a78bfa", reusable: true },
      { id: "wash-buffer", label: "FACS buffer", kind: "bottle", color: "#38bdf8" },
      { id: "resuspended-cells", label: "Washed cells", kind: "tube", color: "#00f5d4", reusable: true },
    ],
    targets: [
      { id: "staining-tube", label: "Staining tube", kind: "tube", slot: "bench", color: "#818cf8" },
      { id: "centrifuge", label: "Centrifuge", kind: "centrifuge", slot: "instrument", color: "#38bdf8" },
      { id: "cytometer", label: "Flow cytometer", kind: "scope", slot: "instrument", color: "#a78bfa" },
      { id: "gate-panel", label: "Gating workstation", kind: "scope", slot: "instrument", color: "#fbbf24" },
      { id: "report-screen", label: "Population report", kind: "scope", slot: "instrument", color: "#00f5d4" },
    ],
    steps: [
      { title: "Stain cells", detail: "Incubate cells with fluorescent antibody cocktail.", item: "antibody-cocktail", target: "staining-tube", result: "Cells stained", observation: "Antibodies bound to surface markers." },
      { title: "Wash unbound antibody", detail: "Pellet cells and remove excess antibody.", item: "stained-cells", target: "centrifuge", result: "Cells washed", observation: "Background fluorescence minimized." },
      { title: "Resuspend for analysis", detail: "Resuspend pellet in FACS buffer at correct density.", item: "wash-buffer", target: "staining-tube", result: "Cells ready", observation: "Single-cell suspension without aggregates." },
      { title: "Set scatter gates", detail: "Define FSC/SSC gates on the cytometer.", item: "resuspended-cells", target: "gate-panel", result: "Gates defined", observation: "Live cell population cleanly gated." },
      { title: "Analyze populations", detail: "Quantify fluorescent populations and export report.", item: "resuspended-cells", target: "report-screen", result: "Populations quantified", observation: "Target population percentage recorded." },
    ],
  },
  blast: {
    vessel: "Query sequence",
    items: [
      { id: "query-fasta", label: "Unknown FASTA", kind: "tube", color: "#06b6d4" },
      { id: "quality-trim", label: "Quality-trimmed seq", kind: "tube", color: "#38bdf8", reusable: true },
      { id: "blast-job", label: "BLAST job file", kind: "tube", color: "#a78bfa", reusable: true },
      { id: "hit-list", label: "Alignment hits", kind: "slide", color: "#b5ff3a", reusable: true },
      { id: "report", label: "Homology report", kind: "slide", color: "#fbbf24", reusable: true },
    ],
    targets: [
      { id: "qc-station", label: "Sequence QC", kind: "scope", slot: "bench", color: "#06b6d4" },
      { id: "param-panel", label: "Parameter panel", kind: "thermal", slot: "instrument", color: "#38bdf8" },
      { id: "compute-cluster", label: "BLAST cluster", kind: "thermal", slot: "instrument", color: "#a78bfa" },
      { id: "hit-viewer", label: "Hit viewer", kind: "scope", slot: "instrument", color: "#b5ff3a" },
      { id: "report-desk", label: "Report desk", kind: "scope", slot: "instrument", color: "#fbbf24" },
    ],
    steps: [
      { title: "Import sequence", detail: "Load unknown FASTA and inspect base quality.", item: "query-fasta", target: "qc-station", result: "Sequence imported", observation: "Low-quality ends flagged for trimming." },
      { title: "Configure BLAST", detail: "Select nucleotide database and E-value threshold.", item: "quality-trim", target: "param-panel", result: "Parameters set", observation: "Scoring matrix and gap penalties configured." },
      { title: "Run alignment", detail: "Submit job to the BLAST compute cluster.", item: "blast-job", target: "compute-cluster", result: "Search complete", observation: "Hits ranked by E-value and bit score." },
      { title: "Inspect top hits", detail: "Compare identity, coverage, and E-value of top matches.", item: "hit-list", target: "hit-viewer", result: "Hits reviewed", observation: "Best hit shows high identity and full coverage." },
      { title: "Write report", detail: "Summarize the most likely gene identity.", item: "report", target: "report-desk", result: "Report filed", observation: "Homology conclusion documented in notebook." },
    ],
  },
  "cell-culture": {
    vessel: "Culture flask",
    items: [
      { id: "culture-flask", label: "Cell culture flask", kind: "flask", color: "#fb7185", reusable: true },
      { id: "ethanol", label: "70% ethanol", kind: "bottle", color: "#38bdf8" },
      { id: "cell-dish", label: "Cell dish", kind: "plate", color: "#b5ff3a", reusable: true },
      { id: "trypsin", label: "Trypsin", kind: "vial", color: "#fbbf24" },
      { id: "growth-media", label: "Growth media", kind: "bottle", color: "#00f5d4" },
      { id: "cell-pellet", label: "Cell pellet", kind: "tube", color: "#a78bfa", reusable: true },
    ],
    targets: [
      { id: "hood", label: "Sterile hood", kind: "hood", slot: "bench", color: "#00f5d4" },
      { id: "microscope", label: "Microscope stage", kind: "scope", slot: "instrument", color: "#a78bfa" },
      { id: "culture-flask", label: "Culture flask", kind: "flask", slot: "bench", color: "#fb7185" },
      { id: "centrifuge", label: "Centrifuge", kind: "centrifuge", slot: "instrument", color: "#38bdf8" },
    ],
    steps: [
      { title: "Sterilize hood", detail: "Move ethanol into the hood to wipe the working area.", item: "ethanol", target: "hood", result: "Hood prepared", observation: "Work zone is sterile and arranged for clean transfers." },
      { title: "Inspect cells", detail: "Move the cell dish to the microscope stage and check confluency.", item: "cell-dish", target: "microscope", result: "Cells inspected", observation: "Cells are healthy and near the passaging threshold." },
      { title: "Detach cells", detail: "Add trypsin to the culture flask to detach adherent cells.", item: "trypsin", target: "culture-flask", result: "Cells detached", observation: "Cells rounded up uniformly after timed exposure." },
      { title: "Neutralize trypsin", detail: "Add growth media to stop dissociation and protect viability.", item: "growth-media", target: "culture-flask", result: "Trypsin neutralized", observation: "Suspension looks even with no large clumps." },
      { title: "Pellet cells", detail: "Move the cell pellet tube into the centrifuge.", item: "cell-pellet", target: "centrifuge", result: "Pellet formed", observation: "A compact pellet formed at the bottom of the tube." },
      { title: "Seed fresh flask", detail: "Move the culture flask back into the sterile hood for reseeding.", item: "culture-flask", target: "hood", result: "Culture seeded", observation: "Fresh flask is seeded at the target split ratio." },
    ],
  },
};

const labNarratives = {
  pcr: [
    "He retrieves the chilled DNA template and inspects its quality before opening the tube. Carefully, he transfers the template into the reaction tube without touching the rim — contamination here would ruin everything.",
    "Next he adds matched forward and reverse primers. These short DNA sequences will define exactly which region gets amplified during cycling.",
    "He pours in the 2× PCR master mix, supplying buffer, magnesium ions, and all four dNTPs the polymerase needs to build new strands.",
    "Finally he adds the heat-stable DNA polymerase — always last, because even hot-start enzymes can mis-prime if added too early.",
    "He seals the tube and places it in the microcentrifuge, giving it a quick spin to collect every droplet at the bottom and eliminate bubbles.",
    "The tube goes into the thermal cycler. The machine heats the sample to denature the DNA, separating the two strands. As the temperature drops, primers anneal to their complementary sequences. Then the polymerase extends the primers, synthesizing new DNA strands. He watches the display as this cycle repeats — denaturation, annealing, extension — each round doubling the target DNA.",
    "After cycling completes, he adds loading dye so the amplified sample will sink cleanly into the gel well.",
    "He loads the sample into lane 3 of the agarose gel, keeping the pipette tip inside the well to avoid tearing the matrix.",
    "He moves the gel to the blue-light imager. A single bright band appears at the expected fragment length — millions of copies of the target sequence, ready for analysis.",
  ],
  "gel-electrophoresis": [
    "He pours TAE running buffer into the tank until the gel is just submerged — too little buffer and the current won't flow evenly.",
    "Carefully he seats the cast agarose gel into the tank, orienting the wells toward the negative electrode so DNA migrates in the right direction.",
    "Into lane 1 he loads the DNA ladder — a size reference that will let him estimate fragment lengths later.",
    "Sample A goes into lane 2. He keeps the pipette tip inside the well, releasing the sample slowly so it sinks to the bottom.",
    "Sample B follows in lane 3 with the same steady technique, making sure not to puncture the gel between wells.",
    "He connects the power leads and applies voltage. The dye front begins migrating through the gel matrix toward the positive electrode.",
    "When the run is complete, he transfers the gel to the transilluminator. Distinct bands appear — each sample's DNA fragments separated by size.",
  ],
  crispr: [
    "He loads the validated guide RNA into the assembly tube, confirming the sequence targets a PAM-adjacent site with minimal off-target risk.",
    "Cas9 enzyme joins the guide in the tube, forming the ribonucleoprotein complex that will seek and cut the target locus.",
    "Under the sterile hood, he delivers the RNP complex into the target cell plate with a controlled pulse.",
    "Recovery media is added to support cell viability while the editing machinery does its work inside the cells.",
    "He moves an edited cell sample to the genotyping block to amplify the target locus for analysis.",
    "At the edit analyzer, he reads the knockout efficiency — the primary edit population passes the simulated threshold.",
  ],
  elisa: [
    "Capture antibody is distributed across the microplate wells, coating the surface to trap the target antigen.",
    "Unknown sample is added to the coated wells, where antigens bind to the immobilized capture antibodies.",
    "He runs repeated wash cycles to strip away anything that didn't bind — reducing background signal.",
    "Enzyme-linked detection antibody is added, binding specifically to any captured antigen.",
    "TMB substrate develops a blue color wherever the detection complex sits — intensity proportional to antigen concentration.",
    "The plate goes into the reader. Absorbance values plot against standards, revealing the unknown concentration.",
  ],
  "cell-culture": [
    "He wipes down the sterile hood with 70% ethanol, arranging consumables for an aseptic workflow.",
    "At the microscope he checks confluency — the cells are healthy and approaching the passaging threshold.",
    "Trypsin is added to the culture flask, gently detaching adherent cells from the surface.",
    "Growth media neutralizes the trypsin, protecting cell viability in the suspension.",
    "The cell pellet spins down in the centrifuge, forming a compact pellet at the tube bottom.",
    "Back in the hood, he reseeds a fresh flask at the target split ratio for continued growth.",
  ],
  "western-blot": [
    "He normalizes the protein lysate concentration, preparing samples for gel loading.",
    "SDS loading buffer is added to denature proteins and give each band a negative charge for separation.",
    "The SDS-PAGE gel is placed in the tank and electrophoresis begins — proteins separate by molecular weight.",
    "A wet transfer stack moves proteins from the gel onto a PVDF membrane where they'll be probed.",
    "Primary antibody incubation targets the protein of interest on the membrane surface.",
    "HRP-linked secondary antibody binds the primary, assembling the detection complex.",
    "Chemiluminescence imaging reveals the target band — intensity reflects protein expression level.",
  ],
  "plant-dna": [
    "He grinds plant tissue in extraction buffer, mechanically breaking tough cell walls.",
    "Detergent lysis releases DNA from organelles into the aqueous phase.",
    "A centrifuge spin pellets debris, leaving clear supernatant rich in nucleic acids.",
    "Cold ethanol is layered on top — white fibrous DNA precipitates at the interface.",
    "The spooled DNA is analyzed for purity. Yield and A260/A280 ratio look good.",
  ],
  transformation: [
    "Competent cells thaw gently on ice — rough handling would kill them before transformation even starts.",
    "Plasmid DNA is mixed in without vortexing, giving cells a chance to take up the foreign DNA.",
    "A brief heat shock opens transient pores in the cell membrane, allowing plasmid entry.",
    "SOC recovery media is added under the hood, giving cells time to express the antibiotic resistance gene.",
    "Recovered cells are spread on selective agar and placed in the incubator — only transformed cells will grow.",
  ],
  microscopy: [
    "He prepares a clean slide, placing the cell sample and coverslip without trapping air bubbles.",
    "Fluorescent stain highlights organelles, penetrating cells with even distribution.",
    "At the microscope he uses coarse then fine focus to bring cells into sharp view.",
    "Fluorescence filters and exposure are tuned — strong signal without saturation.",
    "On the analysis screen he annotates organelles and counts cells, saving results to the notebook.",
  ],
  chromatography: [
    "Equilibration buffer flushes the column, removing air pockets and stabilizing baseline pressure.",
    "Clarified lysate is loaded — target proteins bind to the affinity resin inside the column.",
    "Wash buffer strips away non-specific proteins, returning the UV trace to baseline.",
    "An imidazole gradient elutes the bound protein in a sharp absorbance peak.",
    "He inspects the chromatogram and selects the purest fractions for pooling.",
  ],
  "flow-cytometry": [
    "Fluorescent antibodies are incubated with cells, binding specific surface markers.",
    "Unbound antibody is washed away by pelleting cells in the centrifuge.",
    "Cells are resuspended in FACS buffer at the right density — single cells, no aggregates.",
    "Forward and side scatter gates are drawn on the cytometer to isolate live cells.",
    "Fluorescent populations are quantified and the percentage report is exported.",
  ],
  blast: [
    "He imports the unknown FASTA sequence and flags low-quality ends for trimming.",
    "BLAST parameters are set — nucleotide database, E-value threshold, and scoring matrix.",
    "The job runs on the compute cluster, ranking hits by statistical significance.",
    "Top hits are compared for identity, query coverage, and E-value.",
    "He writes up the homology report, documenting the most likely gene identity.",
  ],
};

function enrichGamePlan(plan, labId) {
  const narratives = labNarratives[labId] || [];
  return {
    ...plan,
    steps: plan.steps.map((step, index) => ({
      ...step,
      narrative: step.narrative || narratives[index] || `He carefully completes this step: ${step.detail}`,
      action: step.action || (step.title.toLowerCase().includes("run") || step.title.toLowerCase().includes("image") ? "operate" : step.title.toLowerCase().includes("add") || step.title.toLowerCase().includes("load") ? "pipette" : "place"),
    })),
  };
}

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`biocad:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(`biocad:${key}`, JSON.stringify(value));
  },
};

const state = {
  currentPage: "home",
  authMode: "login",
  mobileOpen: false,
  selectedLabId: "pcr",
  selectedLabItem: null,
  selectedArticleId: "primer-design",
  quizLabId: "pcr",
  quizIndex: 0,
  selectedChoice: null,
  quizAnswers: [],
  search: "",
  learnSearch: "",
  category: "All",
  difficulty: "All",
  status: "All",
  testimonialIndex: 0,
  simSeconds: 42 * 60,
  reagentVolume: 10,
  reagentConcentration: 100,
  user: store.get("user", null),
  progress: store.get("progress", {
    pcr: { status: "In Progress", currentStep: 2, quizScore: 82, completedAt: null, minutes: 36 },
    "cell-culture": { status: "Completed", currentStep: 5, quizScore: 92, completedAt: "2026-05-30", minutes: 45 },
    "gel-electrophoresis": { status: "Completed", currentStep: 5, quizScore: 88, completedAt: "2026-05-28", minutes: 34 },
    blast: { status: "Completed", currentStep: 5, quizScore: 84, completedAt: "2026-05-24", minutes: 31 },
  }),
  settings: store.get("settings", {
    theme: "dark",
    labAlerts: true,
    weeklyDigest: true,
    badgeAlerts: true,
  }),
};

document.body.dataset.theme = state.settings.theme;

let simTimer = null;
let testimonialTimer = null;
let lastSceneKey = "";

function icon(name, cls = "icon") {
  const icons = {
    search: `<svg class="${cls}" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>`,
    bell: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>`,
    menu: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>`,
    close: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
    play: `<svg class="${cls}" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"></path></svg>`,
    flask: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M9 3h6"></path><path d="M10 3v5l-5.4 9.4A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.2-3.6L14 8V3"></path><path d="M7.5 16h9"></path></svg>`,
    brain: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3v1a4 4 0 0 0-2 7.5A4 4 0 0 0 8 20h1V4Z"></path><path d="M15 4a3 3 0 0 1 3 3v1a4 4 0 0 1 2 7.5A4 4 0 0 1 16 20h-1V4Z"></path><path d="M9 9H7"></path><path d="M15 9h2"></path><path d="M9 14H6"></path><path d="M15 14h3"></path></svg>`,
    chart: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="m7 15 4-4 3 3 5-7"></path></svg>`,
    clock: `<svg class="${cls}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>`,
    trophy: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0Z"></path><path d="M17 6h3a3 3 0 0 1-3 3"></path><path d="M7 6H4a3 3 0 0 0 3 3"></path></svg>`,
    zap: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7Z"></path></svg>`,
    user: `<svg class="${cls}" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>`,
    check: `<svg class="${cls}" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"></path></svg>`,
    moon: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M20.9 14.5A8.5 8.5 0 0 1 9.5 3.1 9 9 0 1 0 20.9 14.5Z"></path></svg>`,
    sun: `<svg class="${cls}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m4.9 19.1 1.4-1.4"></path><path d="m17.7 6.3 1.4-1.4"></path></svg>`,
    arrow: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m13 5 7 7-7 7"></path></svg>`,
    book: `<svg class="${cls}" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"></path></svg>`,
    pipette: `<svg viewBox="0 0 120 120"><path d="M80 13 107 40 94 53 67 26Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M67 26 26 67l27 27 41-41Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M28 85 14 99" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M45 61 59 75" stroke="currentColor" stroke-width="5"/></svg>`,
    centrifuge: `<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="38" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="60" cy="62" r="10" fill="currentColor"/><path d="M60 24v28M92 79 68 66M28 79l24-13" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
    cycler: `<svg viewBox="0 0 120 120"><rect x="18" y="32" width="84" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="6"/><path d="M30 48h60M35 68h12M55 68h12M75 68h12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M40 24h40" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
    gel: `<svg viewBox="0 0 120 120"><rect x="18" y="25" width="84" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="6"/><path d="M32 42h56M32 58h56M32 74h56" stroke="currentColor" stroke-width="5" opacity=".8"/><path d="M42 42v32M60 42v32M78 42v32" stroke="currentColor" stroke-width="3" opacity=".65"/></svg>`,
    scope: `<svg viewBox="0 0 120 120"><path d="M54 17h22v22H54zM65 39 46 67M39 84h49M51 67a17 17 0 1 0 25 15" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/><path d="M32 101h58" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>`,
    hood: `<svg viewBox="0 0 120 120"><path d="M24 28h72l10 64H14Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/><path d="M34 45h52M31 64h58M44 84h32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  };
  return icons[name] || icons.flask;
}

function labIllustration(type) {
  const lines = {
    dna: `<path d="M34 24c26 20 26 52 0 72M86 24C60 44 60 76 86 96" fill="none" stroke="currentColor" stroke-width="6"/><path d="M42 38h36M39 55h42M39 72h42M42 89h36" stroke="currentColor" stroke-width="4"/>`,
    gel: `<rect x="24" y="25" width="72" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="6"/><path d="M38 42h44M38 58h44M38 74h44" stroke="currentColor" stroke-width="5"/><path d="M50 42v32M69 42v32" stroke="currentColor" stroke-width="3"/>`,
    crispr: `<path d="M26 72c22-38 46-38 68 0" fill="none" stroke="currentColor" stroke-width="6"/><path d="M40 48 82 90M82 48 40 90" stroke="currentColor" stroke-width="5"/><circle cx="61" cy="69" r="13" fill="none" stroke="currentColor" stroke-width="5"/>`,
    protein: `<circle cx="40" cy="39" r="12" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="73" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="58" cy="73" r="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 43 64 50M67 55 62 63" stroke="currentColor" stroke-width="5"/>`,
    plate: `<rect x="24" y="28" width="72" height="64" rx="10" fill="none" stroke="currentColor" stroke-width="6"/><g fill="currentColor"><circle cx="43" cy="48" r="6"/><circle cx="60" cy="48" r="6"/><circle cx="77" cy="48" r="6"/><circle cx="43" cy="70" r="6"/><circle cx="60" cy="70" r="6"/><circle cx="77" cy="70" r="6"/></g>`,
    cells: `<circle cx="43" cy="47" r="17" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="74" cy="68" r="22" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="47" cy="49" r="5" fill="currentColor"/><circle cx="77" cy="66" r="6" fill="currentColor"/>`,
    leaf: `<path d="M24 82c48 0 68-30 72-58-42 3-69 22-72 58Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M31 79c20-18 37-28 61-49" stroke="currentColor" stroke-width="5"/><path d="M52 61c-3-12-2-20 2-28M65 50c10 0 18 3 25 8" stroke="currentColor" stroke-width="4"/>`,
    bacteria: `<rect x="28" y="39" width="64" height="42" rx="21" fill="none" stroke="currentColor" stroke-width="6"/><path d="M43 54h2M59 66h2M76 55h2" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><path d="M28 60H15M105 60H92M60 39V25M60 95V81" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
    scope: `<path d="M54 17h22v22H54zM65 39 46 67M39 84h49M51 67a17 17 0 1 0 25 15" fill="none" stroke="currentColor" stroke-width="6"/><path d="M32 101h58" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`,
    columns: `<path d="M36 20h48M44 20v72a16 16 0 0 0 32 0V20" fill="none" stroke="currentColor" stroke-width="6"/><path d="M44 58h32M44 75h32" stroke="currentColor" stroke-width="5"/><path d="M60 108v-8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,
    flow: `<path d="M24 61h72M62 25v72" stroke="currentColor" stroke-width="5"/><circle cx="42" cy="43" r="8" fill="currentColor"/><circle cx="72" cy="44" r="6" fill="currentColor"/><circle cx="50" cy="77" r="6" fill="currentColor"/><circle cx="84" cy="74" r="9" fill="none" stroke="currentColor" stroke-width="5"/>`,
    code: `<path d="m45 38-22 22 22 22M75 38l22 22-22 22M64 30 54 90" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${lines[type] || lines.dna}</svg>`;
}

function getLab(id = state.selectedLabId) {
  return labs.find((lab) => lab.id === id) || labs[0];
}

function getGamePlan(lab) {
  const base = gamePresets[lab.id] || buildGenericGamePlan(lab);
  return enrichGamePlan(base, lab.id);
}

function buildGenericGamePlan(lab) {
  const genericItems = [
    { id: "protocol-sample", label: `${lab.category} sample`, kind: "tube", color: lab.color, reusable: true },
    { id: "primary-reagent", label: "Primary reagent", kind: "bottle", color: "#00f5d4" },
    { id: "buffer", label: "Assay buffer", kind: "bottle", color: "#38bdf8" },
    { id: "analysis-plate", label: "Analysis plate", kind: "plate", color: "#a78bfa", reusable: true },
    { id: "readout-slide", label: "Readout slide", kind: "slide", color: "#b5ff3a", reusable: true },
  ];
  const genericTargets = [
    { id: "prep-zone", label: "Prep zone", kind: "tube", slot: "bench", color: lab.color },
    { id: "hood", label: "Sterile hood", kind: "hood", slot: "instrument", color: "#00f5d4" },
    { id: "centrifuge", label: "Centrifuge", kind: "centrifuge", slot: "instrument", color: "#38bdf8" },
    { id: "thermal", label: "Thermal block", kind: "thermal", slot: "instrument", color: "#fbbf24" },
    { id: "gel", label: "Separation deck", kind: "gel", slot: "instrument", color: "#a78bfa" },
    { id: "scope", label: "Analyzer", kind: "scope", slot: "instrument", color: "#b5ff3a" },
  ];
  const equipmentToInteraction = {
    pipette: ["primary-reagent", "prep-zone"],
    hood: ["protocol-sample", "hood"],
    centrifuge: ["protocol-sample", "centrifuge"],
    thermal: ["protocol-sample", "thermal"],
    gel: ["protocol-sample", "gel"],
    scope: ["readout-slide", "scope"],
  };
  return {
    vessel: `${lab.category} sample`,
    items: genericItems,
    targets: genericTargets,
    steps: lab.steps.map(([title, detail, equipmentId], index) => {
      const [item, target] = equipmentToInteraction[equipmentId] || ["protocol-sample", "prep-zone"];
      return {
        title,
        detail,
        item: index === 1 && item === "primary-reagent" ? "buffer" : item,
        target,
        result: `${title} complete`,
        observation: `${lab.title}: ${title.toLowerCase()} completed with acceptable simulated parameters.`,
      };
    }),
  };
}

function gameStepCount(lab) {
  return getGamePlan(lab).steps.length;
}

function getGameEntry(lab) {
  if (!state.progress[lab.id]) {
    state.progress[lab.id] = {
      status: "In Progress",
      currentStep: 0,
      quizScore: null,
      completedAt: null,
      minutes: 0,
      mistakes: 0,
      gameLog: [],
    };
  }
  state.progress[lab.id].gameLog ||= [];
  state.progress[lab.id].mistakes ||= 0;
  return state.progress[lab.id];
}

function findGameItem(game, itemId) {
  return game.items.find((item) => item.id === itemId) || game.targets.find((target) => target.id === itemId);
}

function findGameTarget(game, targetId) {
  return game.targets.find((target) => target.id === targetId) || game.items.find((item) => item.id === targetId);
}

function initials(name) {
  return (name || "BioCad")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function progressFor(lab) {
  const entry = state.progress[lab.id];
  if (!entry) return 0;
  if (entry.status === "Completed") return 100;
  return Math.round(((entry.currentStep || 0) / gameStepCount(lab)) * 100);
}

function persist() {
  store.set("progress", state.progress);
  store.set("settings", state.settings);
  if (state.user) store.set("user", state.user);
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  toastRoot.appendChild(node);
  setTimeout(() => node.remove(), 3400);
}

function setPage(page) {
  state.currentPage = page;
  state.mobileOpen = false;
  state.selectedLabItem = null;
  if (page !== "simulation") stopSimTimer();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navItems() {
  return [
    ["home", "Home"],
    ["labs", "Labs"],
    ["learn", "Learn"],
    ["progress", "Progress"],
    ["community", "Community"],
  ];
}

function NavBar() {
  return `
    <nav class="nav">
      <button class="brand" data-action="go" data-page="home" aria-label="BioCad home">
        <span class="brand-mark"><i></i></span>
        <span>BioCad</span>
      </button>
      <div class="nav-links" aria-label="Primary navigation">
        ${navItems()
          .map(
            ([page, label]) => `
              <button class="nav-link ${state.currentPage === page ? "active" : ""}" data-action="go" data-page="${page}">
                ${label}
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="nav-actions">
        <button class="icon-btn" data-action="focus-search" aria-label="Search">${icon("search")}</button>
        <button class="icon-btn" data-action="notify" aria-label="Notifications">${icon("bell")}<span class="notify-dot"></span></button>
        <button class="avatar" data-action="go" data-page="profile" aria-label="Profile">${initials(state.user?.name)}</button>
        <button class="icon-btn mobile-menu" data-action="mobile" aria-label="Open menu">${icon("menu")}</button>
      </div>
    </nav>
    ${
      state.mobileOpen
        ? `<div class="mobile-overlay">
            <div class="mobile-sheet">
              <button class="icon-btn" data-action="mobile" aria-label="Close menu">${icon("close")}</button>
              ${navItems()
                .map(
                  ([page, label]) =>
                    `<button class="nav-link ${state.currentPage === page ? "active" : ""}" data-action="go" data-page="${page}">${label}</button>`,
                )
                .join("")}
              <button class="nav-link" data-action="go" data-page="profile">Profile</button>
            </div>
          </div>`
        : ""
    }
  `;
}

function Shell(content) {
  return `<div class="app-shell">${NavBar()}${content}</div>`;
}

function AuthPage() {
  const isSignup = state.authMode === "signup";
  return `
    <main class="auth-page">
      <section class="auth-showcase">
        <span class="eyebrow"><span class="live-dot"></span> Virtual biotechnology lab</span>
        <h1>Science. <span class="gradient-text">Simulated.</span> Mastered.</h1>
        <p>
          Step into a premium training environment for PCR, CRISPR, electrophoresis, cell culture,
          microscopy, protein workflows, and bioinformatics. Practice high-stakes lab technique before the real bench.
        </p>
        <div class="grid grid-3">
          <div class="mini-stat"><strong>12</strong><span>interactive protocol labs</span></div>
          <div class="mini-stat"><strong>48+</strong><span>guided equipment actions</span></div>
          <div class="mini-stat"><strong>Live</strong><span>progress and skill analytics</span></div>
        </div>
      </section>
      <section class="auth-card card">
        <div class="auth-tabs">
          <button class="${!isSignup ? "active" : ""}" data-action="auth-mode" data-mode="login">Login</button>
          <button class="${isSignup ? "active" : ""}" data-action="auth-mode" data-mode="signup">Sign Up</button>
        </div>
        <form class="auth-form" data-action="auth-submit">
          ${isSignup ? `<label class="field"><span>Name</span><input name="name" value="Maya Sen" required /></label>` : ""}
          <label class="field"><span>Email</span><input name="email" type="email" value="maya@biocad.edu" required /></label>
          ${
            isSignup
              ? `<div class="form-grid">
                  <label class="field"><span>Role</span><select name="role"><option>Student</option><option>Educator</option><option>Professional</option></select></label>
                  <label class="field"><span>Institution</span><input name="institution" value="Nova Institute of Biotechnology" /></label>
                </div>`
              : `<label class="toggle-row"><span>Remember me</span><button type="button" class="switch on" data-action="noop" aria-label="Remember me"></button></label>`
          }
          <label class="field"><span>Password</span><input name="password" type="password" value="biocad-demo" required /></label>
          <button class="btn btn-primary" type="submit">${isSignup ? "Create BioCad Account" : "Enter BioCad"} ${icon("arrow")}</button>
          <button class="btn btn-secondary" type="button" data-action="demo-login">${icon("zap")} Continue as Demo</button>
        </form>
        <p class="auth-note">Mock authentication is stored locally for the prototype, so you can refresh and keep your training state.</p>
      </section>
    </main>
  `;
}

function HomePage() {
  const testimonial = testimonials[state.testimonialIndex % testimonials.length];
  return Shell(`
    <main class="page">
      <section class="hero">
        <div>
          <span class="eyebrow"><span class="live-dot"></span> Active lab training environment</span>
          <h1>BioCad <span class="gradient-text">makes wet-lab mastery feel cinematic.</span></h1>
          <p class="hero-copy">
            Run biotechnology protocols in a simulated lab bench with guided equipment, live notebooking,
            quiz feedback, progress analytics, and a premium interface built for students and professionals.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-pulse" data-action="go" data-page="labs">${icon("play")} Start Learning</button>
            <button class="btn btn-secondary" data-action="launch" data-lab="pcr">${icon("flask")} Launch Active Lab</button>
          </div>
          <div class="hero-stats">
            <div class="mini-stat"><strong>96%</strong><span>protocol confidence lift</span></div>
            <div class="mini-stat"><strong>4.8</strong><span>average lab rating</span></div>
            <div class="mini-stat"><strong>8.4h</strong><span>simulated bench time</span></div>
          </div>
        </div>
        <div class="hero-visual" style="--hero-asset:url('${HERO_ASSET}')">
          <div class="hero-lab-card">
            <span class="scanline"></span>
          </div>
          <div class="dna-rail">
            ${Array.from({ length: 12 }, (_, index) => `<span style="top:${index * 8.4}%;--twist:${index % 2 ? -18 : 18}deg"></span>`).join("")}
          </div>
          <div class="molecule-stage">
            <div class="molecule-ring"><i class="atom"></i><i class="atom"></i><i class="atom"></i><i class="atom"></i></div>
          </div>
          <div class="hero-panel">
            <h3>PCR Amplification Technique</h3>
            <div class="panel-row"><span>Thermal cycle</span><strong>Step 3 / 5</strong></div>
            ${ProgressBar(62)}
            <div class="panel-row"><span>Quality signal</span><strong class="gradient-text">Clean band detected</strong></div>
          </div>
        </div>
      </section>
      <section class="mt-32">
        <div class="section-title">
          <div>
            <h2>Train Like A Real Lab</h2>
            <p>Every module combines protocol discipline, instrument interaction, and instant assessment.</p>
          </div>
        </div>
        <div class="grid grid-3">
          ${FeatureCard("flask", "Virtual Labs", "Run realistic wet-lab workflows with sequential steps, responsive instruments, and notebook observations.")}
          ${FeatureCard("brain", "AI-Guided Protocols", "Practice decision-making with protocol cues, control checks, and instant recovery when your workflow drifts.")}
          ${FeatureCard("chart", "Real-Time Results", "Track skill growth through quiz scores, bench time, streaks, and category-level performance.")}
        </div>
      </section>
      <section class="mt-32">
        <div class="section-title">
          <div>
            <h2>Trusted By</h2>
            <p>A premium prototype experience for classrooms, bootcamps, and biotech training teams.</p>
          </div>
        </div>
        <div class="trusted-strip">
          ${["Nova BioInstitute", "Helix State", "AstraGen Labs", "Northbridge University", "Synapse Academy", "CellWorks"].map((name) => `<span class="logo-pill">${name}</span>`).join("")}
        </div>
      </section>
      <section class="mt-24">
        <div class="category-strip">
          ${categories.map((category) => `<button class="category-pill" data-action="filter-category" data-category="${category}">${category}</button>`).join("")}
        </div>
      </section>
      <section class="mt-24">
        <div class="testimonial">
          <blockquote>${testimonial.quote}</blockquote>
          <cite>${testimonial.by}</cite>
        </div>
      </section>
      ${Footer()}
    </main>
  `);
}

function FeatureCard(iconName, title, copy) {
  return `<article class="feature-card card"><span class="feature-icon">${icon(iconName)}</span><h3>${title}</h3><p>${copy}</p></article>`;
}

function Footer() {
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <strong>BioCad</strong>
          <p>Science. Simulated. Mastered.</p>
        </div>
        <form class="newsletter" data-action="newsletter">
          <label class="field"><span>Lab notes digest</span><input name="email" placeholder="you@lab.edu" /></label>
          <button class="btn btn-secondary" type="submit">Subscribe</button>
        </form>
      </div>
    </footer>
  `;
}

function Badge(label, type = "cyan") {
  return `<span class="badge badge-${type}">${label}</span>`;
}

function ProgressBar(value) {
  return `<div class="progress-track" aria-label="Progress ${value}%"><div class="progress-fill" style="--progress:${value}%"></div></div>`;
}

function LabsPage() {
  const filtered = labs.filter((lab) => {
    const matchesSearch = `${lab.title} ${lab.category} ${lab.summary}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === "All" || lab.category === state.category;
    const matchesDifficulty = state.difficulty === "All" || lab.difficulty === state.difficulty;
    const progress = state.progress[lab.id]?.status || "Not Started";
    const matchesStatus = state.status === "All" || progress === state.status;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });
  return Shell(`
    <main class="page">
      <div class="page-title">
        <div>
          <span class="eyebrow">Lab catalog</span>
          <h1>Choose Your Next Simulation</h1>
          <p>Filter by technique, difficulty, duration, and completion state. Every card launches directly into an immersive lab bench.</p>
        </div>
      </div>
      <section class="catalog-layout">
        <aside class="filters card">
          <h3>Filters</h3>
          <label class="search-field"><span>Search labs</span><input data-action="search" value="${escapeHtml(state.search)}" placeholder="PCR, CRISPR, protein..." /></label>
          ${FilterGroup("Category", ["All", ...categories], state.category, "category")}
          ${FilterGroup("Difficulty", ["All", "Beginner", "Intermediate", "Advanced"], state.difficulty, "difficulty")}
          ${FilterGroup("Status", ["All", "Not Started", "In Progress", "Completed"], state.status, "status")}
        </aside>
        <section>
          <div class="lab-topbar">
            <p class="muted">${filtered.length} labs available</p>
            <div class="toolbar">
              <button class="btn btn-secondary" data-action="reset-filters">Reset Filters</button>
              <button class="btn btn-primary" data-action="launch" data-lab="${filtered[0]?.id || "pcr"}">${icon("play")} Launch First Match</button>
            </div>
          </div>
          ${
            filtered.length
              ? `<div class="lab-grid">${filtered.map(LabCard).join("")}</div>`
              : `<div class="empty-state">No labs match the current filter set.</div>`
          }
        </section>
      </section>
    </main>
  `);
}

function FilterGroup(title, options, active, key) {
  return `
    <div class="filter-group">
      <span class="muted">${title}</span>
      ${options
        .map(
          (option) => `
            <button class="filter-btn ${active === option ? "active" : ""}" data-action="set-filter" data-filter="${key}" data-value="${option}">
              <span>${option}</span>
              ${active === option ? icon("check") : ""}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function LabCard(lab) {
  const entry = state.progress[lab.id] || { status: "Not Started", currentStep: 0 };
  const percent = progressFor(lab);
  const difficultyType = lab.difficulty === "Advanced" ? "purple" : lab.difficulty === "Intermediate" ? "yellow" : "green";
  return `
    <article class="lab-card card" style="--lab-color:${lab.color}">
      <div class="lab-art">${labIllustration(lab.icon)}</div>
      <h3>${lab.title}</h3>
      <p>${lab.summary}</p>
      <div class="lab-meta">
        ${Badge(lab.category, "cyan")}
        ${Badge(lab.difficulty, difficultyType)}
        ${Badge(`${lab.duration} min`, "purple")}
        ${Badge(`★ ${lab.rating}`, "green")}
      </div>
      <div class="lab-footer">
        <div>
          <div class="panel-row"><span class="muted">${entry.status}</span><strong>${percent}%</strong></div>
          ${ProgressBar(percent)}
        </div>
        <button class="btn btn-primary ${entry.status === "In Progress" ? "btn-pulse" : ""}" data-action="launch" data-lab="${lab.id}">
          ${icon("play")} ${entry.status === "Completed" ? "Replay Lab" : entry.status === "In Progress" ? "Resume Lab" : "Launch Lab"}
        </button>
      </div>
    </article>
  `;
}

function SimulationPage() {
  const lab = getLab();
  const game = getGamePlan(lab);
  const entry = getGameEntry(lab);
  const currentStep = Math.min(entry.currentStep || 0, game.steps.length);
  const isComplete = currentStep >= game.steps.length;
  return Shell(`
    <main class="simulation-shell">
      <section class="sim-topbar">
        <div>
          <span class="eyebrow"><span class="live-dot"></span> 3D Lab Simulation</span>
          <h1>${lab.title}</h1>
        </div>
        <div class="toolbar">
          <span class="timer">${icon("clock")} ${formatTime(state.simSeconds)}</span>
          <span class="badge badge-cyan">${currentStep}/${game.steps.length} actions</span>
          <span class="badge badge-purple">${Math.max(0, 100 - (entry.mistakes || 0) * 6)} technique</span>
          <button class="btn btn-secondary" data-action="go" data-page="labs">Exit Lab</button>
        </div>
      </section>
      <aside class="sim-panel">
        <div class="sim-header">
          <h2>Protocol</h2>
          <span class="badge badge-green">${Math.round((currentStep / game.steps.length) * 100)}%</span>
        </div>
        <div class="step-list">
          ${game.steps
            .map((step, index) => {
              const complete = index < currentStep;
              const active = index === currentStep;
              const locked = index > currentStep;
              return `
                <div class="step-item ${complete ? "complete" : ""} ${active ? "active" : ""} ${locked ? "locked" : ""}">
                  <button class="step-toggle" data-action="${locked ? "locked-step" : "step-info"}" data-step="${index}">
                    <span class="check-ring">${complete ? icon("check") : index + 1}</span>
                    <span><span class="step-title">${step.title}</span><span class="step-detail">${step.detail}</span></span>
                  </button>
                </div>
              `;
            })
            .join("")}
        </div>
      </aside>
      ${GameBench(lab, game, entry, currentStep)}
      <aside class="notebook">
        <div class="sim-header">
          <h3>Lab Notebook</h3>
          <span class="badge badge-purple">Auto-saved</span>
        </div>
        <div class="notebook-content">
          ${NotebookEntries(game, entry)}
        </div>
      </aside>
      ${isComplete && !entry.modalSeen ? CompletionModal(lab, entry, game) : ""}
    </main>
  `);
}

function GameBench(lab, game, entry, currentStep) {
  const activeStep = game.steps[currentStep];
  const isComplete = currentStep >= game.steps.length;
  const activeItem = activeStep ? findGameItem(game, activeStep.item) : null;
  const activeTarget = activeStep ? findGameTarget(game, activeStep.target) : null;
  const selectedItem = state.selectedLabItem ? findGameItem(game, state.selectedLabItem) : null;
  const instrumentTargets = game.targets;

  // Determine if we should show reagent controls
  const showControls = selectedItem && (selectedItem.kind === "tube" || selectedItem.kind === "bottle" || selectedItem.kind === "vial");

  return `
    <section class="bench">
      <div class="bench-title">
        <div>
          <span class="eyebrow">${isComplete ? "Experiment complete" : "Bench objective"}</span>
          <h2>${isComplete ? "Experiment Run Complete" : activeStep.title}</h2>
          <p>${isComplete ? "The final observations are in the notebook." : activeStep.detail}</p>
        </div>
        <div class="selected-readout ${selectedItem ? "active" : ""}">
          <span>${selectedItem ? "Selected material" : "No material selected"}</span>
          <strong>${selectedItem?.label || game.vessel}</strong>
          ${
            showControls
              ? `
            <div class="reagent-adjuster">
              <h4>Adjust Parameters</h4>
              <div class="control-row">
                <span>Volume</span>
                <input type="range" class="range-input" data-action="adjust-volume" min="1" max="50" value="${state.reagentVolume}">
                <small>${state.reagentVolume} µL</small>
              </div>
              <div class="control-row">
                <span>Conc.</span>
                <input type="range" class="range-input" data-action="adjust-conc" min="10" max="200" step="10" value="${state.reagentConcentration}">
                <small>${state.reagentConcentration}%</small>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
      <div class="lab-game" style="--lab-color:${lab.color}">
        <aside class="material-dock">
          <div class="dock-title">
            <span>Materials</span>
            <strong>${game.items.length}</strong>
          </div>
          <div class="material-list">
            ${game.items.map((item) => LabItemCard(item, game, entry, currentStep)).join("")}
          </div>
        </aside>
        <section class="lab-stage">
          <div class="stage-readout">
            <div>
              <span class="muted">${isComplete ? "Final readout" : "Expected action"}</span>
              <strong>${isComplete ? "Notebook ready for quiz" : `${activeItem?.label} -> ${activeTarget?.label}`}</strong>
            </div>
            ${ProgressBar(Math.round((currentStep / game.steps.length) * 100))}
          </div>
          <div class="lab-scene-wrap">
            <div id="lab-scene-root" class="lab-scene-root" aria-label="3D lab simulation"></div>
            <div class="lab-scene-overlay">
              <div class="lab-scene-hud">
                <span class="muted">${isComplete ? "Simulation complete" : "Step narrative"}</span>
                <p class="step-narrative">${isComplete ? "All protocol actions finished. Review the notebook and take the assessment." : activeStep?.narrative || activeStep?.detail || ""}</p>
                ${
                  !isComplete && activeStep
                    ? `
                  <div class="scene-controls">
                    <button class="btn btn-primary btn-sm" data-action="perform-step" ${selectedItem ? "" : "disabled"}>
                      ${icon("play")} Perform step
                    </button>
                    <span class="scene-hint">Click materials in 3D or use the side panels · WASD to explore</span>
                  </div>
                `
                    : ""
                }
              </div>
              <div class="reaction-readout reaction-readout-overlay">
                ${ReactionReadout(game, entry, currentStep)}
              </div>
            </div>
          </div>
        </section>
        <aside class="instrument-dock">
          <div class="dock-title">
            <span>Work zones</span>
            <strong>${instrumentTargets.length}</strong>
          </div>
          <div class="instrument-list">
            ${instrumentTargets.map((target) => TargetZone(target, game, entry, currentStep)).join("")}
          </div>
        </aside>
      </div>
    </section>
  `;
}

function LabItemCard(item, game, entry, currentStep) {
  const activeStep = game.steps[currentStep];
  const completedUses = game.steps.slice(0, currentStep).filter((step) => step.item === item.id).length;
  const spent = completedUses > 0 && !item.reusable && activeStep?.item !== item.id;
  const selected = state.selectedLabItem === item.id;
  const needed = activeStep?.item === item.id;
  return `
    <button
      class="lab-item ${selected ? "selected" : ""} ${needed ? "needed" : ""} ${spent ? "spent" : ""}"
      data-action="select-lab-item"
      data-lab-item="${item.id}"
      draggable="${spent ? "false" : "true"}"
      ${spent ? "disabled" : ""}
      style="--item-color:${item.color || "#00f5d4"}"
    >
      ${LabItemModel(item)}
      <span><strong>${item.label}</strong><small>${item.kind}</small></span>
    </button>
  `;
}

function TargetZone(target, game, entry, currentStep) {
  const activeStep = game.steps[currentStep];
  const ready = activeStep?.target === target.id;
  const loaded = game.steps.slice(0, currentStep).some((step) => step.target === target.id);
  return `
    <button
      class="drop-zone ${ready ? "ready" : ""} ${loaded ? "loaded" : ""}"
      data-action="drop-target"
      data-drop-target="${target.id}"
      style="--target-color:${target.color || "#00f5d4"}"
    >
      ${TargetModel(target, game, entry, currentStep)}
      <span class="target-copy"><strong>${target.label}</strong><small>${ready ? "armed" : loaded ? "loaded" : "standby"}</small></span>
    </button>
  `;
}

function LabItemModel(item) {
  return `<span class="item-model item-${item.kind}"><i></i><b></b></span>`;
}

function TargetModel(target) {
  return `
    <span class="target-model target-${target.kind}">
      <i></i><b></b><em></em>
    </span>
  `;
}

function ReactionReadout(game, entry, currentStep) {
  const completedSteps = entry.gameLog || [];
  const totalVolume = completedSteps.reduce((sum, log) => sum + (log.params?.volume || 0), 0);
  const avgConc = completedSteps.length 
    ? completedSteps.reduce((sum, log) => sum + (log.params?.conc || 100), 0) / completedSteps.length 
    : 100;

  const bands = completedSteps.some((log) => log.title.toLowerCase().includes("lane") || log.title.toLowerCase().includes("gel"));
  const colorWells = completedSteps.some((log) => log.title.toLowerCase().includes("plate") || log.title.toLowerCase().includes("well"));
  const cells = completedSteps.some((log) => log.title.toLowerCase().includes("cell") || log.title.toLowerCase().includes("flask"));
  
  // Calculate fill percentage based on volume (max 100µL for display)
  const fillPercent = Math.min(90, (totalVolume / 100) * 100 + 10);
  
  // Color shifts from cyan to purple based on concentration
  const hue = 170 + (avgConc / 200) * 100; // 170 is cyan-ish, 270 is purple-ish
  const labColor = `hsl(${hue}, 80%, 60%)`;

  return `
    <div class="mini-lab-display ${bands ? "show-bands" : ""} ${colorWells ? "show-wells" : ""} ${cells ? "show-cells" : ""}" style="--lab-color: ${labColor}">
      <div class="display-info">
        <span class="display-title">${game.vessel} Status</span>
        <small>${totalVolume.toFixed(1)} µL total | ${avgConc.toFixed(0)}% avg. conc</small>
      </div>
      <div class="display-vial" style="--fill:${fillPercent}%"><i></i></div>
      <div class="display-gel"><i></i><i></i><i></i><i></i></div>
      <div class="display-wells">${Array.from({ length: 12 }, () => "<i></i>").join("")}</div>
      <div class="display-cells">${Array.from({ length: 10 }, () => "<i></i>").join("")}</div>
    </div>
  `;
}

function NotebookEntries(game, entry) {
  const currentStep = entry.currentStep || 0;
  const logs = entry.gameLog?.length
    ? entry.gameLog
    : game.steps.slice(0, currentStep).map((step, index) => ({
        title: step.title,
        result: step.result,
        observation: step.observation,
        index,
      }));
  const notes = logs.map((log, index) => `
    <div class="note"><strong>${index + 1}. ${log.title}</strong><br />${log.result}<br /><span class="gradient-text">Observation:</span> ${log.observation}</div>
  `);
  if (!notes.length) {
    notes.push(`<div class="note">Notebook ready. The first successful material transfer will create an observation entry.</div>`);
  }
  return `
    ${notes.join("")}
    <table class="data-table">
      <thead><tr><th>Metric</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>Protocol integrity</td><td>${Math.max(0, 100 - (entry.mistakes || 0) * 6)}%</td></tr>
        <tr><td>Actions logged</td><td>${currentStep}/${game.steps.length}</td></tr>
        <tr><td>Technique errors</td><td>${entry.mistakes || 0}</td></tr>
        <tr><td>Current sample</td><td>${game.vessel}</td></tr>
      </tbody>
    </table>
  `;
}

function CompletionModal(lab, entry, game) {
  const score = Math.max(60, Math.min(99, 98 - (entry.mistakes || 0) * 6));
  return `
    <div class="modal-backdrop">
      <section class="modal">
        <span class="eyebrow"><span class="live-dot"></span> Lab complete</span>
        <h2>${score}% technique score</h2>
        <p>You completed ${lab.title}. Your notebook, equipment sequence, and protocol timing were saved to your progress dashboard.</p>
        <div class="hero-stats">
          <div class="mini-stat"><strong>${game.steps.length}</strong><span>actions completed</span></div>
          <div class="mini-stat"><strong>${lab.duration}</strong><span>sim minutes</span></div>
          <div class="mini-stat"><strong>${score}</strong><span>score</span></div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="start-quiz" data-lab="${lab.id}">Take Quiz ${icon("arrow")}</button>
          <button class="btn btn-secondary" data-action="dismiss-modal" data-lab="${lab.id}">Stay in Lab</button>
        </div>
      </section>
    </div>
  `;
}

function QuizPage() {
  const lab = getLab(state.quizLabId);
  const question = lab.quiz[state.quizIndex];
  const isFinal = state.quizIndex >= lab.quiz.length;
  if (isFinal) return Shell(QuizResults(lab));
  const selected = state.selectedChoice;
  return Shell(`
    <main class="page quiz-wrap">
      <section class="quiz-panel">
        <div class="section-title">
          <div>
            <span class="eyebrow">Assessment ${state.quizIndex + 1}/${lab.quiz.length}</span>
            <h2>${lab.title}</h2>
          </div>
          <button class="btn btn-secondary" data-action="go" data-page="labs">Exit</button>
        </div>
        ${ProgressBar(Math.round((state.quizIndex / lab.quiz.length) * 100))}
        <h1 class="quiz-question">${question.question}</h1>
        <div class="choice-grid">
          ${question.choices
            .map((choice, index) => {
              const className =
                selected === null ? "" : index === question.answer ? "correct" : selected === index ? "wrong" : "";
              return `<button class="choice ${className}" data-action="answer" data-choice="${index}" ${selected !== null ? "disabled" : ""}>${choice}</button>`;
            })
            .join("")}
        </div>
        ${
          selected !== null
            ? `<div class="feedback"><strong>${selected === question.answer ? "Correct." : "Not quite."}</strong> ${question.explanation}</div>
              <div class="hero-actions"><button class="btn btn-primary" data-action="next-question">Next ${icon("arrow")}</button></div>`
            : ""
        }
      </section>
    </main>
  `);
}

function QuizResults(lab) {
  const correct = state.quizAnswers.filter(Boolean).length;
  const score = Math.round((correct / lab.quiz.length) * 100);
  const passed = score >= 75;
  const entry = state.progress[lab.id] || {};
  state.progress[lab.id] = {
    ...entry,
    status: "Completed",
    currentStep: lab.steps.length,
    quizScore: score,
    completedAt: new Date().toISOString().slice(0, 10),
    minutes: lab.duration,
  };
  persist();
  return `
    <main class="page quiz-wrap">
      <section class="quiz-panel">
        <span class="eyebrow">${passed ? "Passed" : "Needs review"}</span>
        <h1 class="quiz-question">${score}% final score</h1>
        <p class="muted">You answered ${correct} of ${lab.quiz.length} questions correctly. Your result has been saved to the progress dashboard.</p>
        <div class="hero-stats">
          <div class="mini-stat"><strong>${correct}</strong><span>correct</span></div>
          <div class="mini-stat"><strong>${lab.quiz.length - correct}</strong><span>review</span></div>
          <div class="mini-stat"><strong>${passed ? "Yes" : "No"}</strong><span>pass threshold</span></div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="next-lab">${icon("play")} Next Lab</button>
          <button class="btn btn-secondary" data-action="retry-quiz" data-lab="${lab.id}">Retry Quiz</button>
          <button class="btn btn-ghost" data-action="go" data-page="progress">View Progress</button>
        </div>
      </section>
    </main>
  `;
}

function ProgressPage() {
  const completed = Object.values(state.progress).filter((entry) => entry.status === "Completed").length;
  const hours = (Object.values(state.progress).reduce((sum, entry) => sum + (entry.minutes || 0), 0) / 60).toFixed(1);
  const scores = Object.values(state.progress).filter((entry) => entry.quizScore);
  const avg = scores.length ? Math.round(scores.reduce((sum, entry) => sum + entry.quizScore, 0) / scores.length) : 0;
  const rows = labs.filter((lab) => state.progress[lab.id]).map((lab) => ({ lab, entry: state.progress[lab.id] }));
  const badges = [
    completed >= 1 && "PCR Expert",
    completed >= 2 && "Gel Runner",
    completed >= 3 && "Culture Keeper",
    avg >= 85 && "Precision Analyst",
    rows.length >= 4 && "Protocol Streak",
  ].filter(Boolean);
  return Shell(`
    <main class="page">
      <div class="page-title">
        <div>
          <span class="eyebrow">Student dashboard</span>
          <h1>Welcome back, ${state.user?.name || "Scientist"}</h1>
          <p>Your simulation record blends completed labs, assessment accuracy, and time spent across biotechnology domains.</p>
        </div>
      </div>
      <section class="stat-grid">
        ${StatCard("trophy", completed, "Labs Completed")}
        ${StatCard("zap", 7, "Current Streak")}
        ${StatCard("clock", hours, "Total Hours")}
        ${StatCard("chart", avg, "Avg. Quiz Score")}
      </section>
      <section class="dashboard-grid">
        <div class="chart-card card">
          <h3>Quiz Scores</h3>
          ${LineChart(scores.map((entry, index) => ({ label: index + 1, value: entry.quizScore })))}
        </div>
        <div class="chart-card card">
          <h3>Time By Category</h3>
          ${BarChart(categoryMinutes())}
        </div>
      </section>
      <section class="table-card card mt-24">
        <div class="section-title">
          <div>
            <h2>Lab Completion</h2>
            <p>Sortable behavior is mocked visually in this static prototype; the table reflects your saved local progress.</p>
          </div>
        </div>
        <table class="attempt-table">
          <thead><tr><th>Lab</th><th>Status</th><th>Score</th><th>Date</th></tr></thead>
          <tbody>
            ${rows
              .map(
                ({ lab, entry }) =>
                  `<tr><td>${lab.title}</td><td>${entry.status}</td><td>${entry.quizScore || "Pending"}</td><td>${entry.completedAt || "In progress"}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </section>
      <section class="chart-card card mt-24">
        <h3>Skill Badges</h3>
        <div class="badge-wall">
          ${badges.length ? badges.map((badge) => Badge(badge, "green")).join("") : Badge("Complete a lab to unlock badges", "purple")}
        </div>
      </section>
    </main>
  `);
}

function StatCard(iconName, value, label) {
  return `<article class="stat-card card">${icon(iconName)}<strong class="stat-value" data-count="${value}">0</strong><span class="stat-label">${label}</span></article>`;
}

function categoryMinutes() {
  return categories
    .map((category) => ({
      label: category.split(" ")[0],
      value: labs
        .filter((lab) => lab.category === category)
        .reduce((sum, lab) => sum + (state.progress[lab.id]?.minutes || 0), 0),
    }))
    .filter((item) => item.value > 0);
}

function LineChart(points) {
  const data = points.length ? points : [{ label: 1, value: 0 }];
  const width = 620;
  const height = 260;
  const pad = 28;
  const max = 100;
  const coords = data.map((point, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(1, data.length - 1);
    const y = height - pad - (point.value / max) * (height - pad * 2);
    return [x, y];
  });
  const path = coords.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  return `
    <div class="chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Quiz score line chart">
        <path d="M${pad} ${height - pad}H${width - pad}" stroke="rgba(255,255,255,.16)" />
        <path d="M${pad} ${pad}V${height - pad}" stroke="rgba(255,255,255,.16)" />
        <path d="${path}" fill="none" stroke="url(#lineGrad)" stroke-width="5" stroke-linecap="round" />
        ${coords.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#00f5d4" />`).join("")}
        <defs><linearGradient id="lineGrad"><stop stop-color="#00f5d4"/><stop offset="1" stop-color="#b5ff3a"/></linearGradient></defs>
      </svg>
    </div>
  `;
}

function BarChart(data) {
  const items = data.length ? data : [{ label: "No data", value: 1 }];
  const width = 620;
  const height = 260;
  const pad = 34;
  const max = Math.max(...items.map((item) => item.value), 1);
  const barWidth = (width - pad * 2) / items.length - 14;
  return `
    <div class="chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Time spent bar chart">
        <path d="M${pad} ${height - pad}H${width - pad}" stroke="rgba(255,255,255,.16)" />
        ${items
          .map((item, index) => {
            const x = pad + index * (barWidth + 14);
            const barHeight = (item.value / max) * (height - pad * 2);
            const y = height - pad - barHeight;
            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="url(#barGrad)" />
              <text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" fill="currentColor" font-size="14">${item.label}</text>`;
          })
          .join("")}
        <defs><linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#a78bfa"/><stop offset="1" stop-color="#00f5d4"/></linearGradient></defs>
      </svg>
    </div>
  `;
}

function LearnPage() {
  const filtered = articles.filter((article) => `${article.title} ${article.category} ${article.summary}`.toLowerCase().includes(state.learnSearch.toLowerCase()));
  const selected = articles.find((article) => article.id === state.selectedArticleId) || articles[0];
  return Shell(`
    <main class="page">
      <div class="page-title">
        <div>
          <span class="eyebrow">Theory library</span>
          <h1>Learn The Why Behind The Protocol</h1>
          <p>Short, lab-aligned explainers connect technique, controls, and interpretation.</p>
        </div>
      </div>
      <section class="library-layout">
        <div>
          <label class="search-field"><span>Search articles</span><input data-action="learn-search" value="${escapeHtml(state.learnSearch)}" placeholder="primer, sterility, CRISPR..." /></label>
          <div class="grid mt-16">
            ${filtered
              .map(
                (article) => `
                  <button class="article-card card" data-action="article" data-article="${article.id}">
                    ${Badge(article.category, "cyan")} ${Badge(article.readTime, "purple")}
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
        <article class="article-detail card">
          ${Badge(selected.category, "cyan")}
          <h2>${selected.title}</h2>
          ${selected.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <div class="callout">
            <strong>Key concept</strong>
            <p>Controls make interpretation possible: they tell you whether the technique worked before you trust the sample result.</p>
          </div>
          <svg viewBox="0 0 420 160" role="img" aria-label="Protocol concept diagram">
            <path d="M30 80h95M152 80h95M274 80h95" stroke="currentColor" stroke-width="4" opacity=".55"/>
            <circle cx="62" cy="80" r="32" fill="none" stroke="#00f5d4" stroke-width="5"/>
            <circle cx="210" cy="80" r="32" fill="none" stroke="#b5ff3a" stroke-width="5"/>
            <circle cx="358" cy="80" r="32" fill="none" stroke="#a78bfa" stroke-width="5"/>
            <text x="62" y="86" text-anchor="middle" fill="currentColor" font-size="14">Setup</text>
            <text x="210" y="86" text-anchor="middle" fill="currentColor" font-size="14">Control</text>
            <text x="358" y="86" text-anchor="middle" fill="currentColor" font-size="14">Result</text>
          </svg>
          <button class="btn btn-primary mt-16" data-action="launch" data-lab="${selected.related}">${icon("play")} Open Related Lab</button>
        </article>
      </section>
    </main>
  `);
}

function ProfilePage() {
  const user = state.user || defaultUser;
  return Shell(`
    <main class="page">
      <div class="page-title">
        <div>
          <span class="eyebrow">Profile & settings</span>
          <h1>Training Identity</h1>
          <p>Personalize your learning context, notification preferences, and display theme.</p>
        </div>
      </div>
      <section class="profile-layout">
        <aside class="profile-panel card profile-hero">
          <span class="profile-avatar">${initials(user.name)}</span>
          <div>
            <h2>${user.name}</h2>
            <p class="muted">${user.role} at ${user.institution}</p>
          </div>
          <button class="btn btn-secondary" data-action="logout">Logout</button>
        </aside>
        <section class="profile-panel card">
          <form class="auth-form" data-action="profile-save">
            <div class="form-grid">
              <label class="field"><span>Name</span><input name="name" value="${escapeHtml(user.name)}" /></label>
              <label class="field"><span>Institution</span><input name="institution" value="${escapeHtml(user.institution)}" /></label>
            </div>
            <div class="form-grid">
              <label class="field"><span>Role</span><select name="role">${["Student", "Educator", "Professional"].map((role) => `<option ${role === user.role ? "selected" : ""}>${role}</option>`).join("")}</select></label>
              <label class="field"><span>Email</span><input name="email" value="${escapeHtml(user.email)}" /></label>
            </div>
            <label class="field"><span>Bio</span><textarea name="bio">${escapeHtml(user.bio || "")}</textarea></label>
            <label class="field"><span>Goals</span><textarea name="goals">${escapeHtml(user.goals || "")}</textarea></label>
            <button class="btn btn-primary" type="submit">Save Profile</button>
          </form>
          <div class="grid mt-24">
            ${ToggleRow("Lab completion alerts", "labAlerts")}
            ${ToggleRow("Weekly progress digest", "weeklyDigest")}
            ${ToggleRow("Badge unlock notifications", "badgeAlerts")}
            ${ToggleRow("Light mode", "theme", state.settings.theme === "light")}
          </div>
          <div class="callout danger mt-24">
            <strong>Danger zone</strong>
            <p>Delete account is a UI-only prototype control. No remote data exists.</p>
          </div>
        </section>
      </section>
    </main>
  `);
}

function ToggleRow(label, key, forcedOn) {
  const on = forcedOn ?? state.settings[key];
  return `<div class="toggle-row"><span>${label}</span><button class="switch ${on ? "on" : ""}" data-action="toggle-setting" data-setting="${key}" aria-label="${label}"></button></div>`;
}

function CommunityPage() {
  return Shell(`
    <main class="page">
      <div class="page-title">
        <div>
          <span class="eyebrow">Community</span>
          <h1>Learn In Cohorts</h1>
          <p>Compare protocol strategies, join study rooms, and track class-wide lab mastery.</p>
        </div>
      </div>
      <section class="grid grid-3">
        ${CommunityCard("Protocol Review Room", "Live critique sessions for gel lanes, CRISPR guide choices, and notebook quality.", "128 online")}
        ${CommunityCard("Educator Console", "Assign labs, review completion trends, and identify confusing steps across cohorts.", "24 cohorts")}
        ${CommunityCard("Weekly Challenge", "A timed sequence alignment challenge with scoreboards and technique badges.", "Starts Friday")}
      </section>
      <section class="chart-card card mt-24">
        <h3>Live Discussion Pulse</h3>
        ${LineChart([{ value: 42 }, { value: 61 }, { value: 58 }, { value: 77 }, { value: 84 }, { value: 91 }])}
      </section>
    </main>
  `);
}

function CommunityCard(title, copy, meta) {
  return `<article class="community-card card">${Badge(meta, "green")}<h3>${title}</h3><p>${copy}</p><button class="btn btn-secondary mt-16" data-action="notify">Join</button></article>`;
}

function formatTime(seconds) {
  const mins = Math.max(0, Math.floor(seconds / 60));
  const secs = Math.max(0, seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function startSimTimer() {
  stopSimTimer();
  const lab = getLab();
  if (!state.simSeconds || state.simSeconds <= 0) state.simSeconds = lab.duration * 60;
  simTimer = setInterval(() => {
    if (state.currentPage !== "simulation") return stopSimTimer();
    state.simSeconds = Math.max(0, state.simSeconds - 1);
    const timer = document.querySelector(".timer");
    if (timer) timer.innerHTML = `${icon("clock")} ${formatTime(state.simSeconds)}`;
  }, 1000);
}

function stopSimTimer() {
  if (simTimer) clearInterval(simTimer);
  simTimer = null;
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const suffix = node.textContent.includes("%") ? "%" : "";
    const isDecimal = String(node.dataset.count).includes(".");
    let frame = 0;
    const total = 36;
    const tick = () => {
      frame += 1;
      const value = target * (frame / total);
      node.textContent = `${isDecimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
      if (frame < total) requestAnimationFrame(tick);
    };
    tick();
  });
}

function render() {
  if (!state.user) {
    app.innerHTML = AuthPage();
    bindEvents();
    return;
  }

  const pages = {
    home: HomePage,
    labs: LabsPage,
    simulation: SimulationPage,
    quiz: QuizPage,
    progress: ProgressPage,
    learn: LearnPage,
    profile: ProfilePage,
    community: CommunityPage,
  };
  app.innerHTML = (pages[state.currentPage] || HomePage)();
  bindEvents();
  if (state.currentPage === "simulation") {
    startSimTimer();
    requestAnimationFrame(() => mountLabScene());
  } else {
    if (window.LabScene3D) window.LabScene3D.unmount();
    lastSceneKey = "";
  }
  if (state.currentPage === "progress") animateCounters();
}

function mountLabScene() {
  const root = document.getElementById("lab-scene-root");
  if (!root || !window.LabScene3D || typeof THREE === "undefined") return;

  const lab = getLab();
  const game = getGamePlan(lab);
  const entry = getGameEntry(lab);
  const currentStep = Math.min(entry.currentStep || 0, game.steps.length);
  const sceneKey = `${lab.id}-${game.steps.length}`;

  const sceneOptions = {
    labColor: lab.color,
    game,
    currentStep,
    selectedItem: state.selectedLabItem,
    onSelectItem: (id) => {
      state.selectedLabItem = id;
      const item = findGameItem(game, id);
      syncLabSelectionUI(id);
      toast(`${item?.label || "Material"} selected.`);
      window.LabScene3D.setSelectedItem(id);
    },
    onAttemptInteraction: (itemId, targetId) => attemptLabInteraction(itemId, targetId),
  };

  if (sceneKey !== lastSceneKey) {
    lastSceneKey = sceneKey;
    window.LabScene3D.mount(root, sceneOptions);
  } else {
    window.LabScene3D.update(sceneOptions);
  }
}

function syncLabSelectionUI(selectedId) {
  app.querySelectorAll(".lab-item").forEach((node) => {
    node.classList.toggle("selected", node.dataset.labItem === selectedId);
  });
  const performBtn = app.querySelector('[data-action="perform-step"]');
  if (performBtn) performBtn.disabled = !selectedId;
  const readout = app.querySelector(".selected-readout");
  if (readout && selectedId) {
    const lab = getLab();
    const game = getGamePlan(lab);
    const item = findGameItem(game, selectedId);
    readout.classList.add("active");
    const strong = readout.querySelector("strong");
    if (strong) strong.textContent = item?.label || "";
  }
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((node) => {
    const action = node.dataset.action;
    if (action === "search") {
      node.addEventListener("input", (event) => {
        state.search = event.target.value;
        render();
      });
      return;
    }
    if (action === "learn-search") {
      node.addEventListener("input", (event) => {
        state.learnSearch = event.target.value;
        render();
      });
      return;
    }
    if (action === "adjust-volume") {
      node.addEventListener("input", (event) => {
        state.reagentVolume = Number(event.target.value);
        // Direct DOM update for better performance
        const label = node.nextElementSibling;
        if (label) label.textContent = `${state.reagentVolume} µL`;
      });
      return;
    }
    if (action === "adjust-conc") {
      node.addEventListener("input", (event) => {
        state.reagentConcentration = Number(event.target.value);
        const label = node.nextElementSibling;
        if (label) label.textContent = `${state.reagentConcentration}%`;
      });
      return;
    }
    if (node.tagName === "FORM") {
      node.addEventListener("submit", handleSubmit);
      return;
    }
    if (action === "select-lab-item") {
      node.addEventListener("dragstart", handleLabDragStart);
      node.addEventListener("dragend", handleLabDragEnd);
    }
    if (action === "drop-target") {
      node.addEventListener("dragover", handleLabDragOver);
      node.addEventListener("drop", handleLabDrop);
    }
    node.addEventListener("click", handleAction);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const action = form.dataset.action;
  const data = Object.fromEntries(new FormData(form).entries());
  if (action === "auth-submit") {
    state.user = {
      ...defaultUser,
      ...data,
      name: data.name || defaultUser.name,
      institution: data.institution || defaultUser.institution,
      role: data.role || "Student",
    };
    persist();
    toast(`Welcome to BioCad, ${state.user.name}.`);
    setPage("home");
  }
  if (action === "profile-save") {
    state.user = { ...state.user, ...data };
    persist();
    toast("Profile saved.");
    render();
  }
  if (action === "newsletter") {
    toast("Lab notes digest subscribed.");
  }
}

function handleLabDragStart(event) {
  const itemId = event.currentTarget.dataset.labItem;
  state.selectedLabItem = itemId;
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", itemId);
}

function handleLabDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
}

function handleLabDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleLabDrop(event) {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("text/plain") || state.selectedLabItem;
  attemptLabInteraction(itemId, event.currentTarget.dataset.dropTarget);
}

function handleAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;
  if (action === "noop") return;
  if (action === "go") return setPage(target.dataset.page);
  if (action === "mobile") {
    state.mobileOpen = !state.mobileOpen;
    return render();
  }
  if (action === "focus-search") {
    if (state.currentPage !== "labs") setPage("labs");
    setTimeout(() => document.querySelector("[data-action='search']")?.focus(), 40);
    return;
  }
  if (action === "notify") return toast("Prototype notification: cohort lab room is active.");
  if (action === "auth-mode") {
    state.authMode = target.dataset.mode;
    return render();
  }
  if (action === "demo-login") {
    state.user = defaultUser;
    persist();
    toast("Demo profile loaded.");
    return setPage("home");
  }
  if (action === "filter-category") {
    state.category = target.dataset.category;
    return setPage("labs");
  }
  if (action === "set-filter") {
    state[target.dataset.filter] = target.dataset.value;
    return render();
  }
  if (action === "reset-filters") {
    state.search = "";
    state.category = "All";
    state.difficulty = "All";
    state.status = "All";
    return render();
  }
  if (action === "launch") {
    const lab = getLab(target.dataset.lab);
    const game = getGamePlan(lab);
    const previous = state.progress[lab.id] || {};
    const shouldResume = previous.status === "In Progress" && (previous.currentStep || 0) > 0 && (previous.currentStep || 0) < game.steps.length;
    state.selectedLabId = lab.id;
    state.selectedLabItem = null;
    state.simSeconds = lab.duration * 60;
    state.reagentVolume = 10;
    state.reagentConcentration = 100;
    state.progress[lab.id] = shouldResume
      ? { ...previous, status: "In Progress", gameLog: previous.gameLog || [], mistakes: previous.mistakes || 0, modalSeen: false }
      : {
          ...previous,
          status: "In Progress",
          currentStep: 0,
          completedAt: null,
          minutes: 0,
          mistakes: 0,
          gameLog: [],
          modalSeen: false,
        };
    persist();
    return setPage("simulation");
  }
  if (action === "select-lab-item") {
    state.selectedLabItem = target.dataset.labItem;
    state.reagentVolume = 10;
    state.reagentConcentration = 100;
    const lab = getLab();
    const game = getGamePlan(lab);
    const item = findGameItem(game, state.selectedLabItem);
    syncLabSelectionUI(state.selectedLabItem);
    if (window.LabScene3D) window.LabScene3D.setSelectedItem(state.selectedLabItem);
    toast(`${item?.label || "Material"} selected.`);
    return;
  }
  if (action === "drop-target") {
    if (!state.selectedLabItem) {
      return toast("Select a reagent, sample, or lab object first.");
    }
    attemptLabInteraction(state.selectedLabItem, target.dataset.dropTarget);
    return;
  }
  if (action === "perform-step") {
    const lab = getLab();
    const game = getGamePlan(lab);
    const entry = getGameEntry(lab);
    const activeStep = game.steps[entry.currentStep || 0];
    if (!state.selectedLabItem) return toast("Select a material first.");
    if (!activeStep) return;
    return attemptLabInteraction(state.selectedLabItem, activeStep.target);
  }
  if (action === "complete-step") {
    const lab = getLab();
    const entry = getGameEntry(lab);
    return completeCurrentStep(lab, entry);
  }
  if (action === "step-info") return toast("Protocol step expanded in the notebook context.");
  if (action === "locked-step") return toast("Complete the current step to unlock this protocol action.");
  if (action === "dismiss-modal") {
    state.progress[target.dataset.lab].modalSeen = true;
    persist();
    return render();
  }
  if (action === "start-quiz") {
    state.quizLabId = target.dataset.lab;
    state.quizIndex = 0;
    state.selectedChoice = null;
    state.quizAnswers = [];
    return setPage("quiz");
  }
  if (action === "answer") {
    const lab = getLab(state.quizLabId);
    const selected = Number(target.dataset.choice);
    state.selectedChoice = selected;
    state.quizAnswers[state.quizIndex] = selected === lab.quiz[state.quizIndex].answer;
    return render();
  }
  if (action === "next-question") {
    state.quizIndex += 1;
    state.selectedChoice = null;
    return render();
  }
  if (action === "retry-quiz") {
    state.quizLabId = target.dataset.lab;
    state.quizIndex = 0;
    state.selectedChoice = null;
    state.quizAnswers = [];
    return render();
  }
  if (action === "next-lab") {
    const currentIndex = labs.findIndex((lab) => lab.id === state.quizLabId);
    const next = labs[(currentIndex + 1) % labs.length];
    state.selectedLabId = next.id;
    return setPage("simulation");
  }
  if (action === "article") {
    state.selectedArticleId = target.dataset.article;
    return render();
  }
  if (action === "toggle-setting") {
    const setting = target.dataset.setting;
    if (setting === "theme") {
      state.settings.theme = state.settings.theme === "light" ? "dark" : "light";
      document.body.dataset.theme = state.settings.theme;
    } else {
      state.settings[setting] = !state.settings[setting];
    }
    persist();
    return render();
  }
  if (action === "logout") {
    localStorage.removeItem("biocad:user");
    state.user = null;
    toast("Signed out locally.");
    return render();
  }
}

function attemptLabInteraction(itemId, targetId) {
  if (window.LabScene3D?.isAnimating()) return;

  const lab = getLab();
  const game = getGamePlan(lab);
  const entry = getGameEntry(lab);
  const currentStep = entry.currentStep || 0;
  const activeStep = game.steps[currentStep];

  if (!activeStep) return;

  const item = findGameItem(game, itemId);
  const target = findGameTarget(game, targetId);

  if (!itemId) {
    return toast("Select a material first — click it in the 3D lab or materials panel.");
  }

  if (activeStep.item === itemId && activeStep.target === targetId) {
    const runFinalize = () => finalizeLabStep(lab, entry, activeStep, targetId);
    if (window.LabScene3D) {
      window.LabScene3D.playStepAnimation(activeStep, runFinalize);
    } else {
      runFinalize();
    }
  } else {
    entry.mistakes = (entry.mistakes || 0) + 1;
    persist();

    const expectedItem = findGameItem(game, activeStep.item);
    const expectedTarget = findGameTarget(game, activeStep.target);

    if (activeStep.item !== itemId) {
      toast(`Protocol error: Expected ${expectedItem?.label}, but used ${item?.label || "nothing"}.`);
    } else {
      toast(`Protocol error: ${item?.label} should go to ${expectedTarget?.label}.`);
    }
    render();
  }
}

function finalizeLabStep(lab, entry, activeStep, targetId) {
  const currentStep = entry.currentStep || 0;
  const logEntry = {
    title: activeStep.title,
    result: `${activeStep.result} (${state.reagentVolume}µL at ${state.reagentConcentration}%)`,
    observation: activeStep.observation,
    index: currentStep,
    params: { volume: state.reagentVolume, conc: state.reagentConcentration },
  };
  entry.gameLog.push(logEntry);

  const targetNode = document.querySelector(`[data-drop-target="${targetId}"]`);
  if (targetNode) {
    targetNode.classList.add("interaction-flash");
    setTimeout(() => targetNode.classList.remove("interaction-flash"), 1000);
  }

  toast(`Success: ${activeStep.result}`);
  completeCurrentStep(lab, entry);
}

function processLabInteraction(itemId, targetId) {
  attemptLabInteraction(itemId, targetId);
}

function completeCurrentStep(lab, entry) {
  const game = getGamePlan(lab);
  const totalSteps = game.steps.length;
  const current = entry.currentStep || 0;
  if (current >= totalSteps) return toast("All protocol steps are complete.");
  const next = current + 1;
  state.selectedLabItem = null;
  state.progress[lab.id] = {
    ...entry,
    status: next >= totalSteps ? "Completed" : "In Progress",
    currentStep: next,
    minutes: Math.max(entry.minutes || 0, Math.round((next / totalSteps) * lab.duration)),
    completedAt: next >= totalSteps ? new Date().toISOString().slice(0, 10) : entry.completedAt,
    modalSeen: next >= totalSteps ? false : entry.modalSeen,
  };
  persist();
  toast(next >= totalSteps ? "Lab complete. Assessment unlocked." : `Step ${next} recorded in notebook.`);
  render();
}

testimonialTimer = setInterval(() => {
  if (!state.user || state.currentPage !== "home") return;
  state.testimonialIndex = (state.testimonialIndex + 1) % testimonials.length;
  render();
}, 4000);

render();

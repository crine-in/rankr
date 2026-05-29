export interface Exam {
  slug: string;
  name: string;
  maxMarks: number;
  categories: string[];
  genders: string[];
  years: number[];
  description: string;
  seoIntro: string;
  seoFaq: { q: string; a: string }[];
}

export const exams: Exam[] = [
  {
    slug: "jee-main",
    name: "JEE Main",
    maxMarks: 300,
    categories: ["GENERAL", "OBC-NCL", "SC", "ST", "EWS"],
    genders: ["MALE", "FEMALE"],
    years: [2023, 2024, 2025],
    description: "Predict your JEE Main All India Rank (AIR) based on your exam scores, category, and gender using historical statistics and trends.",
    seoIntro: "JEE Main (Joint Entrance Examination) is one of the most competitive engineering entrance exams in India, taken by over a million students annually. Since ranking determines entry into prestigious NITs, IIITs, and CFTIs, understanding the relationship between marks and ranks across general, OBC, EWS, SC, and ST categories is critical.",
    seoFaq: [
      {
        q: "What is a good score in JEE Main to get under 10,000 rank?",
        a: "Generally, a score of 180+ out of 300 is required to get a rank under 10,000. However, this varies depending on the exam difficulty level and year."
      },
      {
        q: "How does category reservation affect JEE Main rank prediction?",
        a: "Reservation shifts the cutoff and category ranking. Rankr predicts your common merit list (CRL) rank, while category status determines the adjusted percentile needed for seat allocation."
      },
      {
        q: "How accurate is the JEE Main rank predictor?",
        a: "Rankr uses linear interpolation based on massive historical datasets from 2023, 2024, and 2025, yielding up to 95%+ confidence when nearby data density is high."
      }
    ]
  },
  {
    slug: "neet",
    name: "NEET",
    maxMarks: 720,
    categories: ["GENERAL", "OBC", "SC", "ST", "EWS"],
    genders: ["MALE", "FEMALE"],
    years: [2023, 2024, 2025],
    description: "Predict your NEET MBBS/BDS All India Rank based on your scores and category using historical datasets.",
    seoIntro: "NEET (National Eligibility cum Entrance Test) is the single gateway exam for admission into all medical courses in India, including MBBS, BDS, and AYUSH. With extremely high competition, even a single-mark difference can shift your rank by thousands. Review marks vs rank trends here to gauge your medical college options.",
    seoFaq: [
      {
        q: "What NEET score is required for a government MBBS seat?",
        a: "For the General category, a NEET score of 610+ is typically needed for a government college MBBS seat through the All India Quota, though state quotas may have lower thresholds."
      },
      {
        q: "Why do NEET marks-to-rank trends shift so much each year?",
        a: "NEET ranks fluctuate heavily based on the overall difficulty of the paper and the performance of top-scoring candidates, which is why historical comparisons are vital."
      }
    ]
  },
  {
    slug: "gate",
    name: "GATE",
    maxMarks: 100,
    categories: ["GENERAL", "OBC", "SC", "ST"],
    genders: ["MALE", "FEMALE"],
    years: [2023, 2024, 2025],
    description: "Predict your GATE score and rank for post-graduate admissions or PSU recruitments using previous years' benchmarks.",
    seoIntro: "GATE (Graduate Aptitude Test in Engineering) is a premium exam assessing comprehensive understanding of engineering and science subjects. Ranks are directly used by premier institutes (IITs/IISc) for M.Tech admissions and by PSUs (ONGC, IOCL, HPCL) for recruitment.",
    seoFaq: [
      {
        q: "What is a good rank in GATE for PSU recruitment?",
        a: "For top public sector undertakings (PSUs), a GATE rank within the top 200–500 in core branches is usually required for General category candidates."
      },
      {
        q: "How does the GATE normalization process work?",
        a: "For multi-session papers, GATE normalizes marks using standard formulas based on the mean and standard deviation of top performers, which this predictor accounts for."
      }
    ]
  },
  {
    slug: "cat",
    name: "CAT",
    maxMarks: 198,
    categories: ["GENERAL", "NC-OBC", "SC", "ST", "EWS"],
    genders: ["MALE", "FEMALE"],
    years: [2023, 2024, 2025],
    description: "Predict your CAT MBA admission rank and percentiles based on actual raw marks across sections.",
    seoIntro: "CAT (Common Admission Test) is the prestigious entrance exam for the Indian Institutes of Management (IIMs) and other leading business schools in India. CAT focuses heavily on percentiles rather than absolute marks, which are determined by the scaled score distribution.",
    seoFaq: [
      {
        q: "What CAT percentile corresponds to a raw score of 100?",
        a: "Usually, a raw score of 95–100 out of 198 yields a 99+ percentile in CAT, putting you in the top tier for IIM calls."
      },
      {
        q: "Does CAT rank determine IIM admissions?",
        a: "Yes, raw marks map to percentiles and ranks, which are then combined with academic profile (10th/12th/Graduation), work experience, and gender diversity points."
      }
    ]
  },
  {
    slug: "wbjee",
    name: "WBJEE",
    maxMarks: 200,
    categories: ["GENERAL", "OBC-A", "OBC-B", "SC", "ST", "TFW"],
    genders: ["MALE", "FEMALE"],
    years: [2022, 2023, 2024, 2025],
    description: "Predict your WBJEE General Merit Rank (GMR) based on your Paper 1 & Paper 2 combined scores, category, and gender using actual historical data.",
    seoIntro: "WBJEE (West Bengal Joint Entrance Examination) is the state-level entrance test for admission to prestigious government and private engineering colleges in West Bengal, including Jadavpur University (JU) and University of Calcutta (CU). WBJEE has a maximum score of 200 marks across Mathematics, Physics, and Chemistry. Explore comprehensive marks vs rank analysis and secure prediction here.",
    seoFaq: [
      {
        q: "What is a good rank in WBJEE for Jadavpur University CSE?",
        a: "Generally, a GMR under 100 is required for Jadavpur University Computer Science & Engineering (CSE) for General category candidates, which typically corresponds to a score of 145+ out of 200 depending on the year's difficulty."
      },
      {
        q: "What is the difference between GMR and PMR in WBJEE?",
        a: "GMR (General Merit Rank) is based on Paper 1 (Mathematics) and Paper 2 (Physics & Chemistry) combined, used for engineering admissions. PMR (Pharmacy Merit Rank) is based solely on Paper 2 and is used for pharmacy admissions."
      },
      {
        q: "How does the negative marking system work in WBJEE?",
        a: "WBJEE has three categories of questions. Category I has -0.25 negative marking, Category II has -0.50 negative marking, and Category III has no negative marking, which makes fractional scores highly accurate."
      }
    ]
  }
];

export function getExamBySlug(slug: string): Exam | undefined {
  return exams.find((e) => e.slug === slug);
}

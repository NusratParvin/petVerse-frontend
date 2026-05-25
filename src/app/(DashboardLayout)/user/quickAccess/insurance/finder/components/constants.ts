// Common pet conditions (from provider data)
export const COMMON_CONDITIONS = [
  "Hip Dysplasia",
  "Cancer",
  "Diabetes",
  "Epilepsy",
  "Heart Disease",
  "Arthritis",
  "Allergies",
  "Skin Conditions",
  "Dental Disease",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Issues",
  "Eye Conditions",
  "Respiratory Issues",
];

//  Question config

export const QUESTIONS = [
  {
    id: "petName",
    label: "What is your pet's name?",
    type: "text",
    placeholder: "e.g. Max",
    icon: "🐾",
  },
  {
    id: "species",
    label: "What type of pet?",
    type: "select",
    icon: "🐶",
    options: [
      { value: "dog", label: "🐶 Dog" },
      { value: "cat", label: "🐱 Cat" },
      { value: "bird", label: "🦜 Bird" },
      { value: "rabbit", label: "🐰 Rabbit" },
      { value: "other", label: "🐾 Other" },
    ],
  },
  {
    id: "breed",
    label: "What breed?",
    type: "text",
    placeholder: "e.g. Golden Retriever",
    icon: "📋",
  },
  {
    id: "ageYears",
    label: "How old is your pet? (years)",
    type: "number",
    placeholder: "e.g. 3",
    icon: "🎂",
  },
  {
    id: "existingConditions",
    label: "Does your pet have any existing health conditions?",
    type: "radio",
    icon: "🏥",
    options: [
      { value: "no", label: "No, healthy" },
      { value: "yes", label: "Yes, has conditions" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "budget",
    label: "What's your monthly budget for insurance?",
    type: "radio",
    icon: "💰",
    options: [
      { value: "low", label: "AED 90–150 (Basic)" },
      { value: "medium", label: "AED 150–250 (Standard)" },
      { value: "high", label: "AED 250+ (Premium)" },
    ],
  },
];

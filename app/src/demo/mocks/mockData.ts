import { IMockData } from "./IMockData";

export const __mock__pageData: IMockData[] = [
  {
    label: "Stage data",
    type: "stage",
    isLane: true,
    data: [
      { type: "stage-btn", label: "Button 1" },
      { type: "stage-btn", label: "Button 2" },
      { type: "stage-btn", label: "Button 3" },
    ],
  },

  {
    label: "CTA",
    type: "cta",
    data: [
      { type: "cta-text", label: "Text 1 Non-focusable item" },
      { type: "cta-text", label: "Text 2 Non-focusable item" },
      { type: "cta-text", label: "Text 3 Non-focusable item" },
    ],
  },

  {
    label: "Lane 1",
    isLane: true,
    data: [{ label: "Box 1" }, { label: "Box 2" }, { label: "Box 3" }],
  },
  {
    label: "Lane 2",
    isLane: true,
    data: [
      { label: "Box 1" },
      { label: "Box 2" },
      { label: "Box 3" },
      { label: "Box 4" },
      { label: "Box 5" },
    ],
  },
];

export const __mock__navData: IMockData[] = [
  {
    isLane: true,
    data: [{ label: "Home" }],
  },
  {
    isLane: true,
    data: [{ label: "Search" }],
  },
  {
    isLane: true,
    data: [{ label: "Settings" }],
  },
  {
    isLane: true,
    data: [{ label: "Profile" }],
  },
  {
    isLane: true,
    data: [{ label: "Logout" }],
  },
];

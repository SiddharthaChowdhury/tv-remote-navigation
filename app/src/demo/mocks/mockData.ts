import { IMockData } from "./IMockData";

export const __mock__pageData: IMockData[] = [
  {
    label: "Stage data",
    isLane: true,
    data: [{ label: "Button 1" }, { label: "Button 2" }, { label: "Button 3" }],
  },

  {
    label: "CTA",
    data: [{ label: "Text 1" }, { label: "Text 2" }, { label: "Text 3" }],
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

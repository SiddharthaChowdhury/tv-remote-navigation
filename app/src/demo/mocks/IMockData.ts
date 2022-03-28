export interface IMockData {
  label?: string;
  type?: string;
  isLane?: boolean;
  data: {
    type?: string;
    label: string;
  }[];
}

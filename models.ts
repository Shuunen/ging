interface Step {
  title: string;
  days: number;
}

interface Group {
  title: string;
  start?: string;
  steps: Step[];
}

interface Data {
  groups: Group[];
}

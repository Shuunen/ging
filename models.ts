interface Step {
  title: string;
}

interface Group {
  title: string;
  start?: string;
  steps: Step[];
}

interface Data {
  groups: Group[];
}

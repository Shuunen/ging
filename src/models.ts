interface Step {
  title: string;
  days?: number;
  hours?: number;
  start?: Date;
  end?: Date;
}

interface Group {
  title: string;
  color?: string;
  steps: Step[];
}

interface Data {
  groups: Group[];
}

declare module 'vuetify'
declare module 'vuetify/lib/components'
declare module 'vuetify/lib/directives'

interface Step {
  title: string;
  days?: number;
  hours?: number;
  start?: Date;
  end?: Date;
}

interface Project {
  title: string;
  color?: string;
  steps: Step[];
}

interface State {
  projects: Project[];
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

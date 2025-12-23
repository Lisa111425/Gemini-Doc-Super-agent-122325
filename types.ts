
export type Language = 'English' | 'Traditional Chinese';
export type ThemeMode = 'light' | 'dark';

export interface ArtistStyle {
  name: string;
  bg: string;
  accent: string;
  text: string;
  font: string;
  grad: string;
}

export interface AppState {
  theme: string;
  language: Language;
  mode: ThemeMode;
  apiKey: string;
  fileContent: string;
  fileSummary: string;
}

export enum TabType {
  FileIntelligence = 'File Intelligence',
  Pipeline = 'Pipeline',
  SmartReplace = 'Smart Replace',
  Dashboard = 'Dashboard'
}

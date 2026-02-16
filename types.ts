export interface Wish {
  id?: number;
  created_at?: string;
  sender_name: string;
  Message: string;
}

export interface AppState {
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;
  playMusic: boolean;
  setPlayMusic: (play: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export enum ScenePhase {
  LOGIN = 'LOGIN',
  EXPERIENCE = 'EXPERIENCE'
}
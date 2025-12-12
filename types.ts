
export enum Language {
  PT = 'PT',
  EN = 'EN',
  ES = 'ES'
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    name: string;
  };
}

export type ViewState = 'HOME' | 'SESSION' | 'TESTIMONIALS' | 'REPORT' | 'SETTINGS' | 'CRISIS' | 'HISTORY' | 'PLANS' | 'SUPPORT' | 'LEGAL' | 'PSYCHOLOGIST_FORM' | 'PAYMENT' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'ORIGIN';

export interface Note {
  id: string;
  title: string;
  items: string[];
  date: Date;
}
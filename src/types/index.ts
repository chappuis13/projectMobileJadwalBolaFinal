// src/types/index.ts

export interface Prediction {
  id: number;
  match_id: string;
  home_score: number;
  away_score: number;
  note: string;
  created_at: string;
}

export interface FavoriteTeam {
  id: number;
  team_id: string;
  team_name: string;
  logo_url: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string; // URL Logo
}

export interface Match {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'TIMED';
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    name: string;
    emblem: string;
  };
}

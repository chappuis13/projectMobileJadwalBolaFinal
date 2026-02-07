// src/services/api.ts

const API_KEY = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Headers standar
const headers = { 'X-Auth-Token': API_KEY || '' };

// 1. Ambil Jadwal (MURNI, TANPA FAKE)
export const fetchMatches = async (date: string) => {
  try {
    // Ambil semua kompetisi agar peluang dapat match lebih besar
    const response = await fetch(`${BASE_URL}/matches?dateFrom=${date}&dateTo=${date}`, { headers });
    const json = await response.json();
    return json.matches || [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

// 2. Ambil Klasemen (FITUR BARU)
export const fetchStandings = async (leagueCode: string) => {
  try {
    // leagueCode contoh: 'PL' (Premier League), 'SA' (Serie A)
    const response = await fetch(`${BASE_URL}/competitions/${leagueCode}/standings`, { headers });
    const json = await response.json();
    
    if (json.standings && json.standings[0]) {
      return json.standings[0].table; // Ambil tabel klasemen utama
    }
    return [];
  } catch (error) {
    console.error(`Error fetching standings for ${leagueCode}:`, error);
    return [];
  }
};

// 3. Ambil Detail Liga (Untuk Info Liga)
export const fetchLeagueInfo = async (leagueCode: string) => {
  try {
    const response = await fetch(`${BASE_URL}/competitions/${leagueCode}`, { headers });
    return await response.json();
  } catch (error) {
    console.error("Error fetching league info:", error);
    return null;
  }
};

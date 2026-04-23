import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
  playedAt?: string;
  isMock?: boolean;
}

export interface Activity {
  id: string;
  type: "commit" | "learning" | "coding" | "deploy" | "break" | "milestone";
  title: string;
  description?: string;
  timestamp: string;
}

export interface GitHubData {
  activities: Activity[];
  contributions: number[];
  totalContributions: number;
  streak: number;
  isMock?: boolean;
}

export interface DashboardData {
  currentProject: {
    name: string;
    description: string;
    status: "coding" | "learning" | "shipping" | "break" | "offline";
    branch: string;
    lastUpdated: string;
    progress: number;
  };
  status: "coding" | "learning" | "shipping" | "break" | "offline";
  visitorStats: {
    total: number;
    today: number;
    trend: number;
  };
  updatedAt: string;
}

export function useSpotifyNowPlaying() {
  const { data, error, isLoading } = useSWR<SpotifyData>(
    "/api/spotify/now-playing",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

export function useGitHubActivity() {
  const { data, error, isLoading } = useSWR<GitHubData>(
    "/api/github/activity",
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

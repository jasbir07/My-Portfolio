import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

type ApiResponse = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  reason?: "premium_required" | "unavailable";
};

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const COMMON_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;

function emptyPayload(): ApiResponse {
  return {
    isPlaying: false,
    title: "",
    artist: "",
    albumImageUrl: "",
    songUrl: "",
    reason: "unavailable",
  };
}

function emptyPayloadWithReason(
  reason: ApiResponse["reason"] = "unavailable"
): ApiResponse {
  return { ...emptyPayload(), reason };
}

function toBasicAuth(clientId: string, clientSecret: string) {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

type SpotifyTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string };
type SpotifyAlbum = { images?: SpotifyImage[] };
type SpotifyExternalUrls = { spotify: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
};

type NowPlayingResponse = { is_playing?: boolean; item?: SpotifyTrack | null };
type RecentlyPlayedResponse = { items?: Array<{ track?: SpotifyTrack }> };

function jsonResponse(payload: ApiResponse, status = 200) {
  return NextResponse.json(payload, { status, headers: COMMON_HEADERS });
}

async function getAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Missing Spotify env vars");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${toBasicAuth(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET
      )}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const json = (await response.json().catch(() => null)) as
    | SpotifyTokenResponse
    | null;

  if (!response.ok || !json?.access_token) {
    const msg =
      json?.error_description || json?.error || `HTTP ${response.status}`;
    throw new Error(`Spotify token refresh failed: ${msg}`);
  }

  return json.access_token;
}

function mapTrack(track: SpotifyTrack, isPlaying: boolean): ApiResponse {
  return {
    isPlaying,
    title: track?.name ?? "",
    artist: Array.isArray(track?.artists)
      ? track.artists.map((a) => a.name).filter(Boolean).join(", ")
      : "",
    albumImageUrl: track?.album?.images?.[0]?.url ?? "",
    songUrl: track?.external_urls?.spotify ?? "",
  };
}

async function getNowPlaying(accessToken: string) {
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
}

async function getRecentlyPlayed(accessToken: string) {
  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
}

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    if (!IS_PRODUCTION) {
      console.warn("Spotify env vars are missing");
    }
    return jsonResponse(emptyPayload(), 500);
  }

  try {
    const accessToken = await getAccessToken();
    const nowResponse = await getNowPlaying(accessToken);

    // If Spotify returns an item (even paused), use it.
    if (nowResponse.status === 200) {
      const nowData = (await nowResponse.json().catch(() => null)) as
        | NowPlayingResponse
        | null;

      if (nowData?.item) {
        return jsonResponse(mapTrack(nowData.item, Boolean(nowData.is_playing)));
      }
    }

    // Nothing currently playing, fall back to last played.
    if (nowResponse.status === 204 || nowResponse.status >= 400 || nowResponse.status === 200) {
      const recentResponse = await getRecentlyPlayed(accessToken);

      if (!recentResponse.ok) {
        const errorBody = await recentResponse.text().catch(() => "");
        const isPremiumRequired =
          recentResponse.status === 403 &&
          errorBody.toLowerCase().includes("active premium subscription required");

        if (!IS_PRODUCTION) {
          console.warn("Spotify recently-played request failed", {
            status: recentResponse.status,
            body: errorBody,
          });
        }
        return jsonResponse(
          emptyPayloadWithReason(
            isPremiumRequired ? "premium_required" : "unavailable"
          )
        );
      }

      const recentData = (await recentResponse.json().catch(() => null)) as
        | RecentlyPlayedResponse
        | null;

      if (!recentData?.items || recentData.items.length === 0) {
        return jsonResponse(emptyPayload());
      }

      const track = recentData.items[0]?.track;
      if (!track) return jsonResponse(emptyPayload());

      return jsonResponse(mapTrack(track, false));
    }

    return jsonResponse(emptyPayload());
  } catch (error) {
    console.error("Spotify API error:", error);
    return jsonResponse(emptyPayload(), 500);
  }
}

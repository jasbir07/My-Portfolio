import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "octocat";

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: Array<{ message: string }>;
    ref?: string;
    ref_type?: string;
    action?: string;
    issue?: { title: string };
    pull_request?: { title: string };
  };
}

function formatEvent(event: GitHubEvent) {
  const repo = event.repo.name.split("/")[1] || event.repo.name;
  const time = new Date(event.created_at);
  const now = new Date();
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timestamp: string;
  if (diffMins < 60) {
    timestamp = `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    timestamp = `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    timestamp = "Yesterday";
  } else {
    timestamp = `${diffDays} days ago`;
  }

  let type: string;
  let title: string;
  let description: string | undefined;

  switch (event.type) {
    case "PushEvent":
      type = "commit";
      title = `Pushed to ${repo}`;
      description = event.payload.commits?.[0]?.message;
      break;
    case "CreateEvent":
      type = "milestone";
      title = `Created ${event.payload.ref_type} in ${repo}`;
      description = event.payload.ref || undefined;
      break;
    case "PullRequestEvent":
      type = "deploy";
      title = `${event.payload.action} PR in ${repo}`;
      description = event.payload.pull_request?.title;
      break;
    case "IssuesEvent":
      type = "coding";
      title = `${event.payload.action} issue in ${repo}`;
      description = event.payload.issue?.title;
      break;
    case "WatchEvent":
      type = "milestone";
      title = `Starred ${repo}`;
      break;
    case "ForkEvent":
      type = "milestone";
      title = `Forked ${repo}`;
      break;
    default:
      type = "coding";
      title = `Activity in ${repo}`;
  }

  return {
    id: event.id,
    type,
    title,
    description,
    timestamp,
  };
}

export async function GET() {
  // If no token is set, return mock data
  if (!GITHUB_TOKEN) {
    return NextResponse.json({
      activities: [
        {
          id: "1",
          type: "commit",
          title: "Pushed code to GitHub",
          description: "feat: add binary tree visualization",
          timestamp: "10 minutes ago",
        },
        {
          id: "2",
          type: "coding",
          title: "Working on DSA Visualizer",
          description: "Implementing tree traversal animations",
          timestamp: "1 hour ago",
        },
        {
          id: "3",
          type: "learning",
          title: "Exploring System Design",
          description: "Reading about distributed systems",
          timestamp: "3 hours ago",
        },
        {
          id: "4",
          type: "deploy",
          title: "Deployed to production",
          description: "Portfolio v2.0 is live!",
          timestamp: "Yesterday",
        },
        {
          id: "5",
          type: "milestone",
          title: "Reached 100 GitHub stars",
          timestamp: "2 days ago",
        },
      ],
      contributions: Array.from({ length: 84 }, () =>
        Math.floor(Math.random() * 10)
      ),
      totalContributions: 847,
      streak: 23,
      isMock: true,
    });
  }

  try {
    // Fetch user events
    const eventsResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!eventsResponse.ok) {
      throw new Error("Failed to fetch GitHub events");
    }

    const events: GitHubEvent[] = await eventsResponse.json();
    const activities = events.slice(0, 5).map(formatEvent);

    // Fetch contribution data (simplified - actual implementation would need GraphQL)
    const contributions = Array.from({ length: 84 }, () =>
      Math.floor(Math.random() * 10)
    );

    return NextResponse.json({
      activities,
      contributions,
      totalContributions: contributions.reduce((a, b) => a + b, 0),
      streak: 23, // Would need to calculate from actual data
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}

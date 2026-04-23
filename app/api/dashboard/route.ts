import { NextResponse } from "next/server";

// This would typically be fetched from a database or CMS
// For now, we'll return mock data that can be easily replaced

export async function GET() {
  const dashboardData = {
    currentProject: {
      name: "DSA Visualizer",
      description:
        "An interactive tool to visualize data structures and algorithms with step-by-step animations.",
      status: "coding" as const,
      branch: "feature/binary-tree",
      lastUpdated: "2 hours ago",
      progress: 68,
    },
    status: "coding" as const, // coding | learning | shipping | break | offline
    visitorStats: {
      total: 12847,
      today: 142,
      trend: 12,
    },
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(dashboardData);
}

// Optional: POST endpoint to update dashboard data (would need authentication)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, you would:
    // 1. Validate the request
    // 2. Check authentication
    // 3. Update the database
    
    return NextResponse.json({
      success: true,
      message: "Dashboard updated",
      data: body,
    });
  } catch (error) {
    console.error("Failed to update dashboard:", error);
    return NextResponse.json(
      { error: "Failed to update dashboard" },
      { status: 500 }
    );
  }
}

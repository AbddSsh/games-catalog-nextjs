import { getGames } from "@/entities/game/api/game.api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const locale = searchParams.get("locale") || "en";
  const category = searchParams.get("category") || undefined;
  const genres = searchParams.get("genres") || undefined;
  const settings = searchParams.get("settings") || undefined;
  const platforms = searchParams.get("platforms") || undefined;
  const features = searchParams.get("features") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
  const elements = searchParams.get("elements") ? parseInt(searchParams.get("elements")!) : undefined;

  try {
    const result = await getGames({
      locale,
      category,
      genres,
      settings,
      platforms,
      features,
      q,
      sort,
      page,
      elements,
    });

    return Response.json(result);
  } catch (error) {
    console.error("API /api/games error:", error);
    return Response.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

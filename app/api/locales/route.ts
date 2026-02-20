import { getLocales } from "@/entities/locale";

export async function GET() {
  const locales = await getLocales();
  return Response.json(locales);
}

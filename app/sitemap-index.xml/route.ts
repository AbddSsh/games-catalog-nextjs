import { NextResponse } from "next/server";
import { ENV } from "@/shared/config";

const baseUrl = ENV.SITE_URL.replace(/\/$/, "");

function buildSitemapIndex(sitemaps: string[]): string {
  const currentDate = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const url of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${url}</loc>`;
    xml += `<lastmod>${currentDate}</lastmod>`;
    xml += "</sitemap>";
  }
  xml += "</sitemapindex>";
  return xml;
}

export async function GET() {
  try {
    const sitemaps = [`${baseUrl}/sitemap.xml`];
    const xml = buildSitemapIndex(sitemaps);
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "text/xml",
        "Content-Length": Buffer.byteLength(xml).toString(),
      },
    });
  } catch (error) {
    console.error("sitemap-index.xml route error:", error);
    return NextResponse.error();
  }
}

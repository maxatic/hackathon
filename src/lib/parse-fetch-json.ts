/** Parse JSON from a fetch Response; throws if the body is not JSON (e.g. HTML error page). */
export async function parseFetchJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    throw new Error(
      `Server returned non-JSON (${res.status}): ${preview}`,
    );
  }
}

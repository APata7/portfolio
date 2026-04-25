import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export default async () => {
  try {
    const dir = join(process.cwd(), "data", "projetos");
    const files = (await readdir(dir)).filter(f => f.endsWith(".json"));
    const entries = await Promise.all(
      files.map(async f => JSON.parse(await readFile(join(dir, f), "utf8")))
    );
    return Response.json(entries, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" }
    });
  } catch (err) {
    return Response.json({ error: "Não foi possível ler projetos", detail: err.message }, { status: 500 });
  }
};

export const config = { path: "/data/projetos" };

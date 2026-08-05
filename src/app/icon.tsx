import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function Icon() {
  const portrait = await readFile(
    join(process.cwd(), "public", "img", "profile.png"),
  );
  const portraitSource = `data:image/png;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={portraitSource} alt="" width={512} height={512} />,
    size,
  );
}

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
    <div
      style={{
        alignItems: "center",
        background: "#080b10",
        border: "18px solid #e8efff",
        borderRadius: "50%",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* The tight crop keeps Matt recognizable at browser-tab size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portraitSource}
        alt=""
        width={560}
        height={560}
        style={{
          height: "110%",
          objectFit: "cover",
          objectPosition: "50% 20%",
          width: "110%",
        }}
      />
    </div>,
    size,
  );
}

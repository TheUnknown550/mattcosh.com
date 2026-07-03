import Link from "next/link";
import { Placeholder } from "@/components/common/Placeholder";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Portfolio (placeholder)</h1>
      <p className="max-w-prose text-gray-600">
        This is a placeholder homepage. Final design, copy, and the 3D hero
        scene will be added in a later pass.
      </p>
      <Link href="/projects" className="underline">
        View projects
      </Link>
      <Placeholder label="Future 3D hero scene will render here (see src/components/three)." />
    </div>
  );
}

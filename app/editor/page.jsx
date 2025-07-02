'use client';
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const JurisdictionSelector = dynamic(
  () => import("@/components/jurisdiction_info_editor/JurisdictionSelector"),
  { ssr: false }
);

export default function JurisdictionSearch() {
  const router = useRouter();

  const navigate = (option) => {
    if (option && option.value) {
      router.push(`/editor/${option.value}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-4 text-lg font-semibold text-gray-700 text-center">
          Update filing information for your jurisdiction
        </div>
        <JurisdictionSelector
          onChange={navigate}
        />
      </div>
    </div>
  );
}

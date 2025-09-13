import Link from 'next/link';

function RecordCard({ text, href, iconSrc }) {
  return (
    <Link
      href={href}
      className="flex items-center bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition group"
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={iconSrc}
          alt=""
          className="w-10 h-10"
        />
      </div>
      <div className="flex-1 ml-6 text-2xl font-medium group-hover:text-blue-600">
        {text}
      </div>
      <img
        src="/icons/ui/navigation_arrow_right.svg"
        className="w-8 h-8 ml-4 mr-4"
      />
    </Link>
  );
}

export default function CommunityRecordsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Community Records</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome to the community records portal.
        </p>
      </div>

      <div className="grid gap-6 w-full max-w-lg">
        <RecordCard
          text="View public records"
          href="/community_records/viewer"
          iconSrc="/icons/community_records/view.svg"
        />
        <RecordCard
          text="File new record"
          href="/community_records/file"
          iconSrc="/icons/community_records/file.svg"
        />
        <RecordCard
          text="Update my record"
          href="/community_records/update"
          iconSrc="/icons/community_records/update.svg"
        />
      </div>
    </div>
  );
}

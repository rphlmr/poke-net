import { useCatch, useParams } from "@remix-run/react";

export default function SoundsPage() {
  const params = useParams();

  // throw new Error("Oh noooooon");

  return (
    <audio controls src={`/assets/pokemon/${params?.pokemonId}.mp3`}>
      Your browser does not support the
      <code>audio</code> element.
    </audio>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="bg-red-500 text-white">
      An unexpected error occurred: {error.message}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Sound not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { useMatchesData } from "~/helpers/use-matches-data";
import type { Pokemon } from "~/models/pokemon.server";

export const handle = {
  isModal: true,
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.registrationId || !params.pokemonId) throw json(null, 404);

  return json({ registrationId: params.registrationId });
};

export default function CatchSuccessPage() {
  const data = useLoaderData();
  const pokemon = useMatchesData(
    `routes/__pokedex-layout/pokedex/$pokemonId`
  ) as Pokemon;

  return (
    <div>
      <div className="flex flex-col items-center rounded-md bg-black px-2 py-6 font-mono text-gray-100">
        <img alt="bravo" src="/assets/pokemon/bravo.gif" className="h-20" />
        <p className="mt-5">
          Ton <span className="text-yellow-300"> {pokemon.name}</span> a bien
          été enregistré
        </p>
        <p className="mt-5">
          Numéro de registre:{" "}
          <span className="text-yellow-300">#{data.registrationId}</span>
        </p>

        <div className="mt-10 flex space-x-10">
          <NavLink to=".." className="rounded-md bg-blue-500 p-2">
            Terminer
          </NavLink>
        </div>
      </div>
    </div>
  );
}

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useMatchesData } from "~/helpers/use-matches-data";
import type { Pokemon } from "~/models/pokemon.server";
import { releasePokemon, getPokemonById } from "~/models/pokemon.server";
import { requireUserId } from "~/session.server";

export const handle = {
  isModal: true,
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  if (!params.pokemonId) throw json(null, 404);

  await releasePokemon(userId, params.pokemonId);

  return json({ success: true });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  if (!params.pokemonId) throw new Response(null, { status: 400 });

  const pokemon = await getPokemonById(userId, params.pokemonId);

  return json(pokemon);
};

export default function ReleasePage() {
  const [redirectIn, setRedirectIn] = useState(5);
  const releasePokemon = useFetcher();
  const navigate = useNavigate();
  const pokemon = useMatchesData(
    `routes/__pokedex-layout/pokedex/$pokemonId`
  ) as Pokemon;

  const isReleaseSuccess = releasePokemon.data?.success;

  const goBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    if (!isReleaseSuccess) return;

    if (redirectIn === 0) {
      goBack();
      return;
    }

    const id = setTimeout(() => setRedirectIn((prev) => prev - 1), 1_000);

    return () => {
      clearTimeout(id);
    };
  }, [goBack, redirectIn, isReleaseSuccess]);

  return (
    <div className="flex w-96 flex-col items-center">
      <div
        className={clsx(`rounded-md p-2`, isReleaseSuccess && "animate-spin")}
      >
        <img
          alt="pokemon"
          src={`/assets/pokemon/${pokemon?.id}.gif`}
          className={`h-40 w-40 object-contain`}
        />
      </div>
      <div className="flex flex-col items-center rounded-md bg-black px-2 py-6 font-mono text-gray-100">
        <h2 className="text-center text-xl font-bold">
          Tu {isReleaseSuccess ? "as relâché" : "vas relâcher"}
          <span className="text-yellow-300"> {pokemon.name}</span>
        </h2>

        <div className="mt-10 flex space-x-10">
          {isReleaseSuccess ? (
            <div className="flex flex-col items-center">
              <img
                alt="snif"
                src="/assets/pokemon/goodby.gif"
                className="h-40"
              />
              <button
                onClick={goBack}
                className="mt-4 rounded-md bg-red-500 p-2"
              >
                Snif ({redirectIn})
              </button>
            </div>
          ) : (
            <>
              <releasePokemon.Form method="post">
                <button className="rounded-md bg-blue-500 p-2">
                  Confirmer
                </button>
              </releasePokemon.Form>
              <button onClick={goBack} className="rounded-md bg-red-500 p-2">
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { MdCatchingPokemon } from "react-icons/md";
import ActionLink from "~/components/action-link";
import NavLink from "~/components/nav-link";
import useMatchLocation from "~/helpers/use-match-location";
import useMatchModalRoute from "~/helpers/use-match-modal-route";
import type { Pokemon } from "~/models/pokemon.server";
import { getPokemonById } from "~/models/pokemon.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  if (!params.pokemonId) throw json(null, 404);

  const pokemon = await getPokemonById(userId, params.pokemonId);

  if (!pokemon) throw json(null, 404);

  return json<Pokemon>(pokemon);
};

export default function PokemonPage() {
  const pokemon = useLoaderData() as Pokemon;
  const index = `/pokedex/${pokemon.id}`;
  const matchLocation = useMatchLocation();
  const isIndexActive = matchLocation(index);
  const isModalRoute = useMatchModalRoute();
  const catchPokemon = useFetcher();
  const isCatchingPokemon =
    ["submitting", "loading"].includes(catchPokemon.state) &&
    catchPokemon.submission?.formData?.get("pokemonId") === pokemon.id;

  return (
    <div className="relative flex flex-col px-20 pt-6">
      <header className="flex">
        <div className="flex-shrink-0 rounded-md bg-blue-200">
          <img
            alt="pokemon"
            src={`/assets/pokemon/${pokemon?.id}.gif`}
            className="h-60 w-60 object-contain p-2"
          />
          <div className="flex text-center font-bold text-white">
            <catchPokemon.Form
              action={`${index}/catch?index`}
              method="post"
              className={clsx(
                "flex-1 p-4",
                pokemon.isCatch || isCatchingPokemon
                  ? "bg-gray-200"
                  : "bg-green-500"
              )}
            >
              <input type="hidden" name="pokemonId" value={pokemon.id} />
              <button disabled={pokemon.isCatch || isCatchingPokemon}>
                {isCatchingPokemon ? (
                  <MdCatchingPokemon
                    className={clsx("animate-pulse text-red-600")}
                  />
                ) : (
                  <span>Capturer</span>
                )}
              </button>
            </catchPokemon.Form>

            <ActionLink to={`${index}/release`} color="red">
              Relâcher
            </ActionLink>
          </div>
        </div>

        <section className="flex w-full flex-col items-center p-2 font-mono">
          <h1 className="text-5xl font-bold">{pokemon?.name}</h1>
          <span>#{pokemon?.id}</span>

          <span className="flex items-center space-x-2">
            <MdCatchingPokemon
              className={clsx(
                pokemon.isCatch || isCatchingPokemon
                  ? "text-red-600"
                  : "text-gray-300",
                isCatchingPokemon && "animate-pulse"
              )}
            />
            <span className={clsx(isCatchingPokemon && "animate-pulse")}>
              {isCatchingPokemon
                ? "Capture en cours ..."
                : pokemon.isCatch
                ? "Capturé"
                : "Non capturé"}
            </span>
          </span>
          <p className="mt-10 text-center">{pokemon?.description}</p>
        </section>
      </header>

      <aside className="mt-10 flex flex-col">
        <nav className="mb-5 space-x-4">
          <NavLink to={index}>Détails</NavLink>
          <NavLink to={`/pokedex/${pokemon.id}/sound`}>Crie</NavLink>
          <NavLink to={`/pokedex/${pokemon.id}/evolutions`}>Evolutions</NavLink>
        </nav>
        {isIndexActive ? (
          <div className="flex w-96 flex-col rounded-md p-2 font-mono ">
            <span>Poids : {pokemon.weight} kg</span>
            <span>Taille : {pokemon.height} m</span>
          </div>
        ) : (
          <div
            className={clsx(
              isModalRoute &&
                "absolute top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black"
            )}
          >
            <Outlet />
          </div>
        )}
      </aside>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Pokemon not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

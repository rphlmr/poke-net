import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import clsx from "clsx";
import { HiChevronRight } from "react-icons/hi";
import useMatchLocation from "~/helpers/use-match-location";
import type { Pokemon } from "~/models/pokemon.server";
import { getPokemonById, getPokemonsByIds } from "~/models/pokemon.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  if (!params.pokemonId) throw json(null, 400);

  const pokemon = await getPokemonById(userId, params.pokemonId);

  if (!pokemon) throw json(null, 404);

  const pokemons = await getPokemonsByIds(pokemon.evolutions.split(","));

  if (!pokemons) throw json(null, 404);

  return json<Pokemon[]>(pokemons);
};

export default function EvolutionsPage() {
  const pokemons = useLoaderData() as Pokemon[];
  const matchLocation = useMatchLocation();

  return (
    <ul className="flex items-center space-x-10 rounded-md bg-white p-2">
      {pokemons.map((pokemon, index) => {
        const isActive = matchLocation(`/pokedex/${pokemon.id}/evolutions`);
        const hasEvolutions = pokemons.length > 1 && index < 2;

        return (
          <li
            key={pokemon.id}
            className="flex items-center space-x-10 font-mono"
          >
            <NavLink
              to={isActive ? `.` : `/pokedex/${pokemon.id}`}
              className={clsx(isActive ? "text-yellow-700" : "text-black")}
            >
              <div className={`flex flex-col items-center`}>
                <div
                  className={`mb-4 flex items-center justify-center rounded-md bg-blue-200 p-2`}
                >
                  <img
                    src={`/assets/pokemon/${pokemon.id}.gif`}
                    alt="pokemon"
                    className="h-20 w-20 object-contain"
                  />
                </div>

                <span>{pokemon.name}</span>
                <span>#{pokemon.id}</span>
              </div>
            </NavLink>
            {hasEvolutions ? (
              <HiChevronRight className="text-blue-500" size={60} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

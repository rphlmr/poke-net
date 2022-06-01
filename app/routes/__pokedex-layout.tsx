import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import { MdCatchingPokemon } from "react-icons/md";
import { getPokemons } from "~/models/pokemon.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  pokemons: Awaited<ReturnType<typeof getPokemons>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return json<LoaderData>({ pokemons: await getPokemons(userId) });
};

export default function PokedexLayout() {
  const data = useLoaderData() as LoaderData;

  const fetchers = useFetchers();

  const catchingPokemonId = fetchers
    .find((fetcher) => fetcher.submission?.action?.includes("catch?index"))
    ?.submission?.formData.get("pokemonId");

  return (
    <main className="flex h-full bg-white">
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="w-150 h-full border-r bg-gray-50">
        <Form action="/logout" method="post" className="flex justify-end p-4">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
        <ol>
          {data.pokemons.map((pokemon) => {
            const isCatching = pokemon.id === catchingPokemonId;
            return (
              <li key={pokemon.id}>
                <NavLink
                  className={({ isActive }) =>
                    `flex flex-row items-center space-x-2 border-b p-4 hover:text-blue-300 ${
                      isActive ? "bg-white" : ""
                    }`
                  }
                  to={`/pokedex/${pokemon.id}`}
                >
                  <MdCatchingPokemon
                    className={clsx(
                      pokemon.isCatch || isCatching
                        ? "text-red-700"
                        : "text-gray-700",
                      isCatching && "animate-pulse"
                    )}
                  />
                  <span className={`text-3xl`}>{pokemon.name}</span>
                  <span className="self-end text-xl text-gray-500">
                    #{pokemon.id}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

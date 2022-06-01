import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { catchPokemon } from "~/models/pokemon.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  if (!params.pokemonId) throw new Response(null, { status: 400 });

  // fake slow api call
  await new Promise((resolve) => setTimeout(resolve, 2_000));

  // // fake error
  // return json({ error: true });

  const registration = await catchPokemon(userId, params.pokemonId);

  return redirect(`/pokedex/${params.pokemonId}/catch/${registration?.id}`);
};

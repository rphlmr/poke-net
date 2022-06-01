import { prisma } from "~/db.server";

import type { Pokemon as PokemonModel } from "@prisma/client";

export type Pokemon = PokemonModel & { isCatch?: boolean };

export async function getPokemonById(userId: string, id: string) {
  const [pokemon, userPokemon] = await Promise.all([
    prisma.pokemon.findUnique({ where: { id } }),
    prisma.usersPokemons.findFirst({
      select: { id: true },
      where: { userId, pokemonId: id },
    }),
  ]);

  if (!pokemon) throw new Error("no found");

  return { ...pokemon, isCatch: Boolean(userPokemon?.id) };
}

export function getPokemonsByIds(ids: string[]) {
  return prisma.pokemon.findMany({ where: { id: { in: ids } } });
}

export async function getPokemons(userId: string) {
  const [pokemons, userPokemons] = await Promise.all([
    prisma.pokemon.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: "asc" },
    }),
    prisma.usersPokemons.findMany({ where: { userId } }),
  ]);

  return pokemons.map((pokemon) => ({
    ...pokemon,
    isCatch: userPokemons.some(
      (userPokemon) => userPokemon.pokemonId === pokemon.id
    ),
  }));
}

export function getUserPokemons(userId: string) {
  return prisma.usersPokemons.findMany({ where: { userId } });
}

export function getCatchId(userId: string, pokemonId: string) {
  return prisma.usersPokemons.findFirst({
    where: { userId, pokemonId },
  });
}

export function catchPokemon(userId: string, pokemonId: string) {
  return prisma.usersPokemons
    .create({
      data: {
        userId,
        pokemonId,
      },
    })
    .catch(() => getCatchId(userId, pokemonId));
}

export function releasePokemon(userId: string, pokemonId: string) {
  return prisma.usersPokemons.deleteMany({ where: { userId, pokemonId } });
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pokemons = [
  {
    id: "001",
    name: "Bulbizarre",
    description:
      "Il y a une graine sur son dos depuis sa naissance. Elle grossit un peu chaque jour",
    details: {
      height: 0.7,
      weight: 6.9,
    },
    evolutions: ["001", "002", "003"],
  },
  {
    id: "002",
    name: "Herbizarre",
    description:
      "Son bulbe dorsal est devenu si gros qu'il ne peut plus se tenir sur ses pattes postérieures",
    details: {
      height: 1,
      weight: 13,
    },
    evolutions: ["001", "002", "003"],
  },
  {
    id: "003",
    name: "Florizarre",
    description:
      "Sa plante donne une grosse fleur quand elle absorbe les rayons du soleil. Il est toujours à la recherche des endroits les plus ensoleillés",
    details: {
      height: 2,
      weight: 100,
    },
    evolutions: ["001", "002", "003"],
  },
  {
    id: "004",
    name: "Salamèche",
    description:
      "Il préfère ce qui est chaud. En cas de pluie, de la vapeur se forme autour de sa queue",
    details: {
      height: 0.6,
      weight: 8.5,
    },
    evolutions: ["004", "005", "006"],
  },
  {
    id: "005",
    name: "Reptincel",
    description:
      "Il est très brutal. En combat, il se sert de ses griffes acérées et de sa queue enflammée pour mettre en pièces ses adversaires",
    details: {
      height: 1.1,
      weight: 19,
    },
    evolutions: ["004", "005", "006"],
  },
  {
    id: "006",
    name: "Dracaufeu",
    description:
      "Son souffle brûlant peut faire fondre la roche. Il est parfois la cause d'incendies de forêt",
    details: {
      height: 1.7,
      weight: 90.5,
    },
    evolutions: ["004", "005", "006"],
  },
  {
    id: "007",
    name: "Carapuce",
    description:
      "Quand il rentre son cou dans sa carapace, il peut projeter de l'eau à haute pression",
    details: {
      height: 0.5,
      weight: 9,
    },
    evolutions: ["007", "008", "009"],
  },
  {
    id: "008",
    name: "Carabaffe",
    description:
      "Il est considéré comme un symbole de longévité. On reconnaît les spécimens les plus âgés à la mousse qui pousse sur leur carapace",
    details: {
      height: 1,
      weight: 22.5,
    },
    evolutions: ["007", "008", "009"],
  },
  {
    id: "009",
    name: "Tortank",
    description:
      "Il écrase ses adversaires de tout son poids pour leur faire perdre connaissance. Il rentre dans sa carapace s'il se sent en danger",
    details: {
      height: 1.6,
      weight: 85.5,
    },
    evolutions: ["007", "008", "009"],
  },
  {
    id: "010",
    name: "Chenipan",
    description:
      "Pour se protéger, il émet par ses antennes une odeur nauséabonde qui fait fuir ses ennemis",
    details: {
      height: 0.3,
      weight: 2.9,
    },
    evolutions: ["010", "011", "012"],
  },
  {
    id: "011",
    name: "Chrysacier",
    description:
      "En attendant sa prochaine évolution, il ne peut que durcir sa carapace et rester immobile pour éviter de se faire attaquer",
    details: {
      height: 0.7,
      weight: 9.9,
    },
    evolutions: ["010", "011", "012"],
  },
  {
    id: "012",
    name: "Papilusion",
    description:
      "En combat, il bat des ailes très rapidement pour projeter de la poudre toxique sur ses ennemis",
    details: {
      height: 1.1,
      weight: 32,
    },
    evolutions: ["010", "011", "012"],
  },
];

const prisma = new PrismaClient();

async function seed() {
  const email = "sacha.ketchum@pkmn.com";
  const id = "sacha.ketchum";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("pikapika", 10);

  await prisma.user.create({
    data: {
      email,
      id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await Promise.all(
    pokemons.map((pokemon) =>
      prisma.pokemon.create({
        data: {
          id: pokemon.id,
          name: pokemon.name,
          description: pokemon.description,
          height: pokemon.details.height,
          weight: pokemon.details.weight,
          evolutions: String(pokemon.evolutions),
        },
      })
    )
  );

  await prisma.usersPokemons.create({
    data: {
      pokemonId: "004",
      userId: id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

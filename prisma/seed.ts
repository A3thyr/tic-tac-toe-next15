import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      login: "user1",
      passwordHash: "sfjsdkfgji3234i12lerakdlas",
      rating: 1221,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      login: "user2",
      passwordHash: "sfjsdkfgji3234asfafdfsdsdi12lerakdlas",
      rating: 1337,
    },
  });
  // await prisma.game.create({
  //   data: {
  //     field: Array(9).fill(null),
  //     status: "idle",
  //     players: {
  //       connect: {
  //         id: user1.id,
  //       },
  //     },
  //   },
  // });
  // await prisma.game.create({
  //   data: {
  //     field: Array(9).fill(null),
  //     status: "idle",
  //     players: {
  //       connect: {
  //         id: user2.id,
  //       },
  //     },
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

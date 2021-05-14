const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUsers = async () => {
  const john = await prisma.user.upsert({
    where: { email: "john.deo@gmail.com" },
    update: {
      updatedAt: new Date(),
    },
    create: {
      email: `john.deo@gmail.com`,
      name: "John",
      skill: "Frontend Developer",
      timezone: "+01:00",
    },
  });

  const bruce = await prisma.user.upsert({
    where: { email: "bruce.lee@gmail.com" },
    update: {
      updatedAt: new Date(),
    },
    create: {
      email: `bruce.lee@gmail.com"`,
      name: "Bruce",
      skill: "Backend Developer",
      timezone: "+02:00",
    },
  });

  const dan = await prisma.user.upsert({
    where: { email: "dan.abramov@gmail.com" },
    update: {
      updatedAt: new Date(),
    },
    create: {
      email: `dan.abramov@gmail.com`,
      name: "Dan",
      skill: "Android Developer",
      timezone: "+01:00",
    },
  });

  return [john, bruce, dan];
};

const createFilters = async () => {
  const john = await prisma.user.findUnique({
    where: { email: "john.deo@gmail.com" },
    include: {
      filter: true,
    },
  });

  if (!john.filter) {
    await prisma.filter.create({
      data: {
        user: {
          connect: {
            id: john.id,
          },
        },
        skill: "UI Developer",
        timezone: "+02:00",
      },
    });
  }
};

const createConversation = async (users) => {
  await prisma.conversation.create({
    data: {
      users: {
        create: [
          {
            user: {
              connect: {
                id: users[0].id,
              },
            },
          },
          {
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        ],
      },
      messages: {
        create: [
          {
            content: "Hi how are you?",
            user: {
              connect: {
                id: users[0].id,
              },
            },
          },
          {
            content: "Im fine thanks!",
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        ],
      },
    },
  });
};

async function main() {
  const [john, bruce] = await createUsers();
  await createFilters();
  await createConversation([john, bruce]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

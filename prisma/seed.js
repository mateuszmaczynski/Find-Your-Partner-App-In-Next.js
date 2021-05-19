const { PrismaClient } = require("@prisma/client");
const fetch = require("node-fetch");
const prisma = new PrismaClient();

const initialSkills = [
  "Front-end Developer",
  "Back-end Developer",
  "Mobile Developer",
  "Data Scientist",
  "UI Designer",
  "UX Designer",
  "Tester",
  "Fullstack Developer",
  "Scrum Master",
  "Project Manager",
  "Product Owner",
  "Business Analyst",
  "Cyber Security Engineer",
  "Game Developer",
  "DevOps Developer",
  "Web Developer",
  "Big Data Developer",
];

const initialTimezones = [
  "GMT",
  "GMT+1:00",
  "GMT+2:00",
  "GMT+3:00",
  "GMT+4:00",
  "GMT+5:00",
  "GMT+6:00",
  "GMT+7:00",
  "GMT+8:00",
  "GMT+9:00",
  "GMT+10:00",
  "GMT+11:00",
  "GMT+12:00",
  "GMT-11:00",
  "GMT-10:00",
  "GMT-9:00",
  "GMT-8:00",
  "GMT-7:00",
  "GMT-6:00",
  "GMT-5:00",
  "GMT-4:00",
  "GMT-3:00",
  "GMT-2:00",
  "GMT-1:00",
];

const randomSkill = () =>
  initialSkills[Math.floor(Math.random() * initialSkills.length)];

const randomTimezone = () =>
  initialTimezones[Math.floor(Math.random() * initialTimezones.length)];

const createSkills = async () => {
  await prisma.skill.createMany({
    data: initialSkills.map((name) => ({ name })),
  });
};

const createTimezones = async () => {
  await prisma.timezone.createMany({
    data: initialTimezones.map((name) => ({ name })),
  });
};

const createUsers = async () => {
  const randomUsersResponse = await fetch(
    "https://randomuser.me/api/?results=50"
  );
  const randomUsers = await randomUsersResponse.json();

  await prisma.user.createMany({
    data: randomUsers.results.map((user) => ({
      email: user.email,
      name: `${user.name.first} ${user.name.last}`,
      emailVerified: new Date(),
      image: user.picture.large,
      skill: randomSkill(),
      timezone: randomTimezone(),
    })),
  });
};

// const createUsers = async () => {
//   const john = await prisma.user.upsert({
//     where: { email: "john.deo@gmail.com" },
//     update: {
//       updatedAt: new Date(),
//     },
//     create: {
//       email: `john.deo@gmail.com`,
//       name: "John",
//       skill: "Frontend Developer",
//       timezone: "+01:00",
//     },
//   });
//
//   const bruce = await prisma.user.upsert({
//     where: { email: "bruce.lee@gmail.com" },
//     update: {
//       updatedAt: new Date(),
//     },
//     create: {
//       email: `bruce.lee@gmail.com"`,
//       name: "Bruce",
//       skill: "Backend Developer",
//       timezone: "+02:00",
//     },
//   });
//
//   const dan = await prisma.user.upsert({
//     where: { email: "dan.abramov@gmail.com" },
//     update: {
//       updatedAt: new Date(),
//     },
//     create: {
//       email: `dan.abramov@gmail.com`,
//       name: "Dan",
//       skill: "Android Developer",
//       timezone: "+01:00",
//     },
//   });
//
//   return [john, bruce, dan];
// };
//

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

// async function main() {
//   const [john, bruce] = await createUsers();
//   await createFilters();
//   await createConversation([john, bruce]);
// }

async function main() {
  await createSkills();
  await createTimezones();
  await createUsers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

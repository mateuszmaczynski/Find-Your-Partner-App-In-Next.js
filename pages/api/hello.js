import { user } from "models";

export default async (req, res) => {

  // const allUsers = await user.findMany({
  //   select: {
  //     id: true,
  //     createdAt: true,
  //     name: true,
  //     email: true
  //   },
  // });

  await user.create({
    data: {
      email: 'jannowak@wp.pl',
      name: 'Jan Nowak',
      image: 'test.jpg'
    }
  });

  // await user.update({
  //   where: {
  //     id: 2
  //   },
  //   data: {
  //     name: 'Piotr'
  //   }
  // });

  // await user.delete({
  //   where: {
  //     id: 2
  //   }
  // });

  const allUsers = await user.findMany();

  res.statusCode = 200;
  res.json(allUsers);
};

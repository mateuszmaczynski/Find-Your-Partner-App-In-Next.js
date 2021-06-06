import { conversation } from 'models';

export const get = ({ id, userId }) =>
  conversation.findFirst({
    where: {
      id,
      users: {
        some: {
          userId
        }
      }
    },
    include: {
      users: {
        include: {
          user: true
        }
      },
      messages: {
        include: {
          user: true
        }
      }
    }
  });

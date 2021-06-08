import onlyAuth from 'middlewares/onlyAuth';
import { getAll } from 'services/conversations/getAll';

const conversationApi = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const conversations = await getAll({ userId: req.currentUser.id });

        res.status(200).json({ conversations });
      } catch (error) {
        res.status(422).json({ conversations: [], error });
      }
      break;
    }

    default:
      res.status(400);
  }
};

export default onlyAuth(conversationApi);

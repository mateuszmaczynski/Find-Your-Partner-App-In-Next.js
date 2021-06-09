import { useRef } from 'react';
import BaseLayout from 'components/BaseLayout';
import { Message, MyMessage } from 'components/Message';
import { get } from 'services/conversations/get';
import apiRoutes from 'utils/apiRoutes';
import { user } from 'models';
import { getSession } from 'next-auth/client';
import useSWR, { mutate } from 'swr';

export const getServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      notFound: true
    };
  }

  const currentUser = await user.findUnique({
    where: {
      email: session.user.email
    }
  });

  const conversation = await get({ id: Number(params.id), userId: currentUser.id });

  if (!conversation) {
    return {
      notFound: true
    };
  }

  return {
    props: { initConversation: conversation, currentUser }
  };
};

const MessageForm = ({ conversationId }) => {
  const msgRef = useRef();

  const handleSubmit = async () => {
    await apiRoutes.conversations.message.create(conversationId, { content: msgRef.current.value });
    msgRef.current.value = '';
    mutate(`/api/conversations/${conversationId}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <form className="py-5">
      <input
        onKeyDown={handleKey}
        ref={msgRef}
        className="w-full bg-gray-300 py-5 px-3 rounded-xl"
        type="text"
        placeholder="type your message here..."
      />
    </form>
  );
};

export default function Connections({ initConversation, currentUser }) {
  const {
    data: { conversation }
  } = useSWR(`/api/conversations/${initConversation.id}`, apiRoutes.fetcher, {
    initialData: { conversation: initConversation }
  });

  return (
    <BaseLayout>
      <div className="w-full px-5 flex flex-col justify-between bg-gree">
        <div className="flex flex-col mt-5">
          {conversation.messages.map((message) => {
            if (message.user.id === currentUser.id) {
              return <MyMessage key={message.id} message={message} />;
            }
            return <Message key={message.id} message={message} />;
          })}
        </div>
        <MessageForm conversationId={initConversation.id} />
      </div>
    </BaseLayout>
  );
}

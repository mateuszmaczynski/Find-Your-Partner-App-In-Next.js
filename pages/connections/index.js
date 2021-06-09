import BaseLayout from 'components/BaseLayout';
import { getAll } from 'services/conversations/getAll';
import { user } from 'models';
import { getSession } from 'next-auth/client';
import Link from 'next/link';

export const getServerSideProps = async ({ req }) => {
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

  const conversations = await getAll({ userId: currentUser.id });
  return {
    props: { conversations }
  };
};

export default function Connections({ conversations }) {
  return (
    <BaseLayout>
      <div className="border-t-2">
        {conversations.map((item) => {
          return (
            <Link key={`conversation-${item.id}`} href={`/connections/${item.id}`}>
              <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                <div className="w-1/4">
                  {item.users.map(({ user }) => (
                    <img
                      key={user.id}
                      src={user.image}
                      className="inline-block m-0.5 object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  ))}
                </div>
                <div className="w-full">
                  <div className="text-lg font-semibold">
                    {item.messages[item.messages.length - 1].user.name}
                  </div>
                  <span className="text-gray-500">
                    {item.messages[item.messages.length - 1].content}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </BaseLayout>
  );
}

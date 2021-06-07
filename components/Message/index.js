export const Message = ({ message }) => {
  return (
    <div className="flex justify-start mb-4">
      <img src={message.user.image} className="object-cover h-8 w-8 rounded-full" alt="" />
      <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
        {message.content}
      </div>
    </div>
  );
};

export const MyMessage = ({ message }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
        {message.content}
      </div>
      <img src={message.user.image} className="object-cover h-8 w-8 rounded-full" alt="" />
    </div>
  );
};

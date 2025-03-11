const getChatDatatApi = async (chatId) => {
  const url = process.env.url;


  let result = await fetch(`${url}/public/chat_agent/get_conversation/${chatId}`);

  result = await result.json();

  return result;
};

export { getChatDatatApi };

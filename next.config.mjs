/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    url: "https://api.zoft.ai",
    // url: "https://a4f4-106-219-178-192.ngrok-free.app",
    chat_url: "https://chat.zoft.ai",
    //chat_url:'https://aa9a-106-219-179-151.ngrok-free.app',
    boturl: "https://chat-embed.zoft.ai/",
    phone_url: "https://media.zoft.ai",
  },
};

export default nextConfig;

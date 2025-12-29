import { ProxyAgent, setGlobalDispatcher } from "undici";

// 设置全局代理 - 从环境变量读取
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

if (proxyUrl) {
  console.log(`[Proxy] Using proxy: ${proxyUrl}`);
  const dispatcher = new ProxyAgent(proxyUrl);
  setGlobalDispatcher(dispatcher);
} else {
  console.log("[Proxy] No proxy configured. Set HTTPS_PROXY or HTTP_PROXY environment variable if needed.");
}


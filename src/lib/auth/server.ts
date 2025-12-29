import "@/lib/proxy"; // 初始化代理配置
import { db } from "@/db";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { restrictedUsernames } from "./usernames";

// 生成随机用户名的辅助函数
function generateRandomUsername(): string {
  const adjectives = ['happy', 'lucky', 'sunny', 'cool', 'swift', 'brave', 'calm', 'kind'];
  const nouns = ['cat', 'dog', 'bird', 'star', 'moon', 'sun', 'wolf', 'bear'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [username({
    minUsernameLength: 4,
      maxUsernameLength: 20,
      usernameValidator: (value) => !restrictedUsernames.includes(value),
      usernameNormalization: (value) => value.toLowerCase(),
  })],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // 如果用户没有 username（社交登录），自动生成一个
          let updatedUser = { ...user };
          
          if (!updatedUser.username) {
            const generatedUsername = generateRandomUsername();
            updatedUser.username = generatedUsername;
            updatedUser.displayUsername = generatedUsername;
          }
          
          // 如果用户没有 gender（社交登录），设置默认值为 false
          if (updatedUser.gender === undefined || updatedUser.gender === null) {
            updatedUser.gender = false;
          }
          
          return {
            data: updatedUser,
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
      gender: {
        type: "boolean",
        required: false,
        input: true,
      },
    },
  },
});

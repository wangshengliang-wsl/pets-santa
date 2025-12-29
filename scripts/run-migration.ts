import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

// 加载环境变量
config({ path: ".env.local" });
config({ path: ".env" });

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = postgres(databaseUrl);

  try {
    console.log("Running billing tables migration...");
    
    // 创建 payment 表
    await sql`
      CREATE TABLE IF NOT EXISTS "payment" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "stripe_session_id" text,
        "stripe_payment_intent_id" text,
        "amount" integer NOT NULL,
        "currency" text DEFAULT 'usd' NOT NULL,
        "status" text NOT NULL,
        "credits_granted" integer DEFAULT 0 NOT NULL,
        "description" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "payment_stripe_session_id_unique" UNIQUE("stripe_session_id")
      )
    `;
    console.log("✓ Created payment table");

    // 创建 credit_balance 表
    await sql`
      CREATE TABLE IF NOT EXISTS "credit_balance" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "balance" integer DEFAULT 0 NOT NULL,
        "total_earned" integer DEFAULT 0 NOT NULL,
        "total_spent" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "credit_balance_user_id_unique" UNIQUE("user_id")
      )
    `;
    console.log("✓ Created credit_balance table");

    // 创建 credit_transaction 表
    await sql`
      CREATE TABLE IF NOT EXISTS "credit_transaction" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "amount" integer NOT NULL,
        "balance_after" integer NOT NULL,
        "description" text,
        "reference_id" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log("✓ Created credit_transaction table");

    // 添加外键约束（如果不存在）
    try {
      await sql`
        ALTER TABLE "payment" 
        ADD CONSTRAINT "payment_user_id_user_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") 
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("✓ Added payment foreign key");
    } catch (e: any) {
      if (e.code === "42710") {
        console.log("✓ Payment foreign key already exists");
      } else {
        throw e;
      }
    }

    try {
      await sql`
        ALTER TABLE "credit_balance" 
        ADD CONSTRAINT "credit_balance_user_id_user_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") 
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("✓ Added credit_balance foreign key");
    } catch (e: any) {
      if (e.code === "42710") {
        console.log("✓ Credit_balance foreign key already exists");
      } else {
        throw e;
      }
    }

    try {
      await sql`
        ALTER TABLE "credit_transaction" 
        ADD CONSTRAINT "credit_transaction_user_id_user_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") 
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("✓ Added credit_transaction foreign key");
    } catch (e: any) {
      if (e.code === "42710") {
        console.log("✓ Credit_transaction foreign key already exists");
      } else {
        throw e;
      }
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();


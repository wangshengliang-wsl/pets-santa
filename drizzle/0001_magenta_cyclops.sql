CREATE TABLE "generation_task" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kie_task_id" text,
	"status" text NOT NULL,
	"style" text NOT NULL,
	"prompt" text NOT NULL,
	"original_image_url" text NOT NULL,
	"result_image_url" text,
	"kie_result_url" text,
	"credits_used" integer DEFAULT 20 NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "generation_task" ADD CONSTRAINT "generation_task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
CREATE TYPE "public"."user_role" AS ENUM('user', 'support', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "author" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60),
	"genre" varchar(45),
	"isVerify" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authorFile" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorId" integer NOT NULL,
	"fileId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file" (
	"id" serial PRIMARY KEY NOT NULL,
	"extension" varchar(10),
	"realFileName" varchar(60),
	"src" varchar(120),
	"uniqueName" varchar(145),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"roomName" varchar(64) NOT NULL,
	"senderId" varchar(150) NOT NULL,
	"senderUserId" integer,
	"message" text,
	"isDelete" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messageStatus" (
	"messageId" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "messageStatus_messageId_status_pk" PRIMARY KEY("messageId","status")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"productTitle" varchar(140),
	"genre" varchar(45),
	"isVerify" boolean DEFAULT false NOT NULL,
	"pages" integer,
	"publishedYear" smallint,
	"description" text,
	"authorsSeparator" varchar(8) DEFAULT ',' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productAuthor" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"authorId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productFile" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"fileId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productRating" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"productId" integer NOT NULL,
	"rating" smallint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productStatus" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"productId" integer NOT NULL,
	"statusId" integer NOT NULL,
	"isDelete" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"year" integer NOT NULL,
	"readingGoal" integer DEFAULT 12 NOT NULL,
	"displayName" varchar(60),
	"avatarFileId" integer,
	"notifyByEmail" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"connectId" varchar(50),
	"userId" integer,
	"connectedAt" varchar,
	"disconnectedAt" varchar,
	CONSTRAINT "session_connectId_unique" UNIQUE("connectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "state" (
	"id" serial PRIMARY KEY NOT NULL,
	"stateName" varchar(80) NOT NULL,
	"symbol" varchar(60),
	CONSTRAINT "state_stateName_unique" UNIQUE("stateName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(80) NOT NULL,
	"password" varchar(60),
	"isVerify" boolean DEFAULT false NOT NULL,
	"isDelete" boolean DEFAULT false NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authorFile" ADD CONSTRAINT "authorFile_authorId_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authorFile" ADD CONSTRAINT "authorFile_fileId_file_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_senderUserId_user_id_fk" FOREIGN KEY ("senderUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messageStatus" ADD CONSTRAINT "messageStatus_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productAuthor" ADD CONSTRAINT "productAuthor_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productAuthor" ADD CONSTRAINT "productAuthor_authorId_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productFile" ADD CONSTRAINT "productFile_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productFile" ADD CONSTRAINT "productFile_fileId_file_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productRating" ADD CONSTRAINT "productRating_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productRating" ADD CONSTRAINT "productRating_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatus" ADD CONSTRAINT "productStatus_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatus" ADD CONSTRAINT "productStatus_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatus" ADD CONSTRAINT "productStatus_statusId_state_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_avatarFileId_file_id_fk" FOREIGN KEY ("avatarFileId") REFERENCES "public"."file"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "authorFile_authorId_fileId" ON "authorFile" USING btree ("authorId","fileId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "productTitle" ON "product" USING btree (lower("productTitle"));--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "productAuthor_productId_authorId" ON "productAuthor" USING btree ("productId","authorId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "productFile_productId_fileId" ON "productFile" USING btree ("productId","fileId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "productRating_user_product" ON "productRating" USING btree ("userId","productId");
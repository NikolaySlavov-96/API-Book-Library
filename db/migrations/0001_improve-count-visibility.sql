CREATE TABLE IF NOT EXISTS "productStatusHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"productId" integer NOT NULL,
	"statusId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatusHistory" ADD CONSTRAINT "productStatusHistory_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatusHistory" ADD CONSTRAINT "productStatusHistory_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productStatusHistory" ADD CONSTRAINT "productStatusHistory_statusId_state_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "productStatusHistory_user_product_idx" ON "productStatusHistory" USING btree ("userId","productId");
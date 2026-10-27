CREATE TABLE `chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL,
	`action` text,
	`created_at` text NOT NULL,
	`reported_at` text
);

import { InferSelectModel } from 'drizzle-orm';
import { entries } from '@/db/schema';

export type Entry = InferSelectModel<typeof entries>;


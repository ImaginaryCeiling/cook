import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { EntryCard } from "@/components/entry-card";
import { AddEntryButton } from "@/components/add-entry-button";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(desc(entries.createdAt));

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-tight">Kitchen Timeline</h1>
      </header>
      
      <div className="mx-auto max-w-md px-4 py-6">
        {allEntries.length === 0 ? (
          <div className="mt-20 text-center text-muted-foreground">
            <p>No memories yet.</p>
            <p className="text-sm">Tap + to add your first dish.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {allEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      <AddEntryButton />
    </main>
  );
}

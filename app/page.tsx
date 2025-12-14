import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { EntryCard } from "@/components/entry-card";
import { AddEntryButton } from "@/components/add-entry-button";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let allEntries: typeof entries.$inferSelect[] = [];
  
  try {
    allEntries = await db
      .select()
      .from(entries)
      .orderBy(desc(entries.createdAt));
  } catch (error: any) {
    if (error.message?.includes("missing_connection_string") || error.code === "missing_connection_string") {
      return (
        <main className="min-h-screen bg-background p-8 flex flex-col items-center justify-center gap-6 text-center">
           <div className="flex flex-col items-center gap-2">
             <h1 className="text-2xl font-bold tracking-tight">Database Not Connected</h1>
             <p className="text-muted-foreground max-w-md">
               This app requires a Vercel Postgres connection to work.
             </p>
           </div>
           
           <div className="w-full max-w-md space-y-4 rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
             <h2 className="font-semibold">How to fix (Local Dev)</h2>
             <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground text-left">
               <li>Create a new project on Vercel</li>
               <li>Add Vercel Postgres & Blob storage</li>
               <li>Run the following commands:</li>
             </ol>
             <div className="rounded-md bg-zinc-950 p-4 text-xs font-mono text-zinc-50 text-left overflow-x-auto">
               <code>
                 npx vercel link<br />
                 npx vercel env pull .env.local
               </code>
             </div>
           </div>
        </main>
      );
    }
    throw error;
  }

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

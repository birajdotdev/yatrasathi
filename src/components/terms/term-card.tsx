import { ChevronRight } from "lucide-react";

import { type Term } from "@/const/terms";

interface TermCardProps {
  term: Term;
  index: number;
}

export default function TermCard({ term }: TermCardProps) {
  return (
    <div className="group rounded-xl border border-border/40 bg-card/30 p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:bg-card/50 hover:shadow-md dark:border-border/40 dark:bg-background/30 dark:hover:border-primary/50 dark:hover:bg-background/50">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary/10 group-hover:ring-primary/20 dark:bg-primary/10 dark:ring-primary/20 dark:group-hover:bg-primary/20 dark:group-hover:ring-primary/30">
          <ChevronRight className="h-6 w-6" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {term.title}
          </h3>
          <div className="text-base text-muted-foreground">
            <p className="leading-relaxed">{term.content}</p>
            {term.list && (
              <ul className="mt-4 grid gap-2">
                {term.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 dark:bg-primary/70" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

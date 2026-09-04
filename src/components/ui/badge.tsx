import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
        available: "bg-primary/10 text-primary",
        occupied: "bg-ink/10 text-ink",
        cleaning: "bg-clay/15 text-clay",
        maintenance: "bg-destructive/10 text-destructive",
        confirmed: "bg-primary/10 text-primary",
        checked_in: "bg-ink/10 text-ink",
        checked_out: "bg-muted text-muted-foreground",
        cancelled: "bg-muted text-muted-foreground line-through",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };

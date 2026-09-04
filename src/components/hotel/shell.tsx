import { Link } from "@tanstack/react-router";
import {
  BedDouble, BookOpen, CalendarDays, ChartNoAxesCombined, ClipboardList,
  DoorOpen, LayoutDashboard, Layers3, Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const staff: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/phong", label: "Phòng", icon: BedDouble },
  { to: "/hang-phong", label: "Hạng phòng", icon: Layers3 },
  { to: "/don", label: "Đơn đặt", icon: ClipboardList },
  { to: "/lich", label: "Lịch phòng", icon: CalendarDays },
  { to: "/bao-cao", label: "Báo cáo", icon: ChartNoAxesCombined },
];

const extra = [
  { to: "/dat-phong", label: "Cổng khách", icon: DoorOpen },
  { to: "/thiet-ke", label: "Thiết kế PM", icon: BookOpen },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <path d="M4 20V8.5L12 4l8 4.5V20h-3.2V10.6L12 7.4l-4.8 3.2V20H4z" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight">An Viên</span>
        <span className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">Quản lý đặt phòng</span>
      </span>
    </Link>
  );
}

function NavLink({ to, label, icon: Icon, exact, onClick }: {
  to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      onClick={onClick}
      className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
      activeProps={{
        className: "flex h-11 items-center gap-3 rounded-lg px-3 text-sm bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
      }}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function NavGroups({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">Vận hành</p>
        {staff.map((item) => <NavLink key={item.to} {...item} onClick={onClick} />)}
      </div>
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">Khác</p>
        {extra.map((item) => <NavLink key={item.to} {...item} onClick={onClick} />)}
      </div>
    </nav>
  );
}

export function Shell({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-card/80 px-4 py-5 md:flex md:flex-col">
        <Wordmark />
        <div className="mt-8 flex flex-1 flex-col"><NavGroups /></div>
        <p className="px-3 text-xs text-muted-foreground">Khách sạn boutique · Hội An</p>
      </aside>
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm md:h-16 md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Mở menu">
            <Menu className="size-5" />
          </Button>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <h1 className="truncate font-display text-xl font-medium tracking-tight md:text-2xl">{title}</h1>
            {action}
          </div>
        </header>
        <div className="px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-10">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card md:hidden">
        {staff.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={item.exact ? { exact: true } : undefined}
            className="flex h-14 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground"
            activeProps={{ className: "flex h-14 flex-col items-center justify-center gap-0.5 text-xs text-primary" }}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-5">
          <SheetHeader>
            <SheetTitle className="sr-only">Điều hướng</SheetTitle>
            <Wordmark />
          </SheetHeader>
          <div className="mt-6"><NavGroups onClick={() => setOpen(false)} /></div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function GuestChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-sm md:px-8">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/hang-phong">Hạng phòng</Link>
          </Button>
          <Button asChild><Link to="/">Lễ tân</Link></Button>
        </div>
      </header>
      {children}
    </div>
  );
}

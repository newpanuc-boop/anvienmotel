import { vi } from "react-day-picker/locale";
import { DayPicker, type DateRange, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      locale={vi}
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium font-display",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 size-8 rounded-md hover:bg-accent inline-flex items-center justify-center",
        button_next: "absolute right-1 size-8 rounded-md hover:bg-accent inline-flex items-center justify-center",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-xs text-center",
        week: "flex w-full mt-1",
        day: "size-9 text-center text-sm p-0 relative",
        day_button: "size-9 rounded-md p-0 font-normal hover:bg-accent",
        selected: "bg-primary text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-40",
        range_middle: "aria-selected:bg-primary/15 aria-selected:text-foreground rounded-none",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
export { Calendar, type DateRange };

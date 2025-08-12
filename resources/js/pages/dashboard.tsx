import { Bar, BarChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useEffect, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardAction, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const chartConfig = {
    waiting: { label: "Waiting", color: "#fbbf24" },
    serving: { label: "Serving", color: "#3b82f6" },
    done: { label: "Done", color: "#10b981" },
    skipped: { label: "Skipped", color: "#ef4444" },
} satisfies ChartConfig;

export default function Dashboard({ stats }: { stats: any[] }) {
    const [originalData] = useState<any[]>(stats); // simpan data asli
    const [chartData, setChartData] = useState<any[]>(stats);
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Minggu, 1 = Senin, dst.
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // mundur ke Senin

    const [range, setRange] = useState<DateRange | undefined>({
        from: mondayThisWeek,
        to: today,
    });


    useEffect(() => {
        if (!originalData || originalData.length === 0) return;
        if (!range?.from || !range?.to) {
            setChartData(originalData);
            return;
        }
        const filteredData = originalData.filter((item) => {
            const date = new Date(item.date);
            return date >= range.from! && date <= range.to!;
        });
        setChartData(filteredData);
    }, [range, originalData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                {/* Placeholder Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {["Total Waiting", "Total Done", "Total Skipped"].map((title, i) => (
                        <div key={i} className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="relative flex-1 overflow-hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle>Queue Analytics</CardTitle>
                            <CardDescription>
                                Showing total visitors.
                            </CardDescription>
                            <CardAction>
                                <div className="flex items-center gap-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                <CalendarIcon />
                                                {range?.from && range?.to
                                                    ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                                                    : "June 2025"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                                            <Calendar
                                                className="w-full"
                                                mode="range"
                                                selected={range}
                                                onSelect={setRange}
                                                fixedWeeks
                                                showOutsideDays
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="px-4">
                            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="waiting" fill="var(--color-waiting)" radius={4} />
                                    <Bar dataKey="serving" fill="var(--color-serving)" radius={4} />
                                    <Bar dataKey="done" fill="var(--color-done)" radius={4} />
                                    <Bar dataKey="skipped" fill="var(--color-skipped)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="border-t">
                            <div className="text-sm">
                                You had{" "}
                                <span className="font-semibold">{chartData.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>{" "}
                                visitors.
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

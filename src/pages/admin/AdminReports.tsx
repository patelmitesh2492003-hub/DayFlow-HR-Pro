import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useEffect, useState } from "react";
import { reportsAPI } from "@/lib/api";
import { Loader2, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminReports = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await reportsAPI.getSummary();
                setData(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const chartData = data?.monthlyAttendance?.map((val: number, i: number) => ({
        name: `Month ${i + 1}`,
        attendance: val
    })) || [];

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="pl-64">
                <DashboardHeader title="Reports" subtitle="System analytics and insights" />

                <div className="p-8 grid gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border/50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Attendance Trends (Last 6 Months)
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-success" />
                                Department Costs
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(data?.departmentCosts || {}).map(([dept, cost]: any) => (
                                    <div key={dept} className="flex justify-between items-center pb-2 border-b border-border/50">
                                        <span>{dept}</span>
                                        <span className="font-mono font-medium">${cost.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminReports;

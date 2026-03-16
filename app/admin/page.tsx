import React from 'react';
import { 
    FileText, 
    Users, 
    Eye, 
    TrendingUp, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2 
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight font-serif">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back to the Monochrome control center.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Articles', value: '1,284', icon: FileText, trend: '+12%', color: 'text-blue-500' },
                    { label: 'Monthly Visitors', value: '45.2k', icon: Eye, trend: '+8%', color: 'text-green-500' },
                    { label: 'Active Users', value: '892', icon: Users, trend: '+5%', color: 'text-purple-500' },
                    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, trend: '+2%', color: 'text-actionRed' },
                ].map((stat, i) => (
                    <div key={i} className="group p-6 rounded-2xl border bg-card hover:border-foreground/20 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-muted group-hover:bg-foreground group-hover:text-background transition-colors">
                                <stat.icon size={20} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                                {stat.trend}
                                <ArrowUpRight size={12} />
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            <p className="text-3xl font-black tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Recent Activity */}
                <div className="md:col-span-4 p-6 rounded-2xl border bg-card shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif">
                        <Clock className="text-muted-foreground" size={20} />
                        Recent News Activity
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: 'New article published in Technology', time: '2 hours ago', status: 'published' },
                            { title: 'User @johndoe updated their profile', time: '4 hours ago', status: 'update' },
                            { title: 'New comment on "The Future of AI"', time: '5 hours ago', status: 'comment' },
                            { title: 'AI generated draft ready for review', time: 'Yesterday', status: 'pending' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b last:border-0 last:pb-0 border-border/40">
                                <div className="mt-1">
                                    <CheckCircle2 size={16} className="text-muted-foreground" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-bold">{activity.title}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="md:col-span-3 p-6 rounded-2xl border bg-card shadow-sm">
                    <h3 className="text-xl font-bold mb-6 font-serif">System Status</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'API Server', status: 'Operational', uptime: '99.9%' },
                            { label: 'Database', status: 'Operational', uptime: '100%' },
                            { label: 'AI Engine', status: 'Degraded', uptime: '94.2%' },
                        ].map((sys, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold uppercase tracking-widest text-muted-foreground">{sys.label}</span>
                                    <span className={sys.status === 'Operational' ? 'text-green-500 font-bold' : 'text-orange-500 font-bold'}>
                                        {sys.status}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${sys.status === 'Operational' ? 'bg-green-500' : 'bg-orange-500'}`} 
                                        style={{ width: sys.uptime }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

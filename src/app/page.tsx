"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { DollarSign, Users, Activity, Bell, Search } from "lucide-react"
import { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type DataPoint = {
  month: string
  value: number
}

type PieData = {
  name: string
  value: number
  color?: string
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ users: 0, sales: 0, sessions: 0 });
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifications = [
    { id: 1, message: "New user registered", time: "2m ago" },
    { id: 2, message: "Server backup completed", time: "10m ago" },
    { id: 3, message: "Monthly report ready", time: "1h ago" },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics({ users: 1245, sales: 23400, sessions: 312 });
      setLoading(false);
    }, 1200);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 5),
        sales: prev.sales + Math.floor(Math.random() * 100),
        sessions: prev.sessions + Math.floor(Math.random() * 3),
      }));
    }, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Sample data - in a real app, this would come from an API
  const revenueData: DataPoint[] = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 3000 },
    { month: 'Mar', value: 5000 },
    { month: 'Apr', value: 2780 },
    { month: 'May', value: 1890 },
    { month: 'Jun', value: 2390 },
  ]

  const userData: PieData[] = [
    { name: '18-24', value: 400 },
    { name: '25-34', value: 300 },
    { name: '35-44', value: 300 },
    { name: '45-54', value: 200 },
    { name: '55+', value: 100 },
  ]

  // Recent activity mock data
  const recentActivity = [
    { id: 1, action: "Added new user: John Doe", time: "2 min ago" },
    { id: 2, action: "Exported sales data", time: "15 min ago" },
    { id: 3, action: "Updated dashboard settings", time: "1 hour ago" },
    { id: 4, action: "Generated monthly report", time: "2 hours ago" },
  ];

  // Quick actions
  const quickActions = [
    { label: "Add User", icon: Users },
    { label: "Export Data", icon: DollarSign },
    { label: "Settings", icon: Activity },
  ];

  // Example summary stats
  const summaryStats = [
    { label: "Total Users", value: "1,245" },
    { label: "Revenue", value: "$45,231" },
    { label: "Conversion Rate", value: "4.2%" },
    { label: "Bounce Rate", value: "32%" },
  ];

  // Example filter options
  const filterOptions = ["Today", "This Week", "This Month", "Custom"];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[1]);

  // Example top trends
  const topTrends = [
    { name: "Most Active Region", value: "North America" },
    { name: "Top Product", value: "Premium Analytics" },
    { name: "Fastest Growing Segment", value: "SMBs" },
  ];

  // Animated card wrapper
  function AnimatedCard({ children }: { children: React.ReactNode }) {
    return (
      <div className="transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
        {children}
      </div>
    );
  }

  // Download CSV utility
  function downloadCSV(data: any[], filename = "report.csv") {
    const csvRows = [
      Object.keys(data[0]).join(","),
      ...data.map((row: any) => Object.values(row).join(","))
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // PDF export utility
  function downloadPDF(metrics: Record<string, any>, recentActivity: { action: string; time: string }[]) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Dashboard Report", 14, 20);
    doc.setFontSize(12);
    doc.text("Metrics:", 14, 35);
    let y = 45;
    Object.entries(metrics).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, y);
      y += 10;
    });
    doc.text("Recent Activity:", 14, y + 10);
    y += 20;
    recentActivity.forEach((item: { action: string; time: string }) => {
      doc.text(`- ${item.action} (${item.time})`, 20, y);
      y += 8;
    });
    doc.save("dashboard-report.pdf");
  }

  // Chart to image utility (demo for LineChart)
  function chartToImage(chartId: string, callback: (imgData: string) => void) {
    const chartElem = document.getElementById(chartId);
    if (!chartElem) return;
    html2canvas(chartElem).then(canvas => {
      callback(canvas.toDataURL("image/png"));
    });
  }

  // PDF export utility with chart image
  function downloadPDFWithChart(metrics: Record<string, any>, recentActivity: { action: string; time: string }[]) {
    chartToImage("linechart-main", (imgData: string) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Dashboard Report", 14, 20);
      doc.setFontSize(12);
      doc.text("Metrics:", 14, 35);
      let y = 45;
      Object.entries(metrics).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, y);
        y += 10;
      });
      doc.text("Recent Activity:", 14, y + 10);
      y += 20;
      recentActivity.forEach((item: { action: string; time: string }) => {
        doc.text(`- ${item.action} (${item.time})`, 20, y);
        y += 8;
      });
      doc.text("Traffic Overview Chart:", 14, y + 10);
      doc.addImage(imgData, "PNG", 20, y + 20, 160, 60);
      doc.save("dashboard-report.pdf");
    });
  }

  // Live data refresh state
  function handleRefresh() {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setMetrics({ users: 1245 + Math.floor(Math.random()*100), sales: 23400 + Math.floor(Math.random()*1000), sessions: 312 + Math.floor(Math.random()*50) });
      setLoading(false);
      setRefreshing(false);
    }, 1200);
  }

  // Chart tooltip demo (for LineChart)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });
  function handleChartMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, value: Math.floor(Math.random()*5000) as any });
  }
  function handleChartMouseLeave() {
    setTooltip({ visible: false, x: 0, y: 0, value: null });
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                aria-label="Notifications"
                className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                onClick={() => setNotifOpen((open) => !open)}
              >
                <Bell className="h-6 w-6 text-gray-200" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 transition-all duration-200">
                  <div className="p-4 border-b border-gray-700 font-semibold text-gray-200">Notifications</div>
                  <ul>
                    {notifications.map(n => (
                      <li key={n.id} className="px-4 py-2 text-gray-200 hover:bg-gray-800 cursor-pointer">
                        <span>{n.message}</span>
                        <span className="float-right text-xs text-gray-400">{n.time}</span>
                      </li>
                    ))}
                  </ul>
                  {notifications.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">No notifications</div>
                  )}
                </div>
              )}
            </div>
            <span className="text-gray-300">Welcome, Admin</span>
            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
            <img
                src="/window.svg"
                alt="User"
                className="w-8 h-8 rounded-full border cursor-pointer"
                onClick={() => setProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={profileOpen ? "true" : "false"}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded shadow-lg z-10 transition-all duration-200">
                  <button className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800">Profile</button>
                  <button className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800">Settings</button>
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-800">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Summary Bar */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {summaryStats.map(stat => (
              <div key={stat.label} className="bg-gradient-to-br from-blue-900/60 to-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 flex flex-col items-center border border-gray-700">
                <span className="text-xs uppercase text-gray-400 mb-1 tracking-wide">{stat.label}</span>
                <span className="text-2xl font-bold text-blue-300">{stat.value}</span>
              </div>
            ))}
            {/* Download Report Button */}
            <button
              className="col-span-2 md:col-span-1 bg-blue-700 text-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition border border-blue-900 font-semibold"
              onClick={() => downloadCSV([metrics], "dashboard-report.csv")}
              aria-label="Download CSV Report"
            >
              Download Report (CSV)
            </button>
            {/* Download PDF Button */}
            <button
              className="col-span-2 md:col-span-1 bg-blue-700 text-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition border border-blue-900 font-semibold"
              onClick={() => downloadPDF(metrics, recentActivity)}
              aria-label="Download PDF Report"
            >
              Download Report (PDF)
            </button>
            {/* Download PDF with Chart Button */}
            <button
              className="col-span-2 md:col-span-1 bg-blue-700 text-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 hover:bg-blue-800 transition border border-blue-900 font-semibold"
              onClick={() => downloadPDFWithChart(metrics, recentActivity)}
              aria-label="Download PDF Report with Chart"
            >
              Download Report (PDF, with Chart)
            </button>
            {/* Live Data Refresh Button */}
            <button
              className={`col-span-2 md:col-span-1 rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 border border-gray-700 font-semibold transition ${refreshing ? 'bg-blue-900 text-blue-300 animate-pulse' : 'bg-gray-800 text-gray-100 hover:bg-blue-900 hover:text-blue-300'}`}
              onClick={handleRefresh}
              aria-label="Refresh Data"
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Live Data Refresh'}
            </button>
          </div>
          {/* Filter Bar */}
          <div className="mb-8 flex gap-4 items-center">
            <span className="text-gray-400">Filter:</span>
            {filterOptions.map(option => (
              <button
                key={option}
                className={`px-4 py-2 rounded-full border border-gray-700 text-gray-300 font-medium transition ${selectedFilter === option ? 'bg-blue-700 text-white shadow' : 'bg-gray-900 hover:bg-gray-800'}`}
                onClick={() => setSelectedFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {/* Quick Actions */}
          <div className="mb-8 flex gap-4 flex-wrap">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition shadow"
                aria-label={action.label}
              >
                <action.icon className="h-5 w-5" />
                {action.label}
              </button>
            ))}
          </div>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center h-32">
                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></span>
                <span className="ml-4 text-gray-300">Loading metrics...</span>
              </div>
            ) : (
              <>
                <AnimatedCard>
                  <Card className="bg-gray-800 text-gray-100">
                    <CardHeader>
                      <CardTitle>Users</CardTitle>
                      <CardDescription>+5% this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold">{metrics.users}</span>
                    </CardContent>
                  </Card>
                </AnimatedCard>
                <AnimatedCard>
                  <Card className="bg-gray-800 text-gray-100">
                    <CardHeader>
                      <CardTitle>Sales</CardTitle>
                      <CardDescription>+2.1% this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold">${metrics.sales.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                </AnimatedCard>
                <AnimatedCard>
                  <Card className="bg-gray-800 text-gray-100">
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>-1.2% today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold">{metrics.sessions}</span>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </>
            )}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg shadow p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Traffic Overview</h2>
              <div
                id="linechart-main"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={handleChartMouseLeave}
                className="relative"
              >
                <LineChart data={revenueData} height={300} />
                {tooltip.visible && (
                  <div
                    className="chart-tooltip"
                    style={{ left: tooltip.x, top: tooltip.y }}
                  >
                    Value: {tooltip.value}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Sales Distribution</h2>
              <PieChart data={userData} width={300} height={300} />
            </div>
          </div>
          {/* Top Trends Section */}
          <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/60 backdrop-blur-lg rounded-xl shadow-lg p-6 mt-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Top Trends</h2>
            <ul>
              {topTrends.map(trend => (
                <li key={trend.name} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-700">
                  <span className="text-gray-300">{trend.name}</span>
                  <span className="text-blue-400 font-semibold">{trend.value}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Recent Activity Feed */}
          <div className="bg-gray-800 rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
            <ul>
              {recentActivity.map(item => (
                <li key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-700">
                  <span className="text-gray-200">{item.action}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 text-center py-4 border-t mt-8">
          &copy; 2025 Dashboard Inc. All rights reserved.
        </footer>
      </div>
      {/* Floating Search Bar */}
      <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-full shadow-lg px-4 py-2 w-80">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dashboard..."
            className="bg-transparent outline-none text-gray-200 flex-1"
            aria-label="Search dashboard"
          />
          <button
            className="ml-2 px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800 transition"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            Close
          </button>
        </div>
      </div>
      {/* Search Button (floating, bottom right) */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-blue-700 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition flex items-center"
        onClick={() => setSearchOpen(true)}
        aria-label="Open search"
      >
        <Search className="h-6 w-6" />
      </button>
    </div>
  );
}

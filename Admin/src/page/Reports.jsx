import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download, Filter } from "lucide-react";
import { toast } from "react-toastify";

const Reports = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("30");
    const [reportData, setReportData] = useState(null);
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const currency = "₹";

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/order/list`, {
                method: 'POST',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    useEffect(() => {
        if (orders.length > 0) {
            generateReport();
        }
    }, [orders, dateRange]);

    const generateReport = () => {
        const now = new Date();
        const startDate = new Date(now.getTime() - dateRange * 24 * 60 * 60 * 1000);
        
        const filteredOrders = orders.filter(order => new Date(order.date) >= startDate);
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const totalOrders = filteredOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const paidOrders = filteredOrders.filter(o => o.payment).length;
        const codOrders = filteredOrders.filter(o => o.paymentMethod === 'COD').length;
        
        const statusBreakdown = {};
        filteredOrders.forEach(order => {
            statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;
        });

        const dailyRevenue = {};
        filteredOrders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString();
            dailyRevenue[date] = (dailyRevenue[date] || 0) + (order.amount || 0);
        });

        const topProducts = {};
        filteredOrders.forEach(order => {
            order.items?.forEach(item => {
                topProducts[item.name] = (topProducts[item.name] || 0) + 1;
            });
        });

        setReportData({
            totalRevenue,
            totalOrders,
            avgOrderValue,
            paidOrders,
            codOrders,
            statusBreakdown,
            dailyRevenue,
            topProducts: Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        });
    };

    const exportCSV = () => {
        if (!reportData) return;
        const headers = ['Date', 'Order ID', 'Amount', 'Status', 'Payment Method'];
        const rows = orders.map(order => [
            new Date(order.date).toLocaleDateString(),
            order._id?.slice(-8),
            order.amount,
            order.status,
            order.paymentMethod
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${dateRange}days.csv`;
        a.click();
        toast.success("Report exported successfully!");
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <p style={{ color: "#6b7280" }}>Loading reports...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: "700", color: "#1f2937", margin: "0 0 8px 0" }}>Revenue Reports</h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>Analyze your sales performance</p>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: "10px 16px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="365">Last Year</option>
                    </select>
                    <button onClick={exportCSV} style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Download size={16} /> {isMobile ? "Export" : "Export CSV"}
                    </button>
                </div>
            </div>

            {reportData && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <DollarSign size={20} color="white" />
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{currency}{reportData.totalRevenue.toLocaleString()}</p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>Total Revenue</p>
                        </div>
                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ShoppingCart size={20} color="white" />
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{reportData.totalOrders}</p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>Total Orders</p>
                        </div>
                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <BarChart3 size={20} color="white" />
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{currency}{reportData.avgOrderValue.toFixed(2)}</p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>Avg Order Value</p>
                        </div>
                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <TrendingUp size={20} color="white" />
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{reportData.paidOrders}</p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>Paid Orders</p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Order Status Breakdown</h3>
                            {Object.entries(reportData.statusBreakdown).map(([status, count]) => (
                                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>{status}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "100px", height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                                            <div style={{ width: `${(count / reportData.totalOrders) * 100}%`, height: "100%", background: status === 'Delivered' ? '#10b981' : status === 'Shipped' ? '#3b82f6' : status === 'Processing' ? '#f59e0b' : '#ef4444', borderRadius: "3px" }} />
                                        </div>
                                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", minWidth: "30px" }}>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Top Selling Products</h3>
                            {reportData.topProducts.map(([name, count], index) => (
                                <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#e5e7eb'} 0%, ${index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#d97706' : '#f3f4f6'} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>{name}</p>
                                    </div>
                                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#8b5cf6" }}>{count} sold</span>
                                </div>
                            ))}
                        </div>

                    <div style={{ background: "white", padding: isMobile ? "16px" : "24px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ margin: "0 0 20px 0", fontSize: isMobile ? "16px" : "18px", fontWeight: "700", color: "#1f2937" }}>Daily Revenue</h3>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: isMobile ? "150px" : "200px", padding: "20px 0" }}>
                            {Object.entries(reportData.dailyRevenue).slice(-15).map(([date, revenue]) => {
                                const maxRevenue = Math.max(...Object.values(reportData.dailyRevenue));
                                const height = (revenue / maxRevenue) * (isMobile ? 100 : 150);
                                return (
                                    <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                        <span style={{ fontSize: isMobile ? "8px" : "10px", color: "#6b7280" }}>{currency}{revenue}</span>
                                        <div style={{ width: "100%", maxWidth: isMobile ? "16px" : "30px", height: `${height}px`, background: "linear-gradient(180deg, #ff6f61 0%, #ff8a7a 100%)", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }} />
                                        <span style={{ fontSize: isMobile ? "8px" : "10px", color: "#9ca3af" }}>{date.split('/')[0]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;

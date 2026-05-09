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

    const formatDate = (ts) => {
        if (!ts) return 'N/A';
        const d = new Date(ts);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const exportCSV = () => {
        if (!reportData) return;

        const now = new Date();
        const startDate = new Date(now.getTime() - dateRange * 24 * 60 * 60 * 1000);
        const filteredOrders = orders.filter(o => new Date(o.date) >= startDate);

        const headers = [
            'Date',
            'Order ID',
            'Customer Name',
            'Customer Email',
            'Items (Product × Qty)',
            'Amount',
            'Discount/Coupon',
            'Payment Method',
            'Status',
            'Address (City)'
        ];

        const rows = filteredOrders.map(order => {
            const items = order.items?.map(item =>
                `${item.name} × ${item.quantity}`
            ).join('; ') || '';

            let discount = '0';
            if (order.discount) {
                discount = String(order.discount);
                if (order.couponCode) {
                    discount += ' (' + order.couponCode + ')';
                }
            }

            const city = order.address?.city || '';

            return [
                formatDate(order.date),
                order._id,
                order.customerName || 'Unknown',
                order.customerEmail || 'Unknown',
                `"${items}"`,
                order.amount || 0,
                discount,
                order.paymentMethod || 'N/A',
                order.status || 'N/A',
                `"${city}"`
            ].join(',');
        });

        const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${dateRange}days.csv`;
        a.click();
        URL.revokeObjectURL(url);
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
        <div style={{ padding: isMobile ? "16px" : "24px", minHeight: "100vh", maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BarChart3 size={22} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 2px 0" }}>Revenue Reports</h1>
                        <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Analyze your sales performance</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                        style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", background: "#fff", cursor: "pointer" }}>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="365">Last Year</option>
                    </select>
                    <button onClick={exportCSV}
                        style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease" }}
                        onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(16,185,129,0.3)"; }}
                        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                        <Download size={16} /> {isMobile ? "Export" : "Export CSV"}
                    </button>
                </div>
            </div>

            {reportData && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                        {[
                            { label: "Total Revenue", value: currency + reportData.totalRevenue.toLocaleString(), icon: DollarSign, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                            { label: "Total Orders", value: reportData.totalOrders, icon: ShoppingCart, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                            { label: "Avg Order Value", value: currency + reportData.avgOrderValue.toFixed(2), icon: BarChart3, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
                            { label: "Paid Orders", value: reportData.paidOrders, icon: TrendingUp, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                        ].map((s, i) => (
                            <div key={i} style={{ background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <s.icon size={20} color={s.color} />
                                    </div>
                                </div>
                                <p style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: "#111827" }}>{s.value}</p>
                                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>
                        <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Order Status Breakdown</h3>
                            {Object.entries(reportData.statusBreakdown).map(([status, count]) => (
                                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{status}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "100px", height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                                            <div style={{ width: `${(count / reportData.totalOrders) * 100}%`, height: "100%", background: status === 'Delivered' ? '#10b981' : status === 'Shipped' ? '#3b82f6' : status === 'Processing' ? '#f59e0b' : '#ef4444', borderRadius: "3px" }} />
                                        </div>
                                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827", minWidth: "24px", textAlign: "right" }}>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Top Selling Products</h3>
                            {reportData.topProducts.length > 0 ? reportData.topProducts.map(([name, count], index) => (
                                <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: index === 0 ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" : index === 1 ? "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)" : index === 2 ? "linear-gradient(135deg, #b45309 0%, #d97706 100%)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: index < 3 ? "white" : "#6b7280", fontWeight: "700", fontSize: "12px", flexShrink: 0 }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                                    </div>
                                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#8b5cf6", flexShrink: 0 }}>{count} sold</span>
                                </div>
                            )) : (
                                <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px" }}>No product data available</p>
                            )}
                        </div>

                    <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                        <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Daily Revenue (Last 15 Days)</h3>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: isMobile ? "150px" : "180px", padding: "20px 0" }}>
                            {Object.entries(reportData.dailyRevenue).slice(-15).map(([date, revenue]) => {
                                const maxRevenue = Math.max(...Object.values(reportData.dailyRevenue), 1);
                                const height = (revenue / maxRevenue) * (isMobile ? 100 : 130);
                                return (
                                    <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                        <span style={{ fontSize: "9px", color: "#6b7280", fontWeight: "600" }}>{currency}{revenue}</span>
                                        <div style={{ width: "100%", maxWidth: isMobile ? "20px" : "32px", height: `${height}px`, background: "linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%)", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }} />
                                        <span style={{ fontSize: "8px", color: "#9ca3af" }}>{date.split('/')[0]}</span>
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

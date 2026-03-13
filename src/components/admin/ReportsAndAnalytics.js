import React, { useState, useEffect } from 'react';
import * as analyticsAPI from '../../api/analyticsAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie,
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaBoxes,
  FaSpa,
  FaMoneyBillWave,
  FaFileExcel,
  FaFilePdf,
  FaFilter
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const ReportsAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
  });
  const [period, setPeriod] = useState('monthly');
  const [revenueData, setRevenueData] = useState(null);
  const [productSales, setProductSales] = useState([]);
  const [serviceSales, setServiceSales] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: FaChartLine },
    { id: 'products', label: 'Products', icon: FaBoxes },
    { id: 'services', label: 'Services', icon: FaSpa },
    { id: 'customers', label: 'Customers', icon: FaUsers },
    { id: 'staff', label: 'Staff', icon: FaUsers },
    { id: 'inventory', label: 'Inventory', icon: FaBoxes },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'revenue':
          await fetchRevenueData();
          break;
        case 'products':
          await fetchProductSales();
          break;
        case 'services':
          await fetchServiceSales();
          break;
        case 'customers':
          await fetchCustomerData();
          break;
        case 'staff':
          await fetchStaffPerformance();
          break;
        case 'inventory':
          await fetchInventoryData();
          break;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    const response = await analyticsAPI.getRevenueAnalytics({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      period,
    });
    setRevenueData(response.data);
  };

  const fetchProductSales = async () => {
    const response = await analyticsAPI.getProductSalesAnalytics({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    setProductSales(response.data.products || []);
  };

  const fetchServiceSales = async () => {
    const response = await analyticsAPI.getServiceSalesAnalytics({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    setServiceSales(response.data.services || []);
  };

  const fetchCustomerData = async () => {
    const [newCustomers, retention] = await Promise.all([
      analyticsAPI.getNewCustomersAnalytics({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        period,
      }),
      analyticsAPI.getCustomerRetentionAnalytics(),
    ]);
    setCustomerData({
      newCustomers: newCustomers.data,
      retention: retention.data,
    });
  };

  const fetchStaffPerformance = async () => {
    const response = await analyticsAPI.getStaffPerformanceAnalytics({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    setStaffPerformance(response.data);
  };

  const fetchInventoryData = async () => {
    const [turnover, lowStock] = await Promise.all([
      analyticsAPI.getInventoryTurnover({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
      analyticsAPI.getLowStockAnalytics(),
    ]);
    setInventoryData({
      turnover: turnover.data,
      lowStock: lowStock.data,
    });
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      let response;
      
      switch (activeTab) {
        case 'revenue':
        case 'products':
        case 'services':
          response = await analyticsAPI.exportSalesReport({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            format,
          });
          break;
        case 'customers':
          response = await analyticsAPI.exportCustomersReport({ format });
          break;
        default:
          response = await analyticsAPI.exportFinancialReport({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            format,
          });
      }

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${activeTab}-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  const getChartColors = (count) => {
    const colors = [
      '#E8B4C8', '#6B5D52', '#4A4139', '#D4C5B3', '#EDE6D9',
      '#C4A5B0', '#8B7A6B', '#5E5548', '#BBAF9F', '#F5F1E8'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const renderRevenueChart = () => {
    if (!revenueData) return null;

    const chartData = {
      labels: revenueData.data.map(item => item._id),
      datasets: [
        {
          label: 'Revenue',
          data: revenueData.data.map(item => item.total),
          backgroundColor: 'rgba(232, 180, 200, 0.5)',
          borderColor: '#E8B4C8',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Orders',
          data: revenueData.data.map(item => item.count),
          backgroundColor: 'rgba(107, 93, 82, 0.5)',
          borderColor: '#6B5D52',
          borderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              if (context.dataset.label === 'Revenue') {
                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
              }
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            callback: (value) => formatCurrency(value),
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    return (
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
    );
  };

  const renderProductChart = () => {
    const chartData = {
      labels: productSales.slice(0, 10).map(item => item.name),
      datasets: [
        {
          label: 'Quantity Sold',
          data: productSales.slice(0, 10).map(item => item.quantitySold),
          backgroundColor: getChartColors(10),
          borderWidth: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const item = productSales[context.dataIndex];
              return [
                `Sold: ${item.quantitySold} units`,
                `Revenue: ${formatCurrency(item.revenue)}`,
              ];
            },
          },
        },
      },
    };

    return (
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  const renderServiceChart = () => {
    const chartData = {
      labels: serviceSales.slice(0, 10).map(item => item.name),
      datasets: [
        {
          label: 'Number of Bookings',
          data: serviceSales.slice(0, 10).map(item => item.count),
          backgroundColor: 'rgba(232, 180, 200, 0.5)',
          borderColor: '#E8B4C8',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const item = serviceSales[context.dataIndex];
              return [
                `Bookings: ${item.count}`,
                `Revenue: ${formatCurrency(item.revenue)}`,
              ];
            },
          },
        },
      },
    };

    return (
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  const renderCustomerChart = () => {
    if (!customerData) return null;

    const newCustomersData = {
      labels: customerData.newCustomers?.data?.map(item => item._id) || [],
      datasets: [
        {
          label: 'New Customers',
          data: customerData.newCustomers?.data?.map(item => item.count) || [],
          backgroundColor: 'rgba(232, 180, 200, 0.5)',
          borderColor: '#E8B4C8',
          borderWidth: 1,
        },
      ],
    };

    const retentionData = {
      labels: ['Active', 'Inactive', 'Returning'],
      datasets: [
        {
          data: [
            customerData.retention?.activeCustomers || 0,
            (customerData.retention?.totalCustomers || 0) - (customerData.retention?.activeCustomers || 0),
            customerData.retention?.returningCustomers || 0,
          ],
          backgroundColor: ['#E8B4C8', '#6B5D52', '#4A4139'],
          borderWidth: 0,
        },
      ],
    };

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">New Customers Over Time</h3>
          <div className="h-64">
            <Bar data={newCustomersData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">Customer Retention</h3>
          <div className="h-64">
            <Pie data={retentionData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    );
  };

  const renderStaffChart = () => {
    const chartData = {
      labels: staffPerformance.map(item => item.name),
      datasets: [
        {
          label: 'Services Completed',
          data: staffPerformance.map(item => item.servicesCompleted),
          backgroundColor: 'rgba(232, 180, 200, 0.5)',
          borderColor: '#E8B4C8',
          borderWidth: 1,
        },
        {
          label: 'Revenue Generated',
          data: staffPerformance.map(item => item.revenue),
          backgroundColor: 'rgba(107, 93, 82, 0.5)',
          borderColor: '#6B5D52',
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              if (context.dataset.label === 'Revenue Generated') {
                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
              }
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            callback: (value) => formatCurrency(value),
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    return (
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  const renderInventoryTable = () => {
    if (!inventoryData) return null;

    return (
      <div className="space-y-6">
        {/* Low Stock Alert */}
        {inventoryData.lowStock?.length > 0 && (
          <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-4">
            <h3 className="text-lg font-semibold text-warning mb-3 flex items-center">
              <FaBoxes className="mr-2" />
              Low Stock Alert ({inventoryData.lowStock.length} items)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {inventoryData.lowStock.map((product) => (
                <div key={product._id} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-medium text-primary-brown">{product.name}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Stock:</span>
                    <span className="font-bold text-warning">{product.stockQuantity}</span>
                  </div>
                  <p className="text-xs text-gray-400">Threshold: {product.lowStockThreshold}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Turnover */}
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">Inventory Turnover</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                  <th>Turnover Rate</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.turnover?.map((item) => (
                  <tr key={item._id}>
                    <td className="font-medium">{item.name}</td>
                    <td>{item.quantitySold}</td>
                    <td className="text-accent-pink">{formatCurrency(item.revenue)}</td>
                    <td>
                      <span className="badge bg-success text-white">
                        High
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          Reports & Analytics
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('excel')}
            disabled={exportLoading}
            className="btn-outline flex items-center"
          >
            <FaFileExcel className="mr-2" />
            Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportLoading}
            className="btn-outline flex items-center"
          >
            <FaFilePdf className="mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-primary-brown" />
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
              className="input-primary w-40"
              dateFormat="yyyy-MM-dd"
              placeholderText="Start date"
            />
          </div>
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
            className="input-primary w-40"
            dateFormat="yyyy-MM-dd"
            placeholderText="End date"
            minDate={dateRange.startDate}
          />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-primary w-32"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab flex items-center space-x-2 ${
                  activeTab === tab.id ? 'tab-active' : ''
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Summary Cards */}
        {revenueData?.summary && activeTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary-beige p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-brown">
                {formatCurrency(revenueData.summary.totalRevenue)}
              </p>
            </div>
            <div className="bg-secondary-beige p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-primary-brown">
                {revenueData.summary.totalOrders}
              </p>
            </div>
            <div className="bg-secondary-beige p-4 rounded-lg">
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-primary-brown">
                {formatCurrency(revenueData.summary.averageOrderValue)}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div>
          {activeTab === 'revenue' && renderRevenueChart()}
          {activeTab === 'products' && renderProductChart()}
          {activeTab === 'services' && renderServiceChart()}
          {activeTab === 'customers' && renderCustomerChart()}
          {activeTab === 'staff' && renderStaffChart()}
          {activeTab === 'inventory' && renderInventoryTable()}
        </div>

        {/* Data Tables */}
        {activeTab === 'products' && productSales.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Average Price</th>
                  </tr>
                </thead>
                <tbody>
                  {productSales.map((product) => (
                    <tr key={product._id}>
                      <td className="font-medium">{product.name}</td>
                      <td>{product.quantitySold}</td>
                      <td className="text-accent-pink">{formatCurrency(product.revenue)}</td>
                      <td>{formatCurrency(product.averagePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && serviceSales.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">Popular Services</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Bookings</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceSales.map((service) => (
                    <tr key={service._id}>
                      <td className="font-medium">{service.name}</td>
                      <td>{service.count}</td>
                      <td className="text-accent-pink">{formatCurrency(service.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && staffPerformance.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">Staff Performance</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Department</th>
                    <th>Services</th>
                    <th>Revenue</th>
                    <th>Commission</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((staff) => (
                    <tr key={staff._id}>
                      <td className="font-medium">{staff.name}</td>
                      <td className="capitalize">{staff.department}</td>
                      <td>{staff.servicesCompleted}</td>
                      <td className="text-accent-pink">{formatCurrency(staff.revenue)}</td>
                      <td className="text-success">{formatCurrency(staff.commission)}</td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-1">{staff.averageRating?.toFixed(1) || 'N/A'}</span>
                          {staff.averageRating && (
                            <span className="text-yellow-400">★</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;
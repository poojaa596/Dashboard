// Dashboard Data and State Management
const dashboardData = {
  currentSection: 'analytics',
  theme: 'light',
  sortConfig: { key: null, direction: 'asc' },
  transactions: [],
  charts: {},
  isLoading: false
};

// DOM Elements
const dom = {
  body: document.body,
  themeToggle: document.getElementById('themeToggle'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  sidebar: document.getElementById('sidebar'),
  profile: document.getElementById('profile'),
  profileMenu: document.querySelector('.profile-menu'),
  searchInput: document.getElementById('searchInput'),
  navLinks: document.querySelectorAll('.sidebar nav a'),
  content: document.getElementById('content'),
  modal: document.getElementById('actionModal'),
  closeModal: document.querySelector('.close-modal'),
  transactionId: document.getElementById('transactionId'),
  viewDetailsBtn: document.getElementById('viewDetailsBtn'),
  editBtn: document.getElementById('editBtn'),
  deleteBtn: document.getElementById('deleteBtn')
};

// Initialize the dashboard
function initDashboard() {
  loadTheme();
  setupEventListeners();
  loadSection(dashboardData.currentSection);
}

// Theme Management
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);
}

function setTheme(theme) {
  dashboardData.theme = theme;
  dom.body.className = `${theme}-theme`;
  localStorage.setItem('theme', theme);
  
  const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
  dom.themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
  
  updateChartsTheme();
}

function toggleTheme() {
  const newTheme = dashboardData.theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function updateChartsTheme() {
  Object.entries(dashboardData.charts).forEach(([key, chart]) => {
    if (!chart) return;
    
    // Update colors based on theme
    if (key === 'barChart') {
      chart.data.datasets[0].backgroundColor = dashboardData.theme === 'dark' ? '#818cf8' : '#4361ee';
    }
    
    // Update scales colors
    chart.options.scales = chart.options.scales || {};
    chart.options.scales.x = chart.options.scales.x || {};
    chart.options.scales.y = chart.options.scales.y || {};
    
    chart.options.scales.y.grid = chart.options.scales.y.grid || {};
    chart.options.scales.y.ticks = chart.options.scales.y.ticks || {};
    chart.options.scales.x.ticks = chart.options.scales.x.ticks || {};
    
    chart.options.scales.y.grid.color = dashboardData.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    chart.options.scales.y.ticks.color = dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280';
    chart.options.scales.x.ticks.color = dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280';
    
    // Update tooltip colors
    chart.options.plugins = chart.options.plugins || {};
    chart.options.plugins.tooltip = chart.options.plugins.tooltip || {};
    chart.options.plugins.tooltip.backgroundColor = dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff';
    chart.options.plugins.tooltip.titleColor = dashboardData.theme === 'dark' ? '#ffffff' : '#1f2937';
    chart.options.plugins.tooltip.bodyColor = dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280';
    chart.options.plugins.tooltip.borderColor = dashboardData.theme === 'dark' ? '#374151' : '#e5e7eb';
    
    chart.update();
  });
}

// Section Loading
async function loadSection(section) {
  dashboardData.currentSection = section;
  updateActiveNav();
  
  // Show loading state
  dom.content.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>';
  
  try {
    let html = '';
    switch(section) {
      case 'analytics':
        html = await loadAnalyticsSection();
        break;
      case 'sales':
        html = await loadSalesSection();
        break;
      case 'reports':
        html = await loadReportsSection();
        break;
      case 'customers':
        html = await loadCustomersSection();
        break;
      case 'settings':
        html = await loadSettingsSection();
        break;
      default:
        html = await loadAnalyticsSection();
    }
    
    dom.content.innerHTML = html;
    initSectionComponents(section);
  } catch (error) {
    console.error('Error loading section:', error);
    dom.content.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load data. Please try again.</p>
        <button class="btn" onclick="loadSection('${section}')">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    `;
  }
}

function updateActiveNav() {
  dom.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === dashboardData.currentSection) {
      link.classList.add('active');
    }
  });
}

async function loadAnalyticsSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const metrics = {
    totalUsers: Math.floor(Math.random() * 5000) + 2000,
    newOrders: Math.floor(Math.random() * 200) + 50,
    conversionRate: (Math.random() * 5 + 1).toFixed(1),
    revenue: Math.floor(Math.random() * 50000) + 10000
  };
  
  return `
    <section class="metrics">
      <div class="card">
        <h3>Total Users</h3>
        <p>${metrics.totalUsers.toLocaleString()}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 15 + 5).toFixed(1)}% from last month
        </div>
      </div>
      <div class="card">
        <h3>New Orders</h3>
        <p>${metrics.newOrders}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 10 + 2).toFixed(1)}% from last week
        </div>
      </div>
      <div class="card">
        <h3>Conversion Rate</h3>
        <p>${metrics.conversionRate}%</p>
        <div class="trend ${Math.random() > 0.5 ? 'up' : 'down'}">
          <i class="fas fa-arrow-${Math.random() > 0.5 ? 'up' : 'down'}"></i> 
          ${(Math.random() * 2).toFixed(1)}% from yesterday
        </div>
      </div>
      <div class="card">
        <h3>Revenue</h3>
        <p>$${metrics.revenue.toLocaleString()}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 12 + 3).toFixed(1)}% from last month
        </div>
      </div>
    </section>

    <section class="charts">
      <div class="chart-container">
        <h3>Sales Overview</h3>
        <div class="chart-wrapper">
          <canvas id="barChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <h3>User Growth</h3>
        <div class="chart-wrapper">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </section>

    <section class="charts">
      <div class="chart-container">
        <h3>Sales Distribution</h3>
        <div class="chart-wrapper">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <h3>Traffic Sources</h3>
        <div class="chart-wrapper">
          <canvas id="doughnutChart"></canvas>
        </div>
      </div>
    </section>

    <section class="charts">
      <div class="chart-container full-width">
        <h3>Regional Performance</h3>
        <div class="chart-wrapper">
          <canvas id="polarChart"></canvas>
        </div>
      </div>
    </section>

    <section class="data-table">
      <div class="table-header">
        <h3>Recent Transactions</h3>
        <div class="table-actions">
          <button class="btn" id="refreshBtn"><i class="fas fa-sync-alt"></i> Refresh</button>
          <button class="btn" id="exportBtn"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <table id="transactionsTable">
        <thead>
          <tr>
            <th data-sort="date">Date <i class="fas fa-sort"></i></th>
            <th data-sort="customer">Customer <i class="fas fa-sort"></i></th>
            <th data-sort="amount">Amount <i class="fas fa-sort"></i></th>
            <th data-sort="status">Status <i class="fas fa-sort"></i></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${generateTransactionRows(10)}
        </tbody>
      </table>
    </section>
  `;
}

async function loadSalesSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `
    <section class="metrics">
      <div class="card">
        <h3>Total Sales</h3>
        <p>$${(Math.random() * 50000 + 10000).toLocaleString()}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 15 + 5).toFixed(1)}% from last month
        </div>
      </div>
      <div class="card">
        <h3>Average Order</h3>
        <p>$${(Math.random() * 200 + 50).toFixed(2)}</p>
        <div class="trend ${Math.random() > 0.5 ? 'up' : 'down'}">
          <i class="fas fa-arrow-${Math.random() > 0.5 ? 'up' : 'down'}"></i> 
          ${(Math.random() * 5).toFixed(1)}% from last week
        </div>
      </div>
      <div class="card">
        <h3>Top Product</h3>
        <p>${['Premium Widget', 'Deluxe Service', 'Basic Package', 'Enterprise Solution'][Math.floor(Math.random() * 4)]}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 20 + 10).toFixed(1)}% growth
        </div>
      </div>
    </section>

    <section class="data-table">
      <div class="table-header">
        <h3>Recent Sales</h3>
        <div class="table-actions">
          <button class="btn" id="refreshBtn"><i class="fas fa-sync-alt"></i> Refresh</button>
          <button class="btn" id="exportBtn"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <table id="salesTable">
        <thead>
          <tr>
            <th data-sort="date">Date <i class="fas fa-sort"></i></th>
            <th data-sort="product">Product <i class="fas fa-sort"></i></th>
            <th data-sort="quantity">Quantity <i class="fas fa-sort"></i></th>
            <th data-sort="amount">Amount <i class="fas fa-sort"></i></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${generateSalesRows(8)}
        </tbody>
      </table>
    </section>
  `;
}

async function loadReportsSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `
    <section class="metrics">
      <div class="card">
        <h3>Generated Reports</h3>
        <p>${Math.floor(Math.random() * 50) + 10}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 20 + 5).toFixed(1)}% this month
        </div>
      </div>
      <div class="card">
        <h3>Scheduled Reports</h3>
        <p>${Math.floor(Math.random() * 10) + 3}</p>
      </div>
    </section>

    <section class="data-table">
      <div class="table-header">
        <h3>Available Reports</h3>
        <div class="table-actions">
          <button class="btn" id="generateReportBtn"><i class="fas fa-plus"></i> Generate New</button>
        </div>
      </div>
      <table id="reportsTable">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Type</th>
            <th>Last Generated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sales Performance</td>
            <td>Monthly</td>
            <td>${randomDate(new Date(2023, 0, 1), new Date())}</td>
            <td><button class="btn-icon action-btn"><i class="fas fa-download"></i></button></td>
          </tr>
          <tr>
            <td>User Activity</td>
            <td>Weekly</td>
            <td>${randomDate(new Date(2023, 0, 1), new Date())}</td>
            <td><button class="btn-icon action-btn"><i class="fas fa-download"></i></button></td>
          </tr>
          <tr>
            <td>Financial Summary</td>
            <td>Quarterly</td>
            <td>${randomDate(new Date(2023, 0, 1), new Date())}</td>
            <td><button class="btn-icon action-btn"><i class="fas fa-download"></i></button></td>
          </tr>
        </tbody>
      </table>
    </section>
  `;
}

async function loadCustomersSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `
    <section class="metrics">
      <div class="card">
        <h3>Total Customers</h3>
        <p>${Math.floor(Math.random() * 5000) + 1000}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 15 + 5).toFixed(1)}% this quarter
        </div>
      </div>
      <div class="card">
        <h3>New Customers</h3>
        <p>${Math.floor(Math.random() * 200) + 50}</p>
        <div class="trend up">
          <i class="fas fa-arrow-up"></i> ${(Math.random() * 10 + 5).toFixed(1)}% this month
        </div>
      </div>
      <div class="card">
        <h3>Active Now</h3>
        <p>${Math.floor(Math.random() * 100) + 20}</p>
      </div>
    </section>

    <section class="data-table">
      <div class="table-header">
        <h3>Customer List</h3>
        <div class="table-actions">
          <button class="btn" id="refreshBtn"><i class="fas fa-sync-alt"></i> Refresh</button>
          <button class="btn" id="exportBtn"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <table id="customersTable">
        <thead>
          <tr>
            <th data-sort="name">Name <i class="fas fa-sort"></i></th>
            <th data-sort="email">Email <i class="fas fa-sort"></i></th>
            <th data-sort="joined">Joined <i class="fas fa-sort"></i></th>
            <th data-sort="orders">Orders <i class="fas fa-sort"></i></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${generateCustomerRows(6)}
        </tbody>
      </table>
    </section>
  `;
}

async function loadSettingsSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `
    <section class="metrics">
      <div class="card">
        <h3>System Status</h3>
        <p><span class="status completed">Operational</span></p>
      </div>
      <div class="card">
        <h3>Storage Used</h3>
        <p>${(Math.random() * 50 + 10).toFixed(1)}%</p>
      </div>
    </section>

    <section class="settings-form">
      <h3>Dashboard Settings</h3>
      <form id="dashboardSettings">
        <div class="form-group">
          <label for="themePreference">Theme Preference</label>
          <select id="themePreference" class="form-control">
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div class="form-group">
          <label for="refreshRate">Data Refresh Rate</label>
          <select id="refreshRate" class="form-control">
            <option value="5">5 minutes</option>
            <option value="15" selected>15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="notifications" checked> Enable Notifications
          </label>
        </div>
        <button type="submit" class="btn">Save Settings</button>
      </form>
    </section>
  `;
}

// Helper functions
function generateTransactionRows(count) {
  const statuses = ['completed', 'pending', 'failed'];
  const customers = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton', 'Fiona Gallagher'];
  
  let rows = '';
  for (let i = 0; i < count; i++) {
    const amount = (Math.random() * 1000 + 50).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const date = randomDate(new Date(2023, 0, 1), new Date());
    
    rows += `
      <tr>
        <td>${date}</td>
        <td>${customer}</td>
        <td>$${amount}</td>
        <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
        <td><button class="btn-icon action-btn" data-id="${i + 1}"><i class="fas fa-ellipsis-v"></i></button></td>
      </tr>
    `;
  }
  return rows;
}

function generateSalesRows(count) {
  const products = ['Premium Widget', 'Deluxe Service', 'Basic Package', 'Enterprise Solution', 'Standard Item'];
  
  let rows = '';
  for (let i = 0; i < count; i++) {
    const amount = (Math.random() * 500 + 20).toFixed(2);
    const quantity = Math.floor(Math.random() * 10) + 1;
    const product = products[Math.floor(Math.random() * products.length)];
    const date = randomDate(new Date(2023, 0, 1), new Date());
    
    rows += `
      <tr>
        <td>${date}</td>
        <td>${product}</td>
        <td>${quantity}</td>
        <td>$${amount}</td>
        <td><button class="btn-icon action-btn" data-id="${i + 1}"><i class="fas fa-ellipsis-v"></i></button></td>
      </tr>
    `;
  }
  return rows;
}

function generateCustomerRows(count) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
  const lastNames = ['Johnson', 'Smith', 'Brown', 'Prince', 'Norton', 'Gallagher', 'Wilson', 'Davis'];
  
  let rows = '';
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const joined = randomDate(new Date(2020, 0, 1), new Date());
    const orders = Math.floor(Math.random() * 50) + 1;
    
    rows += `
      <tr>
        <td>${firstName} ${lastName}</td>
        <td>${email}</td>
        <td>${joined}</td>
        <td>${orders}</td>
        <td><button class="btn-icon action-btn" data-id="${i + 1}"><i class="fas fa-ellipsis-v"></i></button></td>
      </tr>
    `;
  }
  return rows;
}

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Initialize section components
function initSectionComponents(section) {
  // Initialize charts for analytics section
  if (section === 'analytics') {
    initCharts();
  }
  
  // Setup sortable tables
  document.querySelectorAll('th[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const column = header.getAttribute('data-sort');
      sortTable(table, column);
    });
  });
  
  // Setup action buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dom.transactionId.textContent = btn.getAttribute('data-id');
      dom.modal.classList.add('active');
    });
  });
  
  // Setup refresh buttons
  document.querySelectorAll('#refreshBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
      setTimeout(() => {
        loadSection(section);
      }, 1000);
    });
  });
  
  // Setup export buttons
  document.querySelectorAll('#exportBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting';
      
      // Simulate export
      setTimeout(() => {
        const table = btn.closest('.table-actions').previousElementSibling.textContent.trim();
        alert(`Exported ${table} data as CSV`);
        btn.innerHTML = '<i class="fas fa-download"></i> Export';
      }, 1500);
    });
  });
  
  // Setup generate report button if exists
  const generateReportBtn = document.getElementById('generateReportBtn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', () => {
      generateReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating';
      
      setTimeout(() => {
        alert('New report generated successfully');
        generateReportBtn.innerHTML = '<i class="fas fa-plus"></i> Generate New';
      }, 2000);
    });
  }
  
  // Setup settings form if exists
  const settingsForm = document.getElementById('dashboardSettings');
  if (settingsForm) {
    // Set current theme preference
    document.getElementById('themePreference').value = 
      localStorage.getItem('theme-preference') || 'system';
    
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const themePreference = document.getElementById('themePreference').value;
      localStorage.setItem('theme-preference', themePreference);
      
      if (themePreference === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      } else {
        setTheme(themePreference);
      }
      
      alert('Settings saved successfully');
    });
  }
}

// Initialize charts
function initCharts() {
  // Destroy existing charts if they exist
  Object.values(dashboardData.charts).forEach(chart => {
    if (chart) chart.destroy();
  });

  // Bar Chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  dashboardData.charts.barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Sales',
        data: [4500, 5200, 4800, 6200, 7500, 8100],
        backgroundColor: dashboardData.theme === 'dark' ? '#818cf8' : '#4361ee',
        borderRadius: 4,
        borderWidth: 1
      }]
    },
    options: getChartOptions('Sales', true)
  });
  
  // Line Chart
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  dashboardData.charts.lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Users',
        data: [1200, 1900, 1700, 2100, 2400, 2800],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2
      }]
    },
    options: getChartOptions('Users', true)
  });

  // Pie Chart
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  dashboardData.charts.pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Other'],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: 1,
        borderColor: dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff'
      }]
    },
    options: getPieChartOptions('Sales Distribution')
  });

  // Doughnut Chart
  const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
  dashboardData.charts.doughnutChart = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [60, 30, 10],
        backgroundColor: [
          '#6366f1',
          '#ec4899',
          '#f97316'
        ],
        borderWidth: 1,
        borderColor: dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff'
      }]
    },
    options: getPieChartOptions('Traffic Sources')
  });

  // Polar Area Chart
  const polarCtx = document.getElementById('polarChart').getContext('2d');
  dashboardData.charts.polarChart = new Chart(polarCtx, {
    type: 'polarArea',
    data: {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
        borderWidth: 1,
        borderColor: dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff'
      }]
    },
    options: getPieChartOptions('Regional Sales')
  });
}

function getChartOptions(title, showLegend = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          color: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
          padding: 20,
          font: {
            size: 12
          },
          boxWidth: 12
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: dashboardData.theme === 'dark' ? '#ffffff' : '#1f2937',
        bodyColor: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
        borderColor: dashboardData.theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y?.toLocaleString() || context.raw?.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: dashboardData.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#ffffff',
        borderWidth: 2
      }
    }
  };
}

function getPieChartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
          padding: 20,
          font: {
            size: 12
          },
          boxWidth: 12
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: dashboardData.theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: dashboardData.theme === 'dark' ? '#ffffff' : '#1f2937',
        bodyColor: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
        borderColor: dashboardData.theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: dashboardData.theme === 'dark' ? '#d1d5db' : '#6b7280',
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          bottom: 20
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const chart = elements[0].chart;
        const label = chart.data.labels[index];
        const value = chart.data.datasets[0].data[index];
        alert(`Selected: ${label} - ${value}`);
      }
    }
  };
}

// Table sorting
function sortTable(table, column) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const header = table.querySelector(`th[data-sort="${column}"]`);
  const isAsc = header.classList.contains('asc');
  
  // Clear all sort classes
  table.querySelectorAll('th').forEach(th => {
    th.classList.remove('asc', 'desc');
    th.querySelector('i').className = 'fas fa-sort';
  });
  
  // Set new sort direction
  const direction = isAsc ? 'desc' : 'asc';
  header.classList.add(direction);
  header.querySelector('i').className = `fas fa-sort-${direction === 'asc' ? 'up' : 'down'}`;
  
  rows.sort((a, b) => {
    const aValue = a.querySelector(`td:nth-child(${Array.from(header.parentNode.children).indexOf(header) + 1})`).textContent;
    const bValue = b.querySelector(`td:nth-child(${Array.from(header.parentNode.children).indexOf(header) + 1})`).textContent;
    
    if (column === 'date') {
      return direction === 'asc' 
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    } else if (column === 'amount') {
      return direction === 'asc'
        ? parseFloat(aValue.replace('$', '')) - parseFloat(bValue.replace('$', ''))
        : parseFloat(bValue.replace('$', '')) - parseFloat(aValue.replace('$', ''));
    } else if (column === 'quantity' || column === 'orders') {
      return direction === 'asc'
        ? parseInt(aValue) - parseInt(bValue)
        : parseInt(bValue) - parseInt(aValue);
    } else {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });
  
  // Clear existing rows
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  
  // Append sorted rows
  rows.forEach(row => tbody.appendChild(row));
}

// Event Listeners
function setupEventListeners() {
  // Theme toggle
  dom.themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile menu toggle
  dom.mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dom.sidebar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Close sidebar when clicking overlay
  document.querySelector('.sidebar-overlay').addEventListener('click', () => {
    dom.sidebar.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !dom.sidebar.contains(e.target) && e.target !== dom.mobileMenuBtn) {
      dom.sidebar.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Profile menu toggle
  dom.profile.addEventListener('click', (e) => {
    e.stopPropagation();
    dom.profileMenu.classList.toggle('active');
  });
  
  // Close profile menu when clicking outside
  document.addEventListener('click', () => {
    dom.profileMenu.classList.remove('active');
  });
  
  // Profile menu actions
  document.querySelectorAll('.profile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const action = link.getAttribute('data-action');
      dom.profileMenu.classList.remove('active');
      
      switch(action) {
        case 'profile':
          loadSection('profile');
          break;
        case 'settings':
          loadSection('settings');
          break;
        case 'logout':
          if(confirm('Are you sure you want to logout?')) {
            alert('User logged out');
          }
          break;
      }
    });
  });
  
  // Navigation
  dom.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      loadSection(section);
    });
  });
  
  // Search functionality
  dom.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  });
  
  // Modal actions
  dom.closeModal.addEventListener('click', () => {
    dom.modal.classList.remove('active');
  });
  
  dom.viewDetailsBtn.addEventListener('click', () => {
    const id = dom.transactionId.textContent;
    alert(`Viewing details for transaction #${id}`);
    dom.modal.classList.remove('active');
  });
  
  dom.editBtn.addEventListener('click', () => {
    const id = dom.transactionId.textContent;
    alert(`Editing transaction #${id}`);
    dom.modal.classList.remove('active');
  });
  
  dom.deleteBtn.addEventListener('click', () => {
    const id = dom.transactionId.textContent;
    if (confirm(`Are you sure you want to delete transaction #${id}?`)) {
      alert(`Transaction #${id} deleted`);
    }
    dom.modal.classList.remove('active');
  });
  
  // Close modal when clicking outside
  dom.modal.addEventListener('click', (e) => {
    if (e.target === dom.modal) {
      dom.modal.classList.remove('active');
    }
  });
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// App state
let state = {
  userName: "Pengguna",
  transactions: [],
  theme: "dark" // "dark" or "light"
};

// Category definition with emoji and color theme
const CATEGORIES = {
  expense: [
    { id: "makanan", name: "Makanan", emoji: "🍔", color: "#ff9100" },
    { id: "transportasi", name: "Transportasi", emoji: "🚗", color: "#2979ff" },
    { id: "belanja", name: "Belanja", emoji: "🛍️", color: "#ff4081" },
    { id: "tagihan", name: "Tagihan", emoji: "💡", color: "#b388ff" },
    { id: "hiburan", name: "Hiburan", emoji: "🎬", color: "#3d5afe" },
    { id: "kesehatan", name: "Kesehatan", emoji: "🏥", color: "#ff5252" },
    { id: "pendidikan", name: "Pendidikan", emoji: "📚", color: "#00e676" },
    { id: "lainnya_e", name: "Lainnya", emoji: "📦", color: "#90a4ae" }
  ],
  income: [
    { id: "gaji", name: "Gaji", emoji: "💵", color: "#00e676" },
    { id: "uang_saku", name: "Uang Saku", emoji: "🎒", color: "#ff9100" },
    { id: "beasiswa", name: "Beasiswa", emoji: "🎓", color: "#b388ff" },
    { id: "bisnis", name: "Bisnis", emoji: "🏢", color: "#00b0ff" },
    { id: "lainnya_i", name: "Lainnya", emoji: "💰", color: "#ffd600" }
  ]
};

const TRANSACTION_METHODS = [
  { id: "dana", name: "DANA", emoji: "📱", color: "#008cff" },
  { id: "qris", name: "QRIS", emoji: "📷", color: "#ff4081" },
  { id: "bri", name: "BRI", emoji: "🏦", color: "#0277bd" },
  { id: "btn", name: "BTN", emoji: "💳", color: "#f57c00" },
  { id: "cash", name: "Cash", emoji: "💸", color: "#00e676" },
  { id: "lainnya", name: "Lainnya", emoji: "🏢", color: "#90a4ae" }
];

// Form states
let activeFormType = "expense"; // "expense" or "income"
let selectedCategoryId = "";
let selectedMethodId = "dana";
let transactionToDeleteId = null;

// DOM Elements
const bodyEl = document.body;
const themeToggleBtn = document.getElementById("theme-toggle");
const themeSunIcon = document.getElementById("theme-sun-icon");
const themeMoonIcon = document.getElementById("theme-moon-icon");
const userAvatarEl = document.getElementById("user-avatar");
const userGreetingNameEl = document.getElementById("user-greeting-name");

// Nav
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

// Dashboard DOMs
const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const recentTxContainer = document.getElementById("recent-transactions-container");
const btnSeeAllTx = document.getElementById("btn-see-all-transactions");

// Transactions DOMs
const allTxContainer = document.getElementById("all-transactions-container");
const txSearchInput = document.getElementById("tx-search-input");
const filterTabs = document.querySelectorAll(".filter-tab");
let activeTxFilter = "all"; // "all", "income", "expense"

// Stats DOMs
const statsTypeSegments = document.querySelectorAll("#stats-type-toggle .segment-item");
let activeStatsType = "expense"; // "expense" or "income"
const statsDonutChart = document.getElementById("stats-donut-chart");
const chartTotalAmountEl = document.getElementById("chart-total-amount");
const chartTotalLabelEl = document.getElementById("chart-total-label");
const statsCategoriesContainer = document.getElementById("stats-categories-container");

// Add Modal DOMs
const btnAddTx = document.getElementById("btn-add-transaction");
const txModalOverlay = document.getElementById("tx-modal-overlay");
const btnCloseModal = document.getElementById("btn-close-modal");
const transactionForm = document.getElementById("transaction-form");
const formTypeSegments = document.querySelectorAll("#transaction-form .segmented-control .segment-item");
const amountInput = document.getElementById("tx-amount");
const categoryGridContainer = document.getElementById("category-grid-container");
const categoryLabel = document.getElementById("category-label");
const txDateInput = document.getElementById("tx-date");
const txNoteInput = document.getElementById("tx-note");

const methodFormGroup = document.getElementById("method-form-group");
const methodLabel = document.getElementById("method-label");
const methodGridContainer = document.getElementById("method-grid-container");
const detailMethodEl = document.getElementById("detail-method");

// Stats View Toggle
const statsViewSegments = document.querySelectorAll("#stats-view-toggle .segment-item");
let activeStatsView = "category"; // "category" or "daily"
const statsCategorySection = document.getElementById("stats-category-section");
const statsDailySection = document.getElementById("stats-daily-section");
const statsDailyContainer = document.getElementById("stats-daily-container");

// Business Modal DOMs
const btnSettingsBusiness = document.getElementById("btn-settings-business");
const businessModalOverlay = document.getElementById("business-modal-overlay");
const btnCloseBusinessModal = document.getElementById("btn-close-business-modal");
const businessForm = document.getElementById("business-form");
const bizNameInput = document.getElementById("biz-name");
const bizTotalInput = document.getElementById("biz-total");
const bizDpInput = document.getElementById("biz-dp");
const businessListContainer = document.getElementById("business-list-container");

// General Overlay & Modals
const confirmOverlay = document.getElementById("confirm-overlay");
const txDetailModal = document.getElementById("tx-detail-modal");
const resetConfirmDialog = document.getElementById("reset-confirm-dialog");
const editUserDialog = document.getElementById("edit-user-dialog");

// Details Modal DOMs
const detailTitle = document.getElementById("detail-title");
const detailCategoryIcon = document.getElementById("detail-category-icon");
const detailDate = document.getElementById("detail-date");
const detailNote = document.getElementById("detail-note");
const detailAmount = document.getElementById("detail-amount");
const btnCloseDetail = document.getElementById("btn-close-detail");
const btnDeleteTx = document.getElementById("btn-delete-tx");

// Settings DOMs
const btnEditProfile = document.getElementById("btn-settings-edit-profile");
const profileDescEl = document.getElementById("settings-profile-desc");
const btnExport = document.getElementById("btn-settings-export");
const importFileInput = document.getElementById("import-file-input");
const btnReset = document.getElementById("btn-settings-reset");
const btnResetCancel = document.getElementById("btn-reset-cancel");
const btnResetOk = document.getElementById("btn-reset-ok");
const editProfileNameInput = document.getElementById("edit-profile-name");
const btnEditUserCancel = document.getElementById("btn-edit-user-cancel");
const btnEditUserSave = document.getElementById("btn-edit-user-save");

// Function to update segmented controls sliding active state
function updateSegmentedSliders() {
  const controls = document.querySelectorAll(".segmented-control");
  controls.forEach(control => {
    // Add slider indicator element if it doesn't exist
    let slider = control.querySelector(".segmented-slider");
    if (!slider) {
      slider = document.createElement("div");
      slider.className = "segmented-slider";
      control.appendChild(slider);
    }
    
    const items = control.querySelectorAll(".segment-item");
    const activeItem = control.querySelector(".segment-item.active");
    if (activeItem && slider) {
      const activeIndex = Array.from(items).indexOf(activeItem);
      const itemCount = items.length;
      slider.style.width = `calc(${100 / itemCount}% - 8px)`;
      slider.style.transform = `translateX(calc(${activeIndex * 100}% + ${activeIndex * 8}px))`;
      
      // Determine dynamic color representation based on category/type
      const type = activeItem.getAttribute("data-type") || activeItem.getAttribute("data-stats-type");
      const isLightMode = document.body.classList.contains("light-mode");
      
      if (type === "income") {
        slider.style.backgroundColor = "var(--color-income)";
        slider.style.border = "none";
        slider.style.boxShadow = isLightMode ? "0 4px 12px rgba(27, 94, 32, 0.25)" : "0 4px 16px rgba(0, 230, 118, 0.45)";
        activeItem.style.color = isLightMode ? "#ffffff" : "#020a06";
      } else if (type === "expense") {
        slider.style.backgroundColor = "var(--color-expense)";
        slider.style.border = "none";
        slider.style.boxShadow = isLightMode ? "0 4px 12px rgba(245, 127, 23, 0.25)" : "0 4px 16px rgba(255, 214, 0, 0.35)";
        activeItem.style.color = isLightMode ? "#ffffff" : "#020a06";
      } else {
        // Default style for category/daily switch
        slider.style.backgroundColor = isLightMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)";
        slider.style.border = "1px solid var(--border-color)";
        slider.style.boxShadow = "none";
        activeItem.style.color = "var(--color-text)";
      }
      
      // Reset color of inactive siblings to muted state
      items.forEach(item => {
        if (item !== activeItem) {
          item.style.color = "var(--color-text-muted)";
        }
      });
    }
  });
}

// ==========================================
// 1. DATA AND SINKRONISASI STORAGE
// ==========================================

// Load data from LocalStorage
function loadState() {
  const savedState = localStorage.getItem("uangku_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Ensure transactions array exists
      if (!Array.isArray(state.transactions)) state.transactions = [];
      if (!Array.isArray(state.businessProjects)) state.businessProjects = [];
      if (!state.userName) state.userName = "Pengguna";
      if (!state.theme) state.theme = "dark";
    } catch (e) {
      console.error("Gagal memuat data dari localStorage, menggunakan template baru.", e);
      resetState();
    }
  } else {
    // Standard template data if empty
    state = {
      userName: "Pengguna",
      theme: "dark",
      transactions: [
        {
          id: "tx-init-1",
          type: "income",
          amount: 5000000,
          categoryId: "gaji",
          date: getFormattedDateOffset(0),
          note: "Gaji Bulan Ini"
        },
        {
          id: "tx-init-2",
          type: "expense",
          amount: 50000,
          categoryId: "makanan",
          date: getFormattedDateOffset(0),
          note: "Beli Makan Siang"
        },
        {
          id: "tx-init-3",
          type: "expense",
          amount: 150000,
          categoryId: "belanja",
          date: getFormattedDateOffset(-1),
          note: "Belanja Bulanan"
        }
      ]
    };
    saveState();
  }
}

// Helper to get formatted date string (YYYY-MM-DD)
function getFormattedDateOffset(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

// Save state to LocalStorage
function saveState() {
  localStorage.setItem("uangku_state", JSON.stringify(state));
}

// Reset state completely
function resetState() {
  state = {
    userName: "Pengguna",
    theme: "dark",
    transactions: [],
    businessProjects: []
  };
  saveState();
  applyTheme();
  updateUI();
  showView("view-dashboard");
}

// ==========================================
// 2. TEMA DAN AKUN PENGGUNA
// ==========================================

function applyTheme() {
  if (state.theme === "light") {
    bodyEl.classList.add("light-mode");
    themeSunIcon.style.display = "none";
    themeMoonIcon.style.display = "block";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f0f2f5");
  } else {
    bodyEl.classList.remove("light-mode");
    themeSunIcon.style.display = "block";
    themeMoonIcon.style.display = "none";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#0b071e");
  }
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
}

function updateProfileUI() {
  const initial = state.userName.charAt(0).toUpperCase();
  userAvatarEl.textContent = initial;
  userGreetingNameEl.textContent = state.userName;
  profileDescEl.textContent = `Nama Anda: ${state.userName}`;
}

// ==========================================
// 3. UTILITIES FORMAT DATA
// ==========================================

// Format Number to Rupiah (IDR)
function formatIDR(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

// Parse string amount with separators to integer
function parseIDRToNum(str) {
  const cleaned = str.replace(/[^\d]/g, "");
  return cleaned === "" ? 0 : parseInt(cleaned, 10);
}

// Format IDR input real-time
function handleAmountInput(e) {
  let value = e.target.value;
  let numeric = parseIDRToNum(value);
  e.target.value = numeric.toLocaleString("id-ID");
}

// Date formatter in Indonesian layout
function formatIndonesianDate(dateStr) {
  if (!dateStr) return "-";
  
  const todayStr = getFormattedDateOffset(0);
  const yesterdayStr = getFormattedDateOffset(-1);
  
  if (dateStr === todayStr) return "Hari ini";
  if (dateStr === yesterdayStr) return "Kemarin";
  
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  return `${day} ${months[monthIdx]} ${year}`;
}

// Category helper
function getCategoryDetails(catId, type) {
  const list = type === "income" ? CATEGORIES.income : CATEGORIES.expense;
  const item = list.find(c => c.id === catId);
  if (item) return item;
  
  // Return fallback details if category deleted/not found
  return {
    id: "unknown",
    name: "Lainnya",
    emoji: type === "income" ? "💰" : "📦",
    color: "#90a4ae"
  };
}

// ==========================================
// 4. ROUTING / TABS SYSTEM
// ==========================================

function showView(viewId) {
  // Hide all views
  views.forEach(v => v.classList.remove("active"));
  
  // Show target view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
  }
  
  // Update bottom navigation state
  navItems.forEach(item => {
    if (item.getAttribute("data-target") === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Action upon rendering specific view
  if (viewId === "view-dashboard") {
    renderDashboard();
  } else if (viewId === "view-transactions") {
    renderTransactionsList();
  } else if (viewId === "view-stats") {
    renderStatsReport();
  } else if (viewId === "view-settings") {
    updateProfileUI();
  }
}

// ==========================================
// 5. RENDER LOGICS
// ==========================================

// Calculate global totals
function calculateFinancials() {
  let income = 0;
  let expense = 0;
  
  state.transactions.forEach(tx => {
    if (tx.type === "income") {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }
  });
  
  const balance = income - expense;
  
  return { income, expense, balance };
}

// Render Dashboard (Home)
function renderDashboard() {
  const financial = calculateFinancials();
  
  // Populate numbers
  totalBalanceEl.textContent = formatIDR(financial.balance);
  totalIncomeEl.textContent = formatIDR(financial.income);
  totalExpenseEl.textContent = formatIDR(financial.expense);
  
  // Get recent 5 transactions (sorted by date desc, then by id desc)
  const sortedTx = [...state.transactions].sort((a, b) => {
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date);
    }
    return b.id.localeCompare(a.id);
  });
  
  const recentTx = sortedTx.slice(0, 5);
  
  if (recentTx.length === 0) {
    recentTxContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💸</div>
        <p>Belum ada transaksi saat ini.<br>Tekan tombol + untuk menambahkan.</p>
      </div>
    `;
    return;
  }
  
  recentTxContainer.innerHTML = "";
  recentTx.forEach(tx => {
    const cat = getCategoryDetails(tx.categoryId, tx.type);
    const txCard = createTransactionCard(tx, cat);
    recentTxContainer.appendChild(txCard);
  });
}

// Render Full Transactions List with filter & search
function renderTransactionsList() {
  const searchQuery = txSearchInput.value.toLowerCase().trim();
  
  // Sort and filter
  let filteredTx = [...state.transactions].sort((a, b) => {
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date);
    }
    return b.id.localeCompare(a.id);
  });
  
  // Filter by Type (All / Income / Expense)
  if (activeTxFilter !== "all") {
    filteredTx = filteredTx.filter(tx => tx.type === activeTxFilter);
  }
  
  // Filter by Search Query
  if (searchQuery !== "") {
    filteredTx = filteredTx.filter(tx => {
      const cat = getCategoryDetails(tx.categoryId, tx.type);
      return (
        tx.note.toLowerCase().includes(searchQuery) ||
        cat.name.toLowerCase().includes(searchQuery) ||
        tx.amount.toString().includes(searchQuery)
      );
    });
  }
  
  if (filteredTx.length === 0) {
    allTxContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>Tidak ada transaksi yang cocok.</p>
      </div>
    `;
    return;
  }
  
  // Group by Date for better visual presentation
  allTxContainer.innerHTML = "";
  
  let currentDateGroup = "";
  let currentGroupContainer = null;
  
  filteredTx.forEach(tx => {
    const formattedDate = formatIndonesianDate(tx.date);
    
    // Create new group header if date changes
    if (currentDateGroup !== formattedDate) {
      currentDateGroup = formattedDate;
      
      const groupHeader = document.createElement("div");
      groupHeader.style.cssText = "font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-top: 18px; margin-bottom: 8px; padding-left: 4px;";
      groupHeader.textContent = currentDateGroup;
      allTxContainer.appendChild(groupHeader);
      
      currentGroupContainer = document.createElement("div");
      currentGroupContainer.style.cssText = "display: flex; flex-direction: column; gap: 10px;";
      allTxContainer.appendChild(currentGroupContainer);
    }
    
    const cat = getCategoryDetails(tx.categoryId, tx.type);
    const txCard = createTransactionCard(tx, cat);
    if (currentGroupContainer) {
      currentGroupContainer.appendChild(txCard);
    }
  });
}

function getMethodDetails(methodId) {
  const method = TRANSACTION_METHODS.find(m => m.id === methodId);
  return method ? method : { id: "unknown", name: "Lainnya", emoji: "💵", color: "#90a4ae" };
}

// Helper to create Transaction Card DOM
function createTransactionCard(tx, cat) {
  const card = document.createElement("div");
  card.className = "transaction-card";
  card.setAttribute("data-tx-id", tx.id);
  
  const symbol = tx.type === "income" ? "+" : "-";
  const amountClass = tx.type === "income" ? "income" : "expense";
  
  card.innerHTML = `
    <div class="tx-left">
      <div class="tx-category-icon" style="background-color: ${cat.color}20; color: ${cat.color}">
        ${cat.emoji}
      </div>
      <div class="tx-info">
        <h4>${tx.note || cat.name}</h4>
        <p>${cat.name}${tx.methodId ? ' • ' + getMethodDetails(tx.methodId).name : ''}</p>
      </div>
    </div>
    <div class="tx-right">
      <div class="tx-amount ${amountClass}">${symbol} ${formatIDR(tx.amount).replace("Rp ", "")}</div>
      <div class="tx-time">${formatIndonesianDate(tx.date)}</div>
    </div>
  `;
  
  // Open details on click
  card.addEventListener("click", () => {
    openTransactionDetails(tx);
  });
  
  return card;
}

// Render Stats/Report Chart & category lists
function renderStatsReport() {
  // Filter transactions of active type (expense / income)
  const filteredTx = state.transactions.filter(tx => tx.type === activeStatsType);
  
  // Calculate category aggregates
  const catSummaryMap = {};
  let totalAmount = 0;
  
  filteredTx.forEach(tx => {
    totalAmount += tx.amount;
    if (catSummaryMap[tx.categoryId]) {
      catSummaryMap[tx.categoryId].amount += tx.amount;
    } else {
      const cat = getCategoryDetails(tx.categoryId, tx.type);
      catSummaryMap[tx.categoryId] = {
        id: tx.categoryId,
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        amount: tx.amount
      };
    }
  });
  
  // Format total label and amount in the middle of donut chart
  chartTotalLabelEl.textContent = activeStatsType === "expense" ? "Pengeluaran" : "Pemasukan";
  chartTotalAmountEl.textContent = formatIDR(totalAmount);
  
  // Convert map to array and sort by amount desc
  const sortedCategories = Object.values(catSummaryMap).sort((a, b) => b.amount - a.amount);
  
  // Draw SVG Donut Chart
  drawDonutChart(sortedCategories, totalAmount);
  
  // Render Categories Breakdown List
  statsCategoriesContainer.innerHTML = "";
  
  if (sortedCategories.length === 0) {
    statsCategoriesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <p>Belum ada data untuk laporan grafik.</p>
      </div>
    `;
    return;
  }
  
  sortedCategories.forEach(item => {
    const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
    
    const catItem = document.createElement("div");
    catItem.className = "stat-category-item";
    catItem.innerHTML = `
      <div class="stat-cat-left">
        <div class="tx-category-icon" style="background-color: ${item.color}20; color: ${item.color}; font-size: 1.1rem; width:38px; height:38px; border-radius:10px; flex-shrink:0;">
          ${item.emoji}
        </div>
        <div style="flex-grow: 1;">
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:500; margin-bottom:2px;">
            <span>${item.name}</span>
            <span>${percentage}%</span>
          </div>
          <div class="stat-progress-bar-container">
            <div class="stat-progress-bar" style="width: 0%; background: linear-gradient(90deg, ${item.color}, #ff4081);"></div>
          </div>
        </div>
      </div>
      <div class="stat-cat-right">
        <div class="stat-cat-amount">${formatIDR(item.amount)}</div>
      </div>
    `;
    
    statsCategoriesContainer.appendChild(catItem);
    
    // Small micro-animation timeout to trigger progress bar loading line
    setTimeout(() => {
      const pBar = catItem.querySelector(".stat-progress-bar");
      if (pBar) pBar.style.width = `${percentage}%`;
    }, 100);
  });
  
  // Also render daily summary
  renderDailyExpenseSummary();
}

// Math for drawing SVG Donut Chart
function drawDonutChart(categoriesList, total) {
  // Reset segments
  const bgRingStr = '<circle class="chart-bg-ring" cx="100" cy="100" r="80"></circle>';
  statsDonutChart.innerHTML = bgRingStr;
  
  if (categoriesList.length === 0 || total === 0) {
    return;
  }
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius; // Approx 502.65
  
  let currentOffset = 0;
  
  categoriesList.forEach((cat) => {
    const percentage = cat.amount / total;
    const segmentLength = circumference * percentage;
    const dashArray = `${segmentLength} ${circumference}`;
    const dashOffset = -currentOffset;
    
    const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    segment.setAttribute("class", "chart-segment");
    segment.setAttribute("cx", "100");
    segment.setAttribute("cy", "100");
    segment.setAttribute("r", radius.toString());
    segment.setAttribute("stroke", cat.color);
    // Dynamic transition style
    segment.style.strokeDasharray = `0 ${circumference}`;
    segment.style.strokeDashoffset = "0";
    
    statsDonutChart.appendChild(segment);
    
    // Set dash details on next frame for animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        segment.style.strokeDasharray = dashArray;
        segment.style.strokeDashoffset = dashOffset.toString();
      }, 50);
    });
    
    // Hover details handler
    segment.addEventListener("click", () => {
      // Scale-down animation for center text (HCI micro-feedback)
      const centerText = document.querySelector(".chart-center-text");
      if (centerText) {
        centerText.style.transition = "transform 0.1s ease, opacity 0.1s ease";
        centerText.style.transform = "scale(0.92)";
        centerText.style.opacity = "0.5";
        
        setTimeout(() => {
          chartTotalLabelEl.textContent = cat.name;
          chartTotalAmountEl.textContent = formatIDR(cat.amount);
          
          centerText.style.transform = "scale(1.05)";
          centerText.style.opacity = "1";
          
          setTimeout(() => {
            centerText.style.transform = "scale(1)";
          }, 100);
        }, 100);
      } else {
        chartTotalLabelEl.textContent = cat.name;
        chartTotalAmountEl.textContent = formatIDR(cat.amount);
      }
    });
    
    currentOffset += segmentLength;
  });
}

function renderDailyExpenseSummary() {
  const filteredTx = state.transactions.filter(tx => tx.type === activeStatsType);
  
  const dateGroups = {};
  filteredTx.forEach(tx => {
    if (dateGroups[tx.date]) {
      dateGroups[tx.date].amount += tx.amount;
      dateGroups[tx.date].count += 1;
    } else {
      dateGroups[tx.date] = {
        date: tx.date,
        amount: tx.amount,
        count: 1
      };
    }
  });
  
  const sortedDates = Object.values(dateGroups).sort((a, b) => b.date.localeCompare(a.date));
  
  statsDailyContainer.innerHTML = "";
  
  if (sortedDates.length === 0) {
    statsDailyContainer.innerHTML = `
      <div class="empty-state" style="padding: 20px;">
        <p>Belum ada data transaksi.</p>
      </div>
    `;
    return;
  }
  
  sortedDates.forEach(group => {
    const item = document.createElement("div");
    item.className = "daily-summary-item";
    const formattedDate = formatIndonesianDate(group.date);
    const amountClass = activeStatsType === "income" ? "income" : "";
    const amountSymbol = activeStatsType === "income" ? "+" : "-";
    
    item.innerHTML = `
      <div style="text-align: left;">
        <div class="daily-sum-date">${formattedDate}</div>
        <div class="daily-sum-count">${group.count} Transaksi</div>
      </div>
      <div class="daily-sum-amount ${amountClass}">${amountSymbol} ${formatIDR(group.amount).replace("Rp ", "")}</div>
    `;
    statsDailyContainer.appendChild(item);
  });
}

// Open Business Modal
function openBusinessModal() {
  bizNameInput.value = "";
  bizTotalInput.value = "";
  bizDpInput.value = "";
  renderBusinessList();
  businessModalOverlay.classList.add("open");
}

// Close Business Modal
function closeBusinessModal() {
  businessModalOverlay.classList.remove("open");
}

// Render Business list
function renderBusinessList() {
  businessListContainer.innerHTML = "";
  
  if (!state.businessProjects || state.businessProjects.length === 0) {
    businessListContainer.innerHTML = `
      <div class="empty-state" style="padding: 20px;">
        <p>Belum ada proyek bisnis saat ini.</p>
      </div>
    `;
    return;
  }
  
  const sortedProjects = [...state.businessProjects].reverse();
  
  sortedProjects.forEach(proj => {
    const sisa = proj.totalVal - proj.dpVal;
    const isLunas = sisa <= 0 || proj.status === "lunas";
    const statusText = isLunas ? "Lunas" : "DP";
    const statusClass = isLunas ? "lunas" : "dp";
    
    const card = document.createElement("div");
    card.className = "business-project-card";
    
    card.innerHTML = `
      <div class="biz-header">
        <div class="biz-title">${proj.name}</div>
        <div class="biz-badge ${statusClass}">${statusText}</div>
      </div>
      <div class="biz-row">
        <span>Total Nilai Kesepakatan:</span>
        <span>${formatIDR(proj.totalVal)}</span>
      </div>
      <div class="biz-row">
        <span>Pemasukan Awal (DP):</span>
        <span>${formatIDR(proj.dpVal)}</span>
      </div>
      <div class="biz-row biz-sisa-row">
        <span>Sisa Pembayaran:</span>
        <span class="biz-sisa-amount">${isLunas ? "Rp 0 (Lunas)" : formatIDR(sisa)}</span>
      </div>
      <div class="biz-actions">
        ${!isLunas ? `<button class="btn-biz-action btn-biz-pay" data-id="${proj.id}">Lunasi DP</button>` : ""}
        <button class="btn-biz-action btn-biz-delete" data-id="${proj.id}">Hapus</button>
      </div>
    `;
    
    const payBtn = card.querySelector(".btn-biz-pay");
    if (payBtn) {
      payBtn.addEventListener("click", () => {
        markBusinessAsPaid(proj.id);
      });
    }
    
    const deleteBtn = card.querySelector(".btn-biz-delete");
    deleteBtn.addEventListener("click", () => {
      deleteBusinessProject(proj.id);
    });
    
    businessListContainer.appendChild(card);
  });
}

// Add new Business Project
function handleSaveBusiness(e) {
  e.preventDefault();
  
  const name = bizNameInput.value.trim();
  const total = parseIDRToNum(bizTotalInput.value);
  const dp = parseIDRToNum(bizDpInput.value);
  
  if (name === "") {
    alert("Nama bisnis harus diisi!");
    return;
  }
  
  if (total <= 0) {
    alert("Total nilai kesepakatan harus di atas Rp 0");
    return;
  }
  
  const newProj = {
    id: "biz-" + Date.now(),
    name: name,
    totalVal: total,
    dpVal: dp,
    status: dp >= total ? "lunas" : "dp"
  };
  
  if (!state.businessProjects) state.businessProjects = [];
  state.businessProjects.push(newProj);
  saveState();
  renderBusinessList();
  
  // Reset form fields
  bizNameInput.value = "";
  bizTotalInput.value = "";
  bizDpInput.value = "";
  
  alert("Proyek bisnis berhasil ditambahkan!");
}

// Toggle project to Paid
function markBusinessAsPaid(projId) {
  const proj = state.businessProjects.find(p => p.id === projId);
  if (proj) {
    proj.status = "lunas";
    proj.dpVal = proj.totalVal;
    saveState();
    renderBusinessList();
  }
}

// Delete Business project
function deleteBusinessProject(projId) {
  if (confirm("Apakah Anda yakin ingin menghapus proyek bisnis ini?")) {
    state.businessProjects = state.businessProjects.filter(p => p.id !== projId);
    saveState();
    renderBusinessList();
  }
}

// Global update trigger
function updateUI() {
  renderDashboard();
  renderTransactionsList();
  renderStatsReport();
  updateProfileUI();
  renderBusinessList();
  updateSegmentedSliders();
}

// ==========================================
// 6. MODALS ACTIONS & CONTROLS
// ==========================================

// Reset Add Transaction form to defaults
function resetAddForm() {
  amountInput.value = "0";
  txNoteInput.value = "";
  
  // Reset active segment to expense for consistency
  activeFormType = "expense";
  formTypeSegments.forEach(s => {
    if (s.getAttribute("data-type") === "expense") {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
  
  // Set date to today in input
  const today = getFormattedDateOffset(0);
  txDateInput.value = today;
  
  // Set default category
  renderCategoryGrid();
  
  // Set method label and render
  methodLabel.textContent = activeFormType === "income" ? "Metode Penerimaan" : "Metode Pembayaran";
  methodFormGroup.style.display = "block";
  renderMethodGrid();
  
  // Update sliding controls
  updateSegmentedSliders();
}

function renderMethodGrid() {
  methodGridContainer.innerHTML = "";
  
  selectedMethodId = TRANSACTION_METHODS[0].id;
  
  TRANSACTION_METHODS.forEach(method => {
    const gridItem = document.createElement("div");
    gridItem.className = `category-select-item ${method.id === selectedMethodId ? "selected" : ""}`;
    gridItem.setAttribute("data-method-id", method.id);
    
    gridItem.innerHTML = `
      <div class="category-icon-wrapper" style="color: ${method.color}">
        ${method.emoji}
      </div>
      <span>${method.name}</span>
    `;
    
    gridItem.addEventListener("click", () => {
      methodGridContainer.querySelectorAll(".category-select-item").forEach(item => {
        item.classList.remove("selected");
      });
      
      gridItem.classList.add("selected");
      selectedMethodId = method.id;
    });
    
    methodGridContainer.appendChild(gridItem);
  });
}

// Render category items inside the input form grid
function renderCategoryGrid() {
  categoryGridContainer.innerHTML = "";
  const list = activeFormType === "income" ? CATEGORIES.income : CATEGORIES.expense;
  
  // Automatically select first category
  selectedCategoryId = list[0].id;
  categoryLabel.textContent = `Kategori ${activeFormType === "income" ? "Pemasukan" : "Pengeluaran"}`;
  
  list.forEach(cat => {
    const gridItem = document.createElement("div");
    gridItem.className = `category-select-item ${cat.id === selectedCategoryId ? "selected" : ""}`;
    gridItem.setAttribute("data-cat-id", cat.id);
    
    gridItem.innerHTML = `
      <div class="category-icon-wrapper" style="color: ${cat.color}">
        ${cat.emoji}
      </div>
      <span>${cat.name}</span>
    `;
    
    gridItem.addEventListener("click", () => {
      // Remove selected from other grid items
      categoryGridContainer.querySelectorAll(".category-select-item").forEach(item => {
        item.classList.remove("selected");
      });
      
      gridItem.classList.add("selected");
      selectedCategoryId = cat.id;
    });
    
    categoryGridContainer.appendChild(gridItem);
  });
}

// Open Form Modal
function openAddTransactionModal() {
  resetAddForm();
  txModalOverlay.classList.add("open");
}

// Close Form Modal
function closeAddTransactionModal() {
  txModalOverlay.classList.remove("open");
}

// Save Transaction handler
function handleSaveTransaction(e) {
  e.preventDefault();
  
  const amount = parseIDRToNum(amountInput.value);
  const date = txDateInput.value;
  const note = txNoteInput.value.trim();
  
  if (amount <= 0) {
    alert("Masukkan nominal transaksi di atas Rp 0");
    return;
  }
  
  if (!date) {
    alert("Silakan tentukan tanggal transaksi");
    return;
  }
  
  const newTx = {
    id: "tx-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    type: activeFormType,
    amount: amount,
    categoryId: selectedCategoryId,
    methodId: selectedMethodId,
    date: date,
    note: note
  };
  
  state.transactions.push(newTx);
  saveState();
  updateUI();
  closeAddTransactionModal();
}

// Open transaction info modal
function openTransactionDetails(tx) {
  transactionToDeleteId = tx.id;
  
  const cat = getCategoryDetails(tx.categoryId, tx.type);
  const symbol = tx.type === "income" ? "+" : "-";
  
  detailTitle.textContent = tx.type === "income" ? "Detail Pemasukan" : "Detail Pengeluaran";
  detailCategoryIcon.textContent = cat.emoji;
  detailCategoryIcon.style.backgroundColor = `${cat.color}20`;
  detailCategoryIcon.style.color = cat.color;
  
  detailDate.textContent = formatIndonesianDate(tx.date);
  detailNote.textContent = tx.note || cat.name;
  
  if (tx.methodId) {
    const method = getMethodDetails(tx.methodId);
    detailMethodEl.textContent = tx.type === "income" ? `Penerimaan: ${method.name}` : `Pembayaran: ${method.name}`;
    detailMethodEl.style.display = "block";
  } else {
    detailMethodEl.style.display = "none";
  }
  
  const amtFormatted = `${symbol} ${formatIDR(tx.amount)}`;
  detailAmount.textContent = amtFormatted;
  detailAmount.className = `tx-amount ${tx.type === "income" ? "income" : "expense"}`;
  detailAmount.style.fontSize = "1.8rem";
  detailAmount.style.textAlign = "center";
  
  // Show elements
  confirmOverlay.classList.add("open");
  txDetailModal.style.display = "block";
  resetConfirmDialog.style.display = "none";
  editUserDialog.style.display = "none";
}

// Close multi-purpose confirmation overlay
function closeConfirmOverlay() {
  confirmOverlay.classList.remove("open");
  // Delayed display clean up for transition smooth transitions
  setTimeout(() => {
    txDetailModal.style.display = "none";
    resetConfirmDialog.style.display = "none";
    editUserDialog.style.display = "none";
    transactionToDeleteId = null;
  }, 300);
}

// Perform delete transaction
function deleteCurrentTransaction() {
  if (!transactionToDeleteId) return;
  
  state.transactions = state.transactions.filter(tx => tx.id !== transactionToDeleteId);
  saveState();
  updateUI();
  closeConfirmOverlay();
}

// Open name change profile editor dialog
function openEditProfileDialog() {
  editProfileNameInput.value = state.userName;
  confirmOverlay.classList.add("open");
  txDetailModal.style.display = "none";
  resetConfirmDialog.style.display = "none";
  editUserDialog.style.display = "block";
  
  setTimeout(() => {
    editProfileNameInput.focus();
    editProfileNameInput.select();
  }, 100);
}

// Save nickname changes
function saveUserProfileName() {
  const newName = editProfileNameInput.value.trim();
  if (newName === "") {
    alert("Nama tidak boleh kosong!");
    return;
  }
  
  state.userName = newName;
  saveState();
  updateUI();
  closeConfirmOverlay();
}

// Open clear database reset dialogue confirmation
function openResetConfirmDialog() {
  confirmOverlay.classList.add("open");
  txDetailModal.style.display = "none";
  resetConfirmDialog.style.display = "block";
  editUserDialog.style.display = "none";
}

// Backup system JSON Download
function exportDataJSON() {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const dateStr = getFormattedDateOffset(0);
  const a = document.createElement("a");
  a.href = url;
  a.download = `uangku_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Restore system JSON Upload
function handleImportDataJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      
      // Validation checklist
      if (typeof imported !== 'object' || !imported) {
        throw new Error("Format JSON tidak valid");
      }
      
      // Basic checking for profile name and arrays
      if (imported.userName && Array.isArray(imported.transactions)) {
        state = {
          userName: imported.userName,
          theme: imported.theme || "dark",
          transactions: imported.transactions
        };
        saveState();
        applyTheme();
        updateUI();
        alert("Data berhasil diimpor!");
        showView("view-dashboard");
      } else {
        throw new Error("JSON tidak mengandung field 'userName' atau 'transactions' yang valid");
      }
    } catch (err) {
      alert("Gagal membaca file backup: " + err.message);
    }
    // Clear input
    importFileInput.value = "";
  };
  reader.readAsText(file);
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

function initEventListeners() {
  // Navigation
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");
      showView(target);
    });
  });
  
  // Dashboard shortcuts
  btnSeeAllTx.addEventListener("click", () => {
    showView("view-transactions");
  });
  
  // Theme toggle click
  themeToggleBtn.addEventListener("click", toggleTheme);
  
  // FAB modal open click
  btnAddTx.addEventListener("click", openAddTransactionModal);
  
  // Form controls closing modal click
  btnCloseModal.addEventListener("click", closeAddTransactionModal);
  txModalOverlay.addEventListener("click", (e) => {
    if (e.target === txModalOverlay) closeAddTransactionModal();
  });
  
  // Add modal segmented type toggle click (Income vs Expense segment control)
  formTypeSegments.forEach(seg => {
    seg.addEventListener("click", () => {
      formTypeSegments.forEach(s => s.classList.remove("active"));
      seg.classList.add("active");
      
      activeFormType = seg.getAttribute("data-type");
      renderCategoryGrid();
      
      // Update method label and render
      methodLabel.textContent = activeFormType === "income" ? "Metode Penerimaan" : "Metode Pembayaran";
      renderMethodGrid();
      
      // Update sliding controls
      updateSegmentedSliders();
    });
  });
  
  // Amount format event listener
  amountInput.addEventListener("input", handleAmountInput);
  amountInput.addEventListener("blur", () => {
    if (amountInput.value.trim() === "" || amountInput.value.trim() === "0") {
      amountInput.value = "0";
    }
  });
  amountInput.addEventListener("focus", () => {
    if (amountInput.value === "0") {
      amountInput.value = "";
    }
  });
  
  // Form submission
  transactionForm.addEventListener("submit", handleSaveTransaction);
  
  // Close confirmation overlay
  btnCloseDetail.addEventListener("click", closeConfirmOverlay);
  btnResetCancel.addEventListener("click", closeConfirmOverlay);
  btnEditUserCancel.addEventListener("click", closeConfirmOverlay);
  
  confirmOverlay.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) closeConfirmOverlay();
  });
  
  // Execute delete transaction button click
  btnDeleteTx.addEventListener("click", deleteCurrentTransaction);
  
  // Settings interactions
  btnEditProfile.addEventListener("click", openEditProfileDialog);
  btnEditUserSave.addEventListener("click", saveUserProfileName);
  
  editProfileNameInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") saveUserProfileName();
  });
  
  // Reset trigger click
  btnReset.addEventListener("click", openResetConfirmDialog);
  btnResetOk.addEventListener("click", () => {
    resetState();
    closeConfirmOverlay();
    alert("Semua data berhasil dibersihkan.");
  });
  
  // Export button click
  btnExport.addEventListener("click", exportDataJSON);
  
  // Import file handle changes
  importFileInput.addEventListener("change", handleImportDataJSON);
  
  // Transaction Tab Filter Controls
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      activeTxFilter = tab.getAttribute("data-filter");
      renderTransactionsList();
    });
  });
  
  // Search transactions text input filter trigger
  txSearchInput.addEventListener("input", renderTransactionsList);
  
  // Stats Type segments toggle (Income vs Expense display graphs)
  statsTypeSegments.forEach(seg => {
    seg.addEventListener("click", () => {
      statsTypeSegments.forEach(s => s.classList.remove("active"));
      seg.classList.add("active");
      
      activeStatsType = seg.getAttribute("data-stats-type");
      renderStatsReport();
      
      // Update sliding controls
      updateSegmentedSliders();
    });
  });

  // Stats View toggler (Category breakdown vs Daily Summary)
  statsViewSegments.forEach(seg => {
    seg.addEventListener("click", () => {
      statsViewSegments.forEach(s => s.classList.remove("active"));
      seg.classList.add("active");
      
      activeStatsView = seg.getAttribute("data-stats-view");
      if (activeStatsView === "category") {
        statsCategorySection.style.display = "block";
        statsDailySection.style.display = "none";
      } else {
        statsCategorySection.style.display = "none";
        statsDailySection.style.display = "block";
      }
      
      // Update sliding controls
      updateSegmentedSliders();
    });
  });

  // Business Modal handlers
  btnSettingsBusiness.addEventListener("click", openBusinessModal);
  btnCloseBusinessModal.addEventListener("click", closeBusinessModal);
  businessModalOverlay.addEventListener("click", (e) => {
    if (e.target === businessModalOverlay) closeBusinessModal();
  });
  
  // Real-time formatters for business forms
  bizTotalInput.addEventListener("input", handleAmountInput);
  bizDpInput.addEventListener("input", handleAmountInput);
  
  bizTotalInput.addEventListener("blur", () => {
    if (bizTotalInput.value.trim() === "" || bizTotalInput.value.trim() === "0") {
      bizTotalInput.value = "0";
    }
  });
  bizDpInput.addEventListener("blur", () => {
    if (bizDpInput.value.trim() === "" || bizDpInput.value.trim() === "0") {
      bizDpInput.value = "0";
    }
  });
  bizTotalInput.addEventListener("focus", () => {
    if (bizTotalInput.value === "0") bizTotalInput.value = "";
  });
  bizDpInput.addEventListener("focus", () => {
    if (bizDpInput.value === "0") bizDpInput.value = "";
  });

  // Business form save
  businessForm.addEventListener("submit", handleSaveBusiness);
}

// ==========================================
// 8. INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  applyTheme();
  initEventListeners();
  updateUI();
  
  // Extra safety update for sliding controls after layout finishes rendering
  window.addEventListener("load", updateSegmentedSliders);
});

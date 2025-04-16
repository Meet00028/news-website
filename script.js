// API Configuration
const BASE_URL = '/api/news';

// DOM Elements
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const themeSwitch = document.getElementById('checkbox');

// Theme Switch
themeSwitch.addEventListener('change', () => {
  document.body.setAttribute('data-theme', themeSwitch.checked ? 'dark' : 'light');
  localStorage.setItem('theme', themeSwitch.checked ? 'dark' : 'light');
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  themeSwitch.checked = savedTheme === 'dark';
}

// Scroll to Top Button
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Search Functionality
searchBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    getNews('', searchTerm);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      getNews('', searchTerm);
    }
  }
});

// Fetch News Function
async function getNews(category = '', searchTerm = '') {
  try {
    showLoading();
    
    const params = new URLSearchParams({
      ...(category && { category }),
      ...(searchTerm && { q: searchTerm })
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();

    if (data.status === 'ok') {
      displayNews(data.articles);
    } else {
      throw new Error(data.message || 'Failed to fetch news');
    }
  } catch (error) {
    showError(error.message);
  }
}

// Display News Function
function displayNews(articles) {
  newsContainer.innerHTML = '';
  
  if (articles.length === 0) {
    newsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No news articles found. Try a different search term or category.</p>
      </div>
    `;
    return;
  }

  articles.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image';
    const publishedDate = new Date(article.publishedAt).toLocaleDateString();
    
    articleCard.innerHTML = `
      <img src="${imageUrl}" alt="${article.title}" class="article-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
      <div class="article-content">
        <h3 class="article-title">${article.title}</h3>
        <p class="article-description">${article.description || 'No description available'}</p>
        <div class="article-meta">
          <span class="date"><i class="far fa-calendar-alt"></i> ${publishedDate}</span>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
            Read More <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    
    newsContainer.appendChild(articleCard);
  });
}

// Loading State
function showLoading() {
  newsContainer.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading news...</p>
    </div>
  `;
}

// Error State
function showError(message) {
  newsContainer.innerHTML = `
    <div class="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <button onclick="getNews()" class="retry-btn">
        <i class="fas fa-sync-alt"></i> Try Again
      </button>
    </div>
  `;
}

// Initialize with general news
getNews();


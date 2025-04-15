async function getNews(category = 'general') {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading news...</p>
    </div>
  `;

  try {
    // Use the full URL for the deployed version
    const apiUrl = 'https://news-website-inhl.onrender.com/api/news';
    const res = await fetch(`${apiUrl}?category=${category}`);
    const data = await res.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid response format.");
    }

    displayNews(data.articles);
  } catch (err) {
    newsContainer.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>❌ ${err.message}</p>
      </div>
    `;
    console.error(err);
  }
}

function displayNews(articles) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = ''; // Clear old articles

  if (articles.length === 0) {
    newsContainer.innerHTML = `
      <div class="no-news">
        <i class="fas fa-newspaper"></i>
        <p>No news found for this category.</p>
      </div>
    `;
    return;
  }

  articles.forEach(article => {
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image';
    const description = article.description || 'No description available.';
    const title = article.title || 'Untitled';
    const date = new Date(article.publishedAt).toLocaleDateString();

    const articleElement = document.createElement('div');
    articleElement.classList.add('article');

    articleElement.innerHTML = `
      <img src="${imageUrl}" alt="${title}" class="news-img" />
      <div class="article-content">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="article-footer">
          <span class="date"><i class="far fa-calendar"></i> ${date}</span>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Read More
          </a>
        </div>
      </div>
    `;

    newsContainer.appendChild(articleElement);
  });
}

// Load default news
getNews();


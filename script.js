async function getNews(category = 'general') {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '<p>Loading...</p>';

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
    newsContainer.innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
    console.error(err);
  }
}

function displayNews(articles) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = ''; // Clear old articles

  if (articles.length === 0) {
    newsContainer.innerHTML = '<p>No news found for this category.</p>';
    return;
  }

  articles.forEach(article => {
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image';
    const description = article.description || 'No description available.';
    const title = article.title || 'Untitled';

    const articleElement = document.createElement('div');
    articleElement.classList.add('article');

    articleElement.innerHTML = `
      <img src="${imageUrl}" alt="${title}" class="news-img" />
      <h3>${title}</h3>
      <p>${description}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;

    newsContainer.appendChild(articleElement);
  });
}

// Load default news
getNews();


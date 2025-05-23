function showTab(tabName) {
    // Приховати всі вкладки
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Деактивувати всі кнопки
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показати обрану вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Активувати відповідну кнопку
    event.target.classList.add('active');

    // Якщо це вкладка "Події та заходи", завантажуємо новини
    if (tabName === 'events') {
        loadEvents();
    }
}

async function loadEvents() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '<div class="loading-indicator"><div class="spinner">⏳</div><p>Завантаження інформації...</p></div>';

    try {
        const response = await fetch('https://fclnup.if.ua/wp-json/wp/v2/pages?slug=zahalna-informatsiia&_embed');
        const pageData = await response.json();

        if (pageData.length > 0) {
            const page = pageData[0];
            let content = page.content.rendered;
            
            // Замінюємо зображення на обгорнуті у div для горизонтального розташування
            content = content.replace(/<img([^>]*)>/g, (match, attrs) => {
                return `<div class="image-row"><img${attrs}></div>`;
            });
            
            // Об'єднуємо послідовні image-row в один контейнер
            content = content.replace(/<\/div>\s*<div class="image-row">/g, '');
            
            container.innerHTML = `
                <div class="news-item">
                    <h3>${page.title.rendered}</h3>
                    <div>${content}</div>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="error-message"><div class="error-icon">😕</div><p>Інформацію не знайдено.</p></div>';
        }
    } catch (err) {
        console.error('Помилка завантаження:', err);
        container.innerHTML = '<div class="error-message"><div class="error-icon">❌</div><p>Помилка завантаження інформації.</p></div>';
    }
}
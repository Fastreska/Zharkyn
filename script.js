const books = [
  {
    id: 1,
    title: "Абай жолы",
    author: "Мұхтар Әуезов",
    category: "Роман",
    year: 1942,
    emoji: "📕",
    color: "linear-gradient(145deg, #823d35, #c77b61)"
  },
  {
    id: 2,
    title: "Қан мен тер",
    author: "Әбдіжәміл Нұрпейісов",
    category: "Роман",
    year: 1961,
    emoji: "📘",
    color: "linear-gradient(145deg, #234b70, #6398b9)"
  },
  {
    id: 3,
    title: "Ойлан да байы",
    author: "Наполеон Хилл",
    category: "Бизнес",
    year: 1937,
    emoji: "💰",
    color: "linear-gradient(145deg, #9b7528, #d8b75c)"
  },
  {
    id: 4,
    title: "Атомдық әдеттер",
    author: "Джеймс Клир",
    category: "Психология",
    year: 2018,
    emoji: "🧠",
    color: "linear-gradient(145deg, #34745c, #83b69a)"
  },
  {
    id: 5,
    title: "Көшпенділер",
    author: "Ілияс Есенберлин",
    category: "Роман",
    year: 1969,
    emoji: "🐎",
    color: "linear-gradient(145deg, #704b32, #bd9368)"
  },
  {
    id: 6,
    title: "Алхимик",
    author: "Пауло Коэльо",
    category: "Роман",
    year: 1988,
    emoji: "✨",
    color: "linear-gradient(145deg, #8b663e, #d6b47d)"
  },
  {
    id: 7,
    title: "Марсқа саяхат",
    author: "Ғылыми фантастика",
    category: "Фантастика",
    year: 2024,
    emoji: "🚀",
    color: "linear-gradient(145deg, #41366f, #9484cb)"
  },
  {
    id: 8,
    title: "Бай әке, кедей әке",
    author: "Роберт Кийосаки",
    category: "Бизнес",
    year: 1997,
    emoji: "💵",
    color: "linear-gradient(145deg, #286044, #65a77b)"
  },
  {
    id: 9,
    title: "Адамдармен тіл табысу",
    author: "Дейл Карнеги",
    category: "Психология",
    year: 1936,
    emoji: "🤝",
    color: "linear-gradient(145deg, #8e4c67, #d38da7)"
  },
  {
    id: 10,
    title: "Кішкентай ханзада",
    author: "Антуан де Сент-Экзюпери",
    category: "Фантастика",
    year: 1943,
    emoji: "🌟",
    color: "linear-gradient(145deg, #38648c, #86b9d8)"
  },
  {
    id: 11,
    title: "Менің атым Қожа",
    author: "Бердібек Соқпақбаев",
    category: "Роман",
    year: 1957,
    emoji: "🎒",
    color: "linear-gradient(145deg, #b76b36, #e9b66d)"
  },
  {
    id: 12,
    title: "Бай болудың жолы",
    author: "Қаржы сауаттылығы",
    category: "Бизнес",
    year: 2023,
    emoji: "📈",
    color: "linear-gradient(145deg, #315c50, #75ad8a)"
  }
];

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const resultsInfo = document.getElementById("resultsInfo");
const emptyState = document.getElementById("emptyState");
const favoritesBtn = document.getElementById("favoritesBtn");
const favoriteCount = document.getElementById("favoriteCount");
const toast = document.getElementById("toast");

let activeCategory = "Барлығы";
let showFavorites = false;

function loadData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let favorites = loadData("kitaphanaFavorites");
let borrowed = loadData("kitaphanaBorrowed");

function saveData() {
  localStorage.setItem(
    "kitaphanaFavorites",
    JSON.stringify(favorites)
  );

  localStorage.setItem(
    "kitaphanaBorrowed",
    JSON.stringify(borrowed)
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function updateFavoriteCount() {
  favoriteCount.textContent = favorites.length;
}

function renderBooks() {
  const query = searchInput.value
    .trim()
    .toLocaleLowerCase("kk");

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLocaleLowerCase("kk").includes(query) ||
      book.author.toLocaleLowerCase("kk").includes(query);

    const matchesCategory =
      activeCategory === "Барлығы" ||
      book.category === activeCategory;

    const matchesFavorites =
      !showFavorites || favorites.includes(book.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  bookGrid.innerHTML = filteredBooks.map(book => {
    const isFavorite = favorites.includes(book.id);
    const isBorrowed = borrowed.includes(book.id);

    return `
      <article class="book-card">
        <div
          class="book-cover"
          style="background: ${book.color}"
        >
          <span class="cover-emoji">${book.emoji}</span>
          <span class="cover-label">
            ${book.title}
          </span>

          <button
            class="heart-btn ${isFavorite ? "selected" : ""}"
            data-action="favorite"
            data-id="${book.id}"
            aria-label="Таңдаулыға қосу"
            aria-pressed="${isFavorite}"
          >${isFavorite ? "♥" : "♡"}</button>
        </div>

        <div class="book-info">
          <span class="book-category">${book.category}</span>
          <h3>${book.title}</h3>
          <p class="book-author">${book.author}</p>

          <div class="book-bottom">
            <span class="book-year">${book.year} жыл</span>

            <button
              class="borrow-btn ${isBorrowed ? "borrowed" : ""}"
              data-action="borrow"
              data-id="${book.id}"
            >
              ${isBorrowed ? "✓ Алынды" : "Кітап алу"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  resultsInfo.textContent =
    `Табылған кітаптар: ${filteredBooks.length}`;

  emptyState.hidden = filteredBooks.length !== 0;
  bookGrid.hidden = filteredBooks.length === 0;

  updateFavoriteCount();
}

// Іздеу
searchInput.addEventListener("input", renderBooks);

// Жанрды таңдау
filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  filters.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderBooks();
});

// Таңдаулылар және кітап алу
bookGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "favorite") {
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
      showToast("Таңдаулылардан өшірілді");
    } else {
      favorites.push(id);
      showToast("Таңдаулыларға қосылды ❤️");
    }
  }

  if (action === "borrow") {
    if (borrowed.includes(id)) {
      borrowed = borrowed.filter(item => item !== id);
      showToast("Кітап тізімнен қайтарылды");
    } else {
      borrowed.push(id);
      showToast("Кітап алу тізіміне қосылды 📚");
    }
  }

  saveData();
  renderBooks();
});

// Таңдаулыларды көрсету
favoritesBtn.addEventListener("click", () => {
  showFavorites = !showFavorites;

  favoritesBtn.style.background = showFavorites
    ? "#d4e9d9"
    : "";

  favoritesBtn.setAttribute(
    "aria-pressed",
    String(showFavorites)
  );

  favoritesBtn.firstChild.textContent = showFavorites
    ? "♥ Таңдаулыларды жабу "
    : "♥ Таңдаулылар ";

  renderBooks();

  document.getElementById("books").scrollIntoView({
    behavior: "smooth"
  });
});

// Сайтты іске қосу
renderBooks();
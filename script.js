
const booksList = document.querySelector('#booksList');
const registerForm = document.querySelector('#register');
const newTitle = document.querySelector('#newTitle');
const newAuthor = document.querySelector('#newAuthor');
const newYear = document.querySelector('#newYear');
const newFormat = document.querySelector('#newFormat');
const dimensioneMB = document.querySelector('#dimensione');
const campoDimensione = document.querySelector('#campo-dimensione');

const newBooks = [];

// === Classi ===

class Book {
    read = false;

    constructor(_booksTitle, _booksAuthor, _booksYear, _booksFormat) {
        this.booksId = crypto.randomUUID();
        this.booksTitle = _booksTitle;
        this.booksAuthor = _booksAuthor;
        this.booksYear = _booksYear;
        this.booksFormat = _booksFormat;
    }

    markAsRead() {
        this.read = true;
    }

    printBooks() {
        const state = this.read ? "letto" : "da leggere";

        return `${this.booksTitle} (${this.booksYear}) - ${state}`;
    }
}

class DigitalBook extends Book {
    constructor(_booksTitle, _booksAuthor, _booksYear, _booksFormat, _dimensioneMB) {
        super(_booksTitle, _booksAuthor, _booksYear, _booksFormat);
        this.dimensioneMB = _dimensioneMB;
    }

    printBooks() {
        const state = this.read ? "letto" : "da leggere";

        return `${this.booksTitle} (${this.booksYear}), formato digitale (${this.dimensioneMB} MB) - ${state}`;
    }
}

// === Render ===

function renderBooks() {
    booksList.innerHTML = newBooks.map((book) => {
        return `
            <li>
                ${book.printBooks()}
                ${book.read ? '✓ Letto' : `
                    <button data-id="${book.booksId}">
                        Segna come letto
                    </button>
                `}
            </li>
        `;
    }).join('');
}

// === Submit e Change===

campoDimensione.hidden = true;

newFormat.addEventListener('change', () => {
    campoDimensione.hidden = newFormat.value !== 'D';
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let newBook;

    if (newFormat.value === 'D') {
        newBook = new DigitalBook(
            newTitle.value,
            newAuthor.value,
            newYear.value,
            newFormat.value,
            dimensioneMB.value
        );
    } else {
        newBook = new Book(
            newTitle.value,
            newAuthor.value,
            newYear.value,
            newFormat.value
        );
    }

    newBooks.push(newBook);
    renderBooks();
    registerForm.reset();
});

// === Event delegation ===

booksList.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const id = button.dataset.id;
    const book = newBooks.find((book) => book.booksId === id);

    if (book) {
        book.markAsRead();
        renderBooks();
    }
});

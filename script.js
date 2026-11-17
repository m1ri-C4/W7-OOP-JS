
const booksList = document.querySelector('#booksList');
const registerForm = document.querySelector('#register');
const newTitle = document.querySelector('#newTitle');
const newAuthor = document.querySelector('#newAuthor');
const newYear = document.querySelector('#newYear');
const newFormat = document.querySelector('#newFormat');
const dimensioneMB = document.querySelector('#dimensione');
const campoDimensione = document.querySelector('#campo-dimensione');
const booksCount = document.querySelector('#booksCount');
const deleteAll = document.querySelector('#deleteAll');



//const newBooks = [];

// === Local Storage ===
function saveBooks() {
    localStorage.setItem('libri', JSON.stringify(newBooks));
}

function loadBooks() {
    return JSON.parse(localStorage.getItem('libri') ?? '[]');
}

const newBooks = loadBooks();

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
    booksList.replaceChildren();

    newBooks.forEach((book) => {

        // CARD PRINCIPALE
        const li = document.createElement('li');
        li.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'p-4',
            'mb-3',
            'rounded-3',
            'shadow-sm',
            'border',
            'border-0',
            'border-start',
            'border-4'
        );
        //CONTATORE
        booksCount.textContent = newBooks.length;

        li.classList.add(book.read ? 'border-success' : 'border-primary');

        // CONTENITORE INFORMAZIONI
        const bookInfo = document.createElement('div');

        // RIGA TITOLO + BADGE
        const titleRow = document.createElement('div');
        titleRow.classList.add('d-flex', 'align-items-center', 'gap-2', 'flex-wrap');

        // TITOLO
        const title = document.createElement('h5');
        title.classList.add('fw-bold', 'mb-0');
        title.textContent = book.booksTitle;

        // BADGE FORMATO
        const badge = document.createElement('span');
        badge.classList.add('badge', 'rounded-pill', 'bg-secondary-subtle', 'text-secondary');

        if (book.booksFormat === 'D') {
            badge.textContent = `digitale (${book.dimensioneMB} MB)`;
        } else {
            badge.textContent = 'cartaceo';
        }

        titleRow.appendChild(title);
        titleRow.appendChild(badge);

        // AUTORE E ANNO
        const details = document.createElement('p');
        details.classList.add('text-secondary', 'mb-0', 'mt-2');
        details.textContent = `${book.booksAuthor} — ${book.booksYear}`;

        bookInfo.appendChild(titleRow);
        bookInfo.appendChild(details);

        // CONTENITORE PULSANTI
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('d-flex', 'align-items-center', 'gap-2');

        // STATO LETTURA
        if (book.read) {

            const readText = document.createElement('span');
            readText.classList.add('text-success', 'text-nowrap');
            readText.textContent = '✓ letto';

            buttonsContainer.appendChild(readText);

        } else {

            const readButton = document.createElement('button');
            readButton.classList.add('btn', 'btn-outline-secondary', 'text-nowrap');
            readButton.textContent = 'Segna come letto';
            readButton.dataset.id = book.booksId;

            buttonsContainer.appendChild(readButton);
        }

        // TASTO RIMUOVI
        const deleteBook = document.createElement('button');
        deleteBook.classList.add('btn', 'btn-danger');
        deleteBook.textContent = 'Elimina';

        //elimina il libro
        deleteBook.addEventListener('click', () => {
            const index = newBooks.findIndex((item) => item.booksId === book.booksId);

            if (index !== -1) {
                newBooks.splice(index, 1);
                saveBooks();
                renderBooks();
            }
        });

        buttonsContainer.appendChild(deleteBook);

        // AGGIUNGO GLI ELEMENTI ALLA CARD
        li.appendChild(bookInfo);
        li.appendChild(buttonsContainer);

        booksList.appendChild(li);
    });
};

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
    saveBooks();
    renderBooks();
    registerForm.reset();
    campoDimensione.hidden = true;
});

// === Event delegation ===

booksList.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const id = button.dataset.id;
    const book = newBooks.find((book) => book.booksId === id);

    if (book) {
        book.read = true;
        saveBooks();
        renderBooks();
    }
});

// === Elimina tutti i libri ===
deleteAll.addEventListener('click', () => {
    localStorage.removeItem('libri');
    newBooks.length = 0;
    renderBooks();
});
renderBooks(); 
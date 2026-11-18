// === SELETTORI DOM ===

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


// === CLASSI ===

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


// === LOCAL STORAGE ===

function saveBooks() {
    localStorage.setItem('libri', JSON.stringify(newBooks));
}

function loadBooks() {
    const libri = JSON.parse(localStorage.getItem('libri') ?? '[]');

    return libri.map((libro) => {
        let book;

        if (libro.booksFormat === 'D') {
            book = new DigitalBook(
                libro.booksTitle,
                libro.booksAuthor,
                libro.booksYear,
                libro.booksFormat,
                libro.dimensioneMB
            );
        } else {
            book = new Book(
                libro.booksTitle,
                libro.booksAuthor,
                libro.booksYear,
                libro.booksFormat
            );
        }

        book.booksId = libro.booksId;
        book.read = libro.read;

        return book;
    });
}

const newBooks = loadBooks();


// === RENDER LIBRI ===

function renderBooks() {
    booksList.replaceChildren();

    // CONTATORE
    booksCount.textContent = newBooks.length;

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

        li.classList.add(book.read ? 'border-success' : 'border-primary');

        // CONTENITORE INFORMAZIONI
        const bookInfo = document.createElement('div');

        // RIGA TITOLO + BADGE
        const titleRow = document.createElement('div');

        titleRow.classList.add(
            'd-flex',
            'align-items-center',
            'gap-2',
            'flex-wrap'
        );

        // TITOLO
        const title = document.createElement('h5');

        title.classList.add('fw-bold', 'mb-0');
        title.textContent = book.booksTitle;

        // BADGE FORMATO
        const badge = document.createElement('span');

        badge.classList.add(
            'badge',
            'rounded-pill',
            'bg-secondary-subtle',
            'text-secondary'
        );

        if (book.booksFormat === 'D') {
            badge.textContent = `digitale (${book.dimensioneMB} MB)`;
        } else {
            badge.textContent = 'cartaceo';
        }

        titleRow.appendChild(title);
        titleRow.appendChild(badge);

        // AUTORE E ANNO
        const details = document.createElement('p');

        details.classList.add(
            'text-secondary',
            'mb-0',
            'mt-2'
        );

        details.textContent = `${book.booksAuthor} — ${book.booksYear}`;

        bookInfo.appendChild(titleRow);
        bookInfo.appendChild(details);

        // CONTENITORE PULSANTI
        const buttonsContainer = document.createElement('div');

        buttonsContainer.classList.add(
            'd-flex',
            'align-items-center',
            'gap-2'
        );

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
        deleteBook.classList.add('btn', 'btn-outline-danger');
        deleteBook.textContent = 'Rimuovi';

        // ELIMINA IL LIBRO
        deleteBook.addEventListener('click', () => {

            const index = newBooks.findIndex(
                (item) => item.booksId === book.booksId
            );

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
}


// === SUBMIT E CHANGE ===

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


// === EVENT DELEGATION ===

booksList.addEventListener('click', (e) => {

    const button = e.target.closest('button');
    if (!button) return;
    const id = button.dataset.id;
    if (!id) return;

    const book = newBooks.find(
        (book) => book.booksId === id
    );

    if (book) {
        book.markAsRead();
        saveBooks();
        renderBooks();
    }
});


// === ELIMINA TUTTI I LIBRI ===

deleteAll.addEventListener('click', () => {
    localStorage.removeItem('libri');
    newBooks.length = 0;
    renderBooks();
});

renderBooks();


// === RICERCA LIBRI CON FETCH API ===

const API = "https://openlibrary.org/search.json";
const loading = document.querySelector('#loading');
const input = document.querySelector('#search input');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const message = document.querySelector('#message');

let controller;
let timeoutId;


// === MOSTRA / NASCONDI SPINNER ===

function showLoading() {
    loading.classList.remove('d-none');
    loading.classList.add('d-flex');
}

function hideLoading() {
    loading.classList.add('d-none');
    loading.classList.remove('d-flex');
}


// === RENDER RISULTATI API ===

function renderResults(libri) {

    const elements = libri.map((libro) => {

        const author = libro.author_name?.[0] ?? "Autore sconosciuto";
        const year = libro.first_publish_year ?? "?";

        // CARD PRINCIPALE
        const li = document.createElement("li");

        li.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'gap-3',
            'p-3',
            'mb-2',
            'rounded-3',
            'shadow-sm',
            'border-start',
            'border-4',
            'border-primary'
        );

        // CONTENITORE INFORMAZIONI
        const bookInfo = document.createElement('div');

        // TITOLO
        const title = document.createElement('h5');

        title.classList.add('fw-bold', 'mb-0');
        title.textContent = libro.title;

        // AUTORE E ANNO
        const details = document.createElement('p');

        details.classList.add(
            'text-secondary',
            'mb-0',
            'mt-2'
        );

        details.textContent = `${author} — ${year}`;

        bookInfo.appendChild(title);
        bookInfo.appendChild(details);

        // PULSANTE AGGIUNGI
        const addButton = document.createElement('button');

        addButton.classList.add(
            'btn',
            'btn-success',
            'text-nowrap'
        );

        addButton.textContent = 'Aggiungi';

        // CONTROLLO SE IL LIBRO È GIÀ SALVATO
        const alreadyAdded = newBooks.some((book) =>
            book.booksTitle === libro.title &&
            book.booksAuthor === author
        );

        if (alreadyAdded) {
            addButton.textContent = '✓ Aggiunto';
            addButton.disabled = true;
            addButton.classList.replace('btn-success', 'btn-secondary');
        }

        // AGGIUNGI IL LIBRO ALLA LIBRERIA
        addButton.addEventListener('click', () => {

            const newBook = new Book(
                libro.title,
                author,
                year,
                'C'
            );

            newBooks.push(newBook);

            saveBooks();
            renderBooks();

            addButton.textContent = '✓ Aggiunto';
            addButton.disabled = true;

            addButton.classList.replace(
                'btn-success',
                'btn-secondary'
            );
        });

        // AGGIUNGO GLI ELEMENTI ALLA CARD
        li.appendChild(bookInfo);
        li.appendChild(addButton);

        return li;
    });

    // STAMPA DEI RISULTATI
    results.replaceChildren(...elements);

    if (!libri.length) {
        message.textContent = "Nessun libro trovato";
    } else {
        message.textContent = "";
    }
}


// === FETCH API ===

function cerca(query) {

    // ANNULLA LA RICHIESTA PRECEDENTE
    controller?.abort();
    controller = new AbortController();
    const richiestaCorrente = controller;

    // CREAZIONE URL
    const url = new URL(API);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", 10);

    // MOSTRA CARICAMENTO
    showLoading();
    message.textContent = "";

    // RICHIESTA HTTP
    fetch(url, { signal: richiestaCorrente.signal })

        .then((response) => {

            if (!response.ok) {
                throw new Error(`Errore HTTP ${response.status}`);
            }
            return response.json();
        })

        .then((dati) => {

            if (richiestaCorrente.signal.aborted) {
                return;
            }
            renderResults(dati.docs);
        })

        .catch((errore) => {

            if (errore.name === "AbortError") {
                return;
            }
            if (richiestaCorrente.signal.aborted) {
                return;
            }
            message.textContent = errore.message;
        })

        .finally(() => {
            if (!richiestaCorrente.signal.aborted) {
                hideLoading();
            }
        });
}


// === DEBOUNCE ===

input.addEventListener("input", (e) => {

    clearTimeout(timeoutId);
    // ANNULLA SUBITO LA RICERCA PRECEDENTE
    controller?.abort();

    hideLoading();
    const query = e.target.value.trim();

    if (!query) {
        results.replaceChildren();
        message.textContent = "";
        return;
    }
    timeoutId = setTimeout(() => {
        cerca(query);
    }, 400);
});


// === SUBMIT RICERCA ===

search.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timeoutId);
    const query = input.value.trim();
    if (!query) return;
    cerca(query);
});
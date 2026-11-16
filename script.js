// Mini-libreria — Settimana VII Giorno I
//
// Devi fare 4 cose:
// 1. Definire una classe Libro (titolo, autore, anno, letto)
// 2. Definire una classe LibroDigitale che estende Libro (aggiunge formato, dimensioneMb)
// 3. Aggiungere un listener al form che crea una nuova istanza e la aggiunge all'array
// 4. Renderizzare la lista nel <ul id="lista-libri"> via innerHTML
//
// Bonus: bottone "Segna come letto" su ogni elemento, gestito con event delegation.

const booksList = document.querySelector('#booksList');
const registerForm = document.querySelector('#register');
const newTitle = document.querySelector('#newTitle');
const newAuthor = document.querySelector('#newAuthor');
const newYear = document.querySelector('#newYear');
const newFormat = document.querySelector('#newFormat');

const newBooks = [];

// === Classi ===
class Book {
    constructor( _booksTitle, _booksAuthor, _booksYear) {
        //this.#booksId = crypto.randomUUID;
        this.booksTitle = _booksTitle;
        this.booksAuthor = _booksAuthor;
        this.booksYear = _booksYear;
    }
    printBooks(){
       // const myFormat = this.booksFormat ? 'Carteceo' : 'Digitale';
		const newLi = document.createElement('li');
		newLi.textContent += `${this.booksTitle} ${this.booksAuthor} ${this.booksYear}`;
		booksList.appendChild(newLi);
    }
}

class DigitalBook extends Book {
    constructor(_booksId, _booksTitle, _booksAuthor, _booksYear, _booksFormat, _dimensionMB) {
        this.booksFormat = _booksFormat;
        this.dimensionMB = _dimensionMB;
    }
}

registerForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const newBook = new Book(
		newTitle.value,
		newAuthor.value,
		newYear.value,
		newFormat.value,
	);
	console.log(newBook);
    newBook.printBooks();
	newBooks.push(newBook);
});

// === Stato (array di libri) ===


// === Render ===



// === Eventi ===

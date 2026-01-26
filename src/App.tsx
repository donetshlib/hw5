import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Grid, Typography, Button, TextField, Paper } from "@mui/material";

type Book = {
  id: string;
  name: string;
  author: string;
  imgUrl: string;
  genre: string;
  rating: number;
  description: string;
  isRead: boolean;
};

const PLACEHOLDER_IMG = "https://via.placeholder.com/90x120.png?text=Book";

export default function App() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      name: "Clean Code",
      author: "Robert C. Martin",
      imgUrl: PLACEHOLDER_IMG,
      genre: "Programming",
      rating: 4.7,
      description: "How to write clean, maintainable code.",
      isRead: false,
    },
    {
      id: "2",
      name: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      imgUrl: PLACEHOLDER_IMG,
      genre: "Programming",
      rating: 4.6,
      description: "Practical advice for software developers.",
      isRead: true,
    },
  ]);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newRating, setNewRating] = useState<string>("");
  const [newDescription, setNewDescription] = useState("");

  // componentDidMount
  useEffect(() => {
    console.log("BooksApp mounted");
  }, []);

  // componentDidUpdate logs
  const prevRef = useRef({ books, filter, selectedBookId });

  useEffect(() => {
    const prev = prevRef.current;
    if (prev.books !== books) console.log("books changed", books);
    if (prev.filter !== filter) console.log("filter changed", filter);
    if (prev.selectedBookId !== selectedBookId) console.log("selectedBookId changed", selectedBookId);
    prevRef.current = { books, filter, selectedBookId };
  }, [books, filter, selectedBookId]);

  const filteredBooks = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [books, filter]);

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return books.find((b) => b.id === selectedBookId) ?? null;
  }, [books, selectedBookId]);

  function addBook() {
    const name = newName.trim();
    const author = newAuthor.trim();
    const genre = newGenre.trim();
    const description = newDescription.trim();

    if (!name || !author || !genre || !description) {
      alert("Заповни всі поля: ім’я, автор, жанр, рейтинг, опис");
      return;
    }

    const ratingNum = Number(newRating);
    if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      alert("Рейтинг має бути числом від 0 до 5");
      return;
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      name,
      author,
      imgUrl: PLACEHOLDER_IMG,
      genre,
      rating: ratingNum,
      description,
      isRead: false,
    };

    setBooks((prev) => [newBook, ...prev]);

    setNewName("");
    setNewAuthor("");
    setNewGenre("");
    setNewRating("");
    setNewDescription("");
  }

  function toggleRead(bookId: string) {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, isRead: !b.isRead } : b)));
  }

  // ----------------------------
  // Page: Details
  // ----------------------------
  if (selectedBookId && selectedBook) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Сторінка книги
        </Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4}>
              <img
                src={selectedBook.imgUrl}
                alt="book"
                style={{ width: "100%", maxWidth: 220, borderRadius: 8 }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography>
                <b>Ім’я:</b> {selectedBook.name}
              </Typography>
              <Typography>
                <b>Автор:</b> {selectedBook.author}
              </Typography>
              <Typography>
                <b>Жанр:</b> {selectedBook.genre}
              </Typography>
              <Typography>
                <b>Рейтинг:</b> ⭐ {selectedBook.rating}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <b>Опис:</b> {selectedBook.description}
              </Typography>

              <label style={{ display: "block", marginTop: 12 }}>
                <input
                  type="checkbox"
                  checked={selectedBook.isRead}
                  onChange={() => toggleRead(selectedBook.id)}
                />{" "}
                прочитано
              </label>

              <Button sx={{ mt: 2 }} variant="contained" onClick={() => setSelectedBookId(null)}>
                Назад до списку
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  // ----------------------------
  // Page: List
  // ----------------------------
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        BooksApp
      </Typography>

      <TextField
        fullWidth
        label="Фільтр за id, name, author"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Додати нову книгу
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Ім’я" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Автор" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Жанр" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Рейтинг (0..5)"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Опис"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={addBook}>
              Додати
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Список книг
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Grid container>
              <Grid item xs={12} sm={5}>
                <Typography fontWeight={700}>Назва</Typography>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography fontWeight={700}>Автор</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography fontWeight={700}>Рейтинг</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {filteredBooks.map((b) => (
          <Grid item xs={12} key={b.id}>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <Typography fontWeight={600}>{b.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Typography>{b.author}</Typography>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <Typography>⭐ {b.rating}</Typography>
                </Grid>

                <Grid item xs={6} sm="auto">
                  <Button size="small" variant="contained" onClick={() => setSelectedBookId(b.id)}>
                    Деталі
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}

        {filteredBooks.length === 0 && (
          <Grid item xs={12}>
            <Typography sx={{ opacity: 0.7 }}>Нічого не знайдено</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

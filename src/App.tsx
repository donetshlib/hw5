import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Grid, Typography, Button, TextField, Paper, Checkbox, FormControlLabel } from "@mui/material";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchBooks, addBook, toggleRead, type BookDto } from "./store/booksSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.books.items);
  const status = useAppSelector((s) => s.books.status);
  const error = useAppSelector((s) => s.books.error);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  // ✅ DTO вместо 5 useState
  const [dto, setDto] = useState<BookDto>({
    name: "",
    author: "",
    genre: "",
    rating: "",
    description: "",
  });

  // componentDidMount
  useEffect(() => {
    console.log("BooksApp mounted");
    dispatch(fetchBooks()); // thunk: загрузка "с сервера"
  }, [dispatch]);

  // componentDidUpdate (log changes)
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

  function onDtoChange<K extends keyof BookDto>(key: K, value: BookDto[K]) {
    setDto((p) => ({ ...p, [key]: value }));
  }

  function onAdd() {
    dispatch(addBook(dto));
    setDto({ name: "", author: "", genre: "", rating: "", description: "" });
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
              <Typography><b>Ім’я:</b> {selectedBook.name}</Typography>
              <Typography><b>Автор:</b> {selectedBook.author}</Typography>
              <Typography><b>Жанр:</b> {selectedBook.genre}</Typography>
              <Typography><b>Рейтинг:</b> ⭐ {selectedBook.rating}</Typography>

              <Typography sx={{ mt: 1 }}><b>Опис:</b> {selectedBook.description}</Typography>

              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    checked={selectedBook.isRead}
                    onChange={() => dispatch(toggleRead(selectedBook.id))}
                  />
                }
                label="прочитано"
              />

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
            <TextField fullWidth label="Ім’я" value={dto.name} onChange={(e) => onDtoChange("name", e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Автор" value={dto.author} onChange={(e) => onDtoChange("author", e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Жанр" value={dto.genre} onChange={(e) => onDtoChange("genre", e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Рейтинг (0..5)" value={dto.rating} onChange={(e) => onDtoChange("rating", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Опис" value={dto.description} onChange={(e) => onDtoChange("description", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={onAdd}>
              Додати
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Список книг
      </Typography>

      {status === "loading" && <Typography sx={{ opacity: 0.7 }}>Завантаження...</Typography>}
      {status === "failed" && <Typography color="error">Помилка: {error}</Typography>}

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ display: { xs: "none", sm: "block" } }}>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item sm={5}><Typography fontWeight={700}>Назва</Typography></Grid>
              <Grid item sm={5}><Typography fontWeight={700}>Автор</Typography></Grid>
              <Grid item sm={2}><Typography fontWeight={700}>Рейтинг</Typography></Grid>
            </Grid>
          </Paper>
        </Grid>

        {filteredBooks.map((b) => (
          <Grid item xs={12} key={b.id}>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}><Typography fontWeight={600}>{b.name}</Typography></Grid>
                <Grid item xs={12} sm={5}><Typography>{b.author}</Typography></Grid>
                <Grid item xs={6} sm={2}><Typography>⭐ {b.rating}</Typography></Grid>
                <Grid item xs={6} sm="auto">
                  <Button fullWidth size="small" variant="contained" onClick={() => setSelectedBookId(b.id)}>
                    Деталі
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}

        {filteredBooks.length === 0 && status !== "loading" && (
          <Grid item xs={12}><Typography sx={{ opacity: 0.7 }}>Нічого не знайдено</Typography></Grid>
        )}
      </Grid>
    </Container>
  );
}

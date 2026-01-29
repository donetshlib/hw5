import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Book = {
  id: string;
  name: string;
  author: string;
  imgUrl: string;
  genre: string;
  rating: number;
  description: string;
  isRead: boolean;
};

// ✅ DTO: одно “пакетное” значение из формы
export type BookDto = {
  name: string;
  author: string;
  genre: string;
  rating: string;        // удобно хранить строкой из input
  description: string;
};

const PLACEHOLDER_IMG =
  "https://img.freepik.com/free-vector/blue-text-book-library-icon_24877-83092.jpg?semt=ais_hybrid&w=740&q=80";

// ✅ thunk: загрузка с "сервера" (vite dev server отдаёт public/books.json)
export const fetchBooks = createAsyncThunk<Book[]>(
  "books/fetchBooks",
  async () => {
    const res = await fetch("/books.json");
    if (!res.ok) throw new Error("Failed to fetch books");
    return (await res.json()) as Book[];
  }
);

type BooksState = {
  items: Book[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: BooksState = {
  items: [],
  status: "idle",
  error: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<BookDto>) => {
      const dto = action.payload;

      const ratingNum = Number(dto.rating);
      if (!dto.name || !dto.author || !dto.genre || !dto.description) return;
      if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) return;

      state.items.unshift({
        id: crypto.randomUUID(),
        name: dto.name.trim(),
        author: dto.author.trim(),
        genre: dto.genre.trim(),
        rating: ratingNum,
        description: dto.description.trim(),
        imgUrl: PLACEHOLDER_IMG,
        isRead: false,
      });
    },
    toggleRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const b = state.items.find((x) => x.id === id);
      if (b) b.isRead = !b.isRead;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { addBook, toggleRead } = booksSlice.actions;
export default booksSlice.reducer;

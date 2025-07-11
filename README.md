# RateMyPets - React Application

Aplikasi React untuk berbagi cerita dan rating hewan peliharaan dengan implementasi global state management menggunakan Redux Toolkit.

## Fitur Utama

- **Global State Management**: Menggunakan Redux Toolkit untuk menghindari props drilling
- **Authentication**: Login, register, dan OAuth dengan Google
- **Post Management**: Create, read, update, delete posts
- **Like System**: Like dan unlike posts
- **Comments**: Sistem komentar untuk setiap post
- **Responsive Design**: Mobile-first design dengan Tailwind CSS
- **Pagination**: Navigasi halaman untuk posts

## Struktur State Management

### Redux Store Structure

```
store/
├── store.js          # Konfigurasi Redux store
└── slices/
    ├── authSlice.js  # State untuk authentication
    ├── postsSlice.js # State untuk posts dan comments
    └── uiSlice.js    # State untuk UI components
```

### Auth Slice

- User authentication state
- Login/logout functionality
- Token management
- User profile data

### Posts Slice

- Posts data management
- CRUD operations untuk posts
- Like/unlike functionality
- Comments management
- Pagination state

### UI Slice

- Modal states (forgot password, post form)
- Loading states
- Notifications
- Dark mode toggle
- Mobile menu state

## Keuntungan Implementasi Redux

### 1. Menghindari Props Drilling

Sebelumnya, data user dan state lainnya harus di-pass melalui props dari komponen parent ke child. Sekarang semua komponen dapat mengakses state langsung dari Redux store.

**Sebelum:**

```jsx
// App.jsx
<NavBar
  user={user}
  onLogout={handleLogout}
  onOpenPostForm={handleOpenPostForm}
/>;

// Navbar.jsx
function NavBar({ user, onLogout, onOpenPostForm }) {
  // Menggunakan props
}
```

**Sesudah:**

```jsx
// App.jsx
<NavBar />;

// Navbar.jsx
function NavBar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // Mengakses state langsung dari Redux
}
```

### 2. Centralized State Management

Semua state aplikasi dikelola secara terpusat di Redux store, membuat debugging dan maintenance lebih mudah.

### 3. Predictable State Updates

Menggunakan Redux Toolkit dengan createSlice memastikan state updates yang predictable dan immutable.

### 4. Performance Optimization

Redux Toolkit menggunakan Immer untuk immutable updates yang efisien.

## Komponen yang Diperbarui

### 1. App.jsx

- Menghapus local state management
- Menggunakan Redux selectors untuk auth state
- Menghilangkan props drilling

### 2. Navbar.jsx

- Menggunakan Redux untuk user data dan UI state
- Dispatch actions untuk logout dan post form

### 3. Login.jsx & Register.jsx

- Menggunakan Redux actions untuk authentication
- Error handling melalui Redux state

### 4. Feed.jsx

- Menggunakan Redux untuk posts data
- Dispatch actions untuk like, delete, edit posts
- Pagination state management

### 5. PostForm.jsx

- Redux state untuk editing post
- Create/update post actions

## Cara Menjalankan

1. Install dependencies:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka browser dan akses `http://localhost:5173`

## Teknologi yang Digunakan

- **React 18** - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build Tool

## Struktur Komponen

```
src/
├── components/       # React components
├── store/           # Redux store dan slices
├── api/             # API functions
├── utils/           # Utility functions
└── assets/          # Static assets
```

## Best Practices yang Diterapkan

1. **Selector Pattern**: Menggunakan selectors untuk mengakses state
2. **Action Creators**: Menggunakan createAsyncThunk untuk async actions
3. **Error Handling**: Centralized error handling di Redux
4. **Loading States**: Global loading state management
5. **Immutable Updates**: Menggunakan Immer untuk safe state updates

## Keuntungan Arsitektur Baru

- **Maintainability**: Kode lebih mudah di-maintain
- **Scalability**: Mudah menambah fitur baru
- **Debugging**: Redux DevTools untuk debugging
- **Testing**: Unit testing lebih mudah dengan Redux
- **Performance**: Optimized re-renders dengan useSelector
# mypets

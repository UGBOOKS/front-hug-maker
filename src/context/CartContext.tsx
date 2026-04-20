import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Book } from '@/types/book';
import { BOOK_CONDITIONS } from '@/types/book';

export interface CartLine {
  bookId: string;
  quantity: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  condition: string;
}

const STORAGE_KEY = 'ug-books-cart';

function loadInitial(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (book: Book, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((book: Book, quantity = 1) => {
    const conditionLabel =
      BOOK_CONDITIONS.find((c) => c.value === book.condition)?.label ?? book.condition;
    setItems((prev) => {
      const existing = prev.find((l) => l.bookId === book.id);
      if (existing) {
        return prev.map((l) =>
          l.bookId === book.id
            ? { ...l, quantity: l.quantity + quantity, price: book.price }
            : l
        );
      }
      return [
        ...prev,
        {
          bookId: book.id,
          quantity,
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
          price: book.price,
          condition: conditionLabel,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((l) => l.bookId !== bookId));
      return;
    }
    setItems((prev) =>
      prev.map((l) => (l.bookId === bookId ? { ...l, quantity } : l))
    );
  }, []);

  const removeItem = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((l) => l.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (bookId: string) => items.some((l) => l.bookId === bookId),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, l) => sum + l.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isInCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isInCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

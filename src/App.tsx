import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index";
import BookDetail from "./pages/BookDetail";
import BookPurchase from "./pages/BookPurchase";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import MyInfo from "./pages/MyInfo";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tutors from "./pages/Tutors";
import TutorDetail from "./pages/TutorDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ContactUs from "./pages/ContactUs";
import HowItWorks from "./pages/HowItWorks";
import BookConditionGuidelines from "./pages/BookConditionGuidelines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book/:id/buy" element={<BookPurchase />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-info" element={<MyInfo />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/book-condition" element={<BookConditionGuidelines />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutor/:id" element={<TutorDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

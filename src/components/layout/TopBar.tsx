import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2">
        <p className="text-primary-foreground/95">
          Welcome to <span className="font-semibold">UG Books</span> — buy and sell textbooks safely.
        </p>
        <div className="flex items-center gap-4 font-medium">
          <Link to="/login" className="hover:underline underline-offset-2">
            Sign in
          </Link>
          <span className="text-primary-foreground/40" aria-hidden>
            |
          </span>
          <Link to="/login" className="hover:underline underline-offset-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

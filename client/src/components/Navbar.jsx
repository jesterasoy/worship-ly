import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  // Common classes for NavLinks
  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-all duration-300 hover:text-green-400 ${isActive ? "text-green-500 border-b-2 border-green-500 pb-1" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center group">
          <div className="bg-green-500 p-1.5 rounded-lg mr-2 group-hover:rotate-12 transition-transform">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">
            Worship<span className="text-green-500">LY</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8 items-center">
        <NavLink to="/" className={navLinkClasses}>
          Home
        </NavLink>
        <NavLink to="/search" className={navLinkClasses}>
          Search
        </NavLink>
      </div>
    </nav>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Eventora
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-purple-600 font-medium"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/events"
                  className="text-white hover:text-purple-600 font-medium "
                >
                  Events
                </Link>
                <Link
                  to="/add-event"
                  className="text-white hover:text-purple-600 font-medium"
                >
                  Add Event
                </Link>
                <Link
                  to="/my-events"
                  className="text-white hover:text-purple-600 font-medium"
                >
                  My Events
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="text-white" />
              ) : (
                <Menu className="text-white" />
              )}
            </Button>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback className="gradient-primary text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="gradient-primary hover:opacity-90">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 text-center">
            <Link
              to="/"
              className="block px-3 py-2  text-white hover:text-purple-600 font-medium"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/events"
                  className="block px-3 py-2 text-white hover:text-purple-600 font-medium"
                >
                  Events
                </Link>
                <Link
                  to="/add-event"
                  className="block px-3 py-2 text-white hover:text-purple-600 font-medium"
                >
                  Add Event
                </Link>
                <Link
                  to="/my-events"
                  className="block px-3 py-2 text-white hover:text-purple-600 font-medium"
                >
                  My Events
                </Link>
              </>
            )}
            <div className="border-t border-gray-700/80 pt-1 ">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-3 py-2 text-white hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-white hover:text-purple-600 font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

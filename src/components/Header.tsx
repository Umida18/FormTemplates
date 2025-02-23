import { Button } from "antd";
import { User } from "firebase/auth";
import { BarChart3, ClipboardEdit, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const Header = () => {
  const navigate = useNavigate();
  const [haveToken, setHaveToken] = useState(false);
  const [user, setUser] = useState<User | null>();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const user: User | null = auth.currentUser;
      setUser(user);
      setHaveToken(true);
    } else {
      setUser(null);
      setHaveToken(false);
    }
  }, [token]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex py-4 xl:flex-row flex-col xl:items-center justify-between xl:px-8 mx-auto max-w-7xl px-4">
        <nav className="flex items-center justify-end space-x-6">
          <Link
            to="/templatesPage"
            className="flex items-center space-x-2 text-[#181836] hover:text-[#1a1b5e]"
          >
            <ClipboardEdit className="h-4 w-4" />
            <span>Templates</span>
          </Link>
          <Link
            to={`/filledUserTemplates/${user?.uid}`}
            className="flex items-center space-x-2 text-[#181836] hover:text-[#1a1b5e]"
          >
            <FileText className="h-4 w-4" />
            <span>Filled Templates</span>
          </Link>
          <Link
            to="/stats"
            className="flex items-center space-x-2 text-[#181836] hover:text-[#1a1b5e]"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Statistics</span>
          </Link>
        </nav>
        {haveToken ? (
          <div>
            <p className="text-[#181836] ">{user?.email}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/login")}
              className="px-6 !border-2 xl:min-w-[200px] !h-[50px] "
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              type="primary"
              className="xl:min-w-[200px]  !text-[20px] !h-[50px] "
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

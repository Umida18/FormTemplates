import { Button } from "antd";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div>
      <Header />
      <div className="max-w-7xl flex xl:flex-row flex-col py-5 items-center mx-auto">
        <div className="px-16">
          <p className="text-[46px] font-bold">Welcome!</p>
          <p className="text-gray-500 text-[20px]">
            You can create templates or fill in existing templates possible.
          </p>
          <Button
            onClick={() => navigate("/templatesPage")}
            className="!text-white !h-[55px] !px-6 !border-0 !text-[20px] !bg-[#1a1b5e] mt-4"
          >
            View templates
          </Button>
        </div>
        <div>
          <img
            src="https://img.freepik.com/premium-vector/online-testing-concept-illustration-with-characters-flat-design_198565-172.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

import { Button } from "antd";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div>
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
        <div></div>
      </div>
    </div>
  );
};

export default Home;

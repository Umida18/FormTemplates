import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ILogin } from "../../types/types";
import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "antd/es/form/Form";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = useForm();

  const handleFinish = async (values: ILogin) => {
    try {
      console.log("values", values);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      localStorage.setItem("token", token);

      message.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1b5e] p-12 flex-col justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">
            Create Custom Forms Easily
          </h1>
          <h2 className="text-indigo-200 text-xl mb-4">
            Build and share forms with just a few clicks
          </h2>
          <p className="text-indigo-100">
            Guide your users through a seamless form-filling experience
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="">
            <h2 className="text-2xl font-bold">Get started</h2>
          </div>

          <Form onFinish={handleFinish} className="space-y-4" form={form}>
            <Form.Item>
              <label
                htmlFor="email"
                className="block text-lg mb-1 font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                required
                className="mt-2 h-[50px]"
              />
            </Form.Item>

            <Form.Item>
              <label
                htmlFor="password"
                className="block text-lg mb-1 font-medium text-gray-700"
              >
                Password
              </label>
              <Input.Password
                id="password"
                name="password"
                required
                className="mt-1 h-[50px]"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                className="w-full !text-[20px] !h-[55px] !bg-[#1a1b5e]"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button, Form, Input, message } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useForm } from "antd/es/form/Form";
import { IRegister } from "../../types/types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form] = useForm();

  const handleFinish = async (values: IRegister) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      localStorage.setItem("token", token);

      message.success("Registration is successful!");
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
          <div>
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            <h2 className="mt-4 text-2xl font-bold">Create your account</h2>
          </div>

          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item
              label={
                <label
                  htmlFor="email"
                  className="block text-lg mb-1 font-medium text-gray-700"
                >
                  Email
                </label>
              }
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                placeholder="example@example.com"
                className="mt-2 h-[50px]"
              />
            </Form.Item>

            <Form.Item
              label={
                <label
                  htmlFor="email"
                  className="block text-lg mb-1 font-medium text-gray-700"
                >
                  Password
                </label>
              }
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password min={6} className="mt-1 h-[50px]" />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full !h-[55px] !text-[20px] !bg-[#1a1b5e]"
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

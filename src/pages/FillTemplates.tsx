import { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, message, Spin } from "antd";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  Type,
  Hash,
  ListChecks,
  ArrowLeft,
  Save,
  Loader,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { User } from "firebase/auth";
import { Template } from "../types/types";

const { Option } = Select;

export default function EditTemplates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const docRef = doc(db, "createTemplates", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Template;
          setTemplate({
            id: docSnap.id,
            title: data.title || "",
            topic: data.topic || "",
            questions: data.questions || [],
          });
        } else {
          message.error("Template not found");
        }
      } catch (error) {
        console.error("Error loading template:", error);
        message.error("Error loading template");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const onFinish = async (values: any) => {
    console.log("values", values);

    setSubmitting(true);
    try {
      const user: User | null = auth.currentUser;
      const userEmail = user?.email;
      const formattedAnswers = template?.questions.map((question, index) => ({
        question_id: index + 1,
        question: question.text,
        answer: values.answers?.[index] || "",
      }));
      console.log("formattedAnswers", formattedAnswers);

      const res = await addDoc(collection(db, "filledTemplates"), {
        submittedBy: userEmail,
        submittedAt: new Date().toISOString(),
        templateId: id,
        created_at: new Date().toISOString(),
        answers: formattedAnswers,
      });
      console.log("filledTemplates", res);

      message.success("Form submitted successfully");
      form.resetFields();
      navigate("/templatesPage");
    } catch (error) {
      console.error("Error submitting form: ", error);
      message.error("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />;
      case "number":
        return <Hash className="h-4 w-4" />;
      case "choice":
        return <ListChecks className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-500">Template not found</p>
          <Button onClick={() => navigate("/templatesPage")} className="mt-4">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  console.log("template", template);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button
                  icon={<ArrowLeft className="h-4 w-4" />}
                  onClick={() => navigate("/templatesPage")}
                  className="mb-4"
                >
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {template.title}
                </h1>
                <p className="text-gray-500 mt-1">
                  Fill in the form details below
                </p>
              </div>
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="space-y-6"
            >
              {template.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                >
                  <Form.Item
                    name={["answers", index]}
                    label={
                      <div className="flex items-center gap-2 text-gray-700">
                        {getQuestionIcon(question.type)}
                        <span>
                          {index + 1}. {question.text}
                        </span>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please answer this question",
                      },
                    ]}
                    className="mb-0"
                  >
                    {question.type === "text" && (
                      <Input className="mt-2" placeholder="Enter your answer" />
                    )}
                    {question.type === "number" && (
                      <InputNumber
                        className="mt-2 w-full"
                        placeholder="Enter a number"
                      />
                    )}
                    {question.type === "choice" && (
                      <Select className="mt-2" placeholder="Select an option">
                        {question.options?.map((option, optionIndex) => (
                          <Option key={optionIndex} value={option.title}>
                            {option.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-6 border-t">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !text-[20px] !h-[55px] !bg-[#1a1b5e] border-none px-6"
                  icon={
                    submitting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )
                  }
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  onClick={() => navigate("/templatesPage")}
                  className="px-6 !border-2 !border-[#1a1b5e] !h-[55px]"
                >
                  <X />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

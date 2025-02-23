import { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Header from "../components/Header";
import { User } from "firebase/auth";
import { IQuestion } from "../types/types";

const { Option } = Select;

export default function CreateTemplate() {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<IQuestion[]>([
    { type: "text", text: "", options: [] },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { type: "text", text: "", options: [] }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = [];
    }
    newQuestions[questionIndex].options?.push({ title: "" });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options?.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const onFinish = async (values: any) => {
    try {
      const user: User | null = auth.currentUser;
      if (!user) {
        message.error("You must be logged in to create a template.");
        return;
      }

      const docRef = await addDoc(collection(db, "createTemplates"), {
        title: values.title,
        topic: values.topic,
        questions: values.questions,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      });
      console.log("Template created with ID: ", docRef.id);
      message.success("Template created successfully");
      form.resetFields();
      setQuestions([{ type: "text", text: "", options: [] }]);
    } catch (error) {
      console.error("Error adding document: ", error);
      message.error("Failed to create template");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h1 className="text-[36px] font-bold mb-6 !text-[#1a1b5e]">
          Create Template
        </h1>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Template Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="topic"
            label="Topic"
            rules={[{ required: true, message: "Please select a topic" }]}
          >
            <Select>
              <Option value="general">General</Option>
              <Option value="education">Education</Option>
              <Option value="health">Health</Option>
              <Option value="technology">Technology</Option>
            </Select>
          </Form.Item>

          {questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="mb-6 p-4 border border-gray-200 rounded"
            >
              <Form.Item
                name={["questions", questionIndex, "text"]}
                label={`Question ${questionIndex + 1}`}
                rules={[{ required: true, message: "Please enter a question" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["questions", questionIndex, "type"]}
                label="Question Type"
                initialValue="text"
              >
                <Select
                  onChange={(value) => {
                    const newQuestions = [...questions];
                    newQuestions[questionIndex].type = value;
                    if (
                      value === "choice" &&
                      !newQuestions[questionIndex].options
                    ) {
                      newQuestions[questionIndex].options = [{ title: "" }];
                    }
                    setQuestions(newQuestions);
                  }}
                >
                  <Option value="text">Text</Option>
                  <Option value="number">Number</Option>
                  <Option value="choice">Multiple Choice</Option>
                </Select>
              </Form.Item>

              {question.type === "choice" && (
                <div className="ml-4">
                  <div className="font-medium mb-2">Options</div>
                  {question.options?.map((_, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <Form.Item
                        name={[
                          "questions",
                          questionIndex,
                          "options",
                          optionIndex,
                          "title",
                        ]}
                        className="mb-0 flex-1"
                        rules={[
                          {
                            required: true,
                            message: "Please enter an option title",
                          },
                        ]}
                      >
                        <Input placeholder={`Option ${optionIndex + 1}`} />
                      </Form.Item>
                      <Button
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="text-red-500"
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => addOption(questionIndex)}
                    className="w-full mt-2"
                    icon={<PlusOutlined />}
                  >
                    Add Option
                  </Button>
                </div>
              )}

              {questionIndex > 0 && (
                <Button
                  type="text"
                  onClick={() => removeQuestion(questionIndex)}
                  icon={<MinusCircleOutlined />}
                  className="text-red-500 mt-2"
                >
                  Remove Question
                </Button>
              )}
            </div>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={addQuestion}
              block
              icon={<PlusOutlined />}
              className="mb-4"
            >
              Add Question
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !text-[20px] !h-[55px]"
            >
              Create Template
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

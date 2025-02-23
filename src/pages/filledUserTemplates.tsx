import { useState } from "react";
import { Table, Input, Typography, Tag, message, Card } from "antd";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { Search, Calendar, Mail, FileText, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

const { Title } = Typography;

interface Answer {
  answer: string | number;
  question: string;
  question_id: number;
}

interface FilledTemplate {
  id: string;
  answers: { question_id: number; question: string; answer: string }[];
  created_at: string;
  submittedAt: string;
  submittedBy: string;
  templateId: string;
}

export default function FilledTemplates() {
  const [searchText, setSearchText] = useState("");

  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery<FilledTemplate[]>({
    queryKey: ["filledTemplates"],
    queryFn: async (): Promise<FilledTemplate[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "filledTemplates"));
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            answers: data.answers || [],
            created_at: data.created_at || "",
            submittedAt: data.submittedAt || "",
            submittedBy: data.submittedBy || "",
            templateId: data.templateId || "",
          } as FilledTemplate;
        });
      } catch (error) {
        message.error("Failed to fetch templates");
        throw error;
      }
    },
  });

  const formatDate = (date: Timestamp | string) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "PPp");
    }
    return format(new Date(date), "PPp");
  };

  const filteredTemplates = templates.filter((template: any) => {
    const matchesSearch =
      template.submittedBy.toLowerCase().includes(searchText.toLowerCase()) ||
      template.answers.some(
        (answer: any) =>
          answer.question.toLowerCase().includes(searchText.toLowerCase()) ||
          String(answer.answer).toLowerCase().includes(searchText.toLowerCase())
      );

    return matchesSearch;
  });

  const columns = [
    {
      title: "Submission Details",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (_: any, record: FilledTemplate) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(record.submittedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{record.submittedBy}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Answers",
      dataIndex: "answers",
      key: "answers",
      render: (answers: Answer[]) => (
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-3">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {answer.question}
              </p>
              <p className="text-sm text-gray-900">{answer.answer}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Template ID",
      dataIndex: "templateId",
      key: "templateId",
      render: (templateId: string) => (
        <Tag
          icon={<FileText className="h-3 w-3 mr-1" />}
          color="blue"
          className="px-2 py-1"
        >
          {templateId}
        </Tag>
      ),
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Error loading templates
          </h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-8">
              <Title level={2} className="!mb-2">
                Filled Templates
              </Title>
              <p className="text-gray-500">
                View and manage all submitted template responses
              </p>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search by email or answers..."
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-md"
                allowClear
              />
            </div>

            <div className="xl:block hidden">
              <Table
                dataSource={filteredTemplates}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} items`,
                }}
                className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50 [&_.ant-table-thead_.ant-table-cell]:font-medium"
              />
            </div>

            {/* Mobile Card View */}
            <div className="xl:hidden block space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} loading className="border border-gray-100" />
                  ))}
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div className="my-3">
                    <Card
                      key={template.id}
                      className="border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(template.submittedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{template.submittedBy}</span>
                            </div>
                          </div>

                          <Tag
                            icon={<FileText className="h-3 w-3 mr-1" />}
                            color="blue"
                            className="px-2 py-1"
                          >
                            {template.templateId}
                          </Tag>

                          {template.answers.length > 0 && (
                            <div className="border-l-2 border-blue-200 pl-3 mt-4">
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                {template.answers[0].question}
                              </p>
                              <p className="text-sm text-gray-900">
                                {template.answers[0].answer}
                              </p>
                              {template.answers.length > 1 && (
                                <p className="text-sm text-gray-500 mt-2">
                                  +{template.answers.length - 1} more answers
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

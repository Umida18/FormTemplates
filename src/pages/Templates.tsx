import { Button, Card, Spin, Tag } from "antd";
import { Plus, FileEdit, ClipboardList, Calendar, User } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useQuery } from "@tanstack/react-query";

const topicColors = {
  general: "blue",
  education: "green",
  health: "orange",
  technology: "purple",
};

export default function TemplatesPage() {
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    const querySnapshot = await getDocs(collection(db, "createTemplates"));
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const {
    data: createTemplates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["createTemplates"],
    queryFn: fetchTemplates,
  });
  console.log("error", error);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          An error occurred while loading templates!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-bold text-[#1a1b5e]">Templates</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your form templates
            </p>
          </div>
          <Button
            onClick={() => navigate("/createTemplates")}
            type="primary"
            className="flex items-center gap-2 !text-[20px] !h-[40px] !bg-[#1a1b5e] !border-0 px-4"
            icon={<Plus className="h-4 w-4" />}
          >
            New Template
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {createTemplates?.map((template, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
              bodyStyle={{ padding: "1.5rem" }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a1b5e] mb-2">
                      {template.title}
                    </h3>
                    <Tag
                      color={
                        topicColors[template.topic as keyof typeof topicColors]
                      }
                    >
                      {template.topic}
                    </Tag>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created:{" "}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {template.createdBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{template.createdBy}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-3 border-t">
                  <Button
                    onClick={() => navigate(`/fill/${template.id}`)}
                    className="flex items-center gap-2 flex-1"
                    icon={<FileEdit className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => navigate(`/editTemplates/${template.id}`)}
                    className="flex items-center gap-2 flex-1"
                    icon={<ClipboardList className="h-4 w-4" />}
                  >
                    Fill Form
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {createTemplates?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found</p>
            <p className="text-gray-400">
              Create your first template to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

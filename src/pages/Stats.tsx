import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { db } from "../services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Header from "../components/Header";

interface Answer {
  answer: string;
  question: string;
  question_id: number;
}

interface TemplateResponse {
  answers: Answer[];
  created_at: string;
  submittedAt: string;
  submittedBy: string;
  templateId: string;
}

export default function Statistics() {
  const [data, setData] = useState<TemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "filledTemplates"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const responses: TemplateResponse[] = [];
        snapshot.forEach((doc) => {
          responses.push(doc.data() as TemplateResponse);
        });
        setData(responses);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const totalResponses = data.length;
  const averageAge =
    data.reduce((acc, curr) => {
      const age = Number.parseInt(curr.answers[0]?.answer || "0");
      return acc + age;
    }, 0) / totalResponses || 0;

  const responsesByDate = data.reduce((acc: Record<string, number>, curr) => {
    try {
      const date = format(new Date(curr.submittedAt), "MMM dd");
      acc[date] = (acc[date] || 0) + 1;
    } catch (e) {
      console.error("Error parsing date:", e);
    }
    return acc;
  }, {});

  const chartData = Object.entries(responsesByDate).map(([date, count]) => ({
    date,
    responses: count,
  }));

  const formatLatestDate = () => {
    if (data.length === 0) return "-";

    try {
      const latestResponse = data[data.length - 1];
      if (!latestResponse.submittedAt) return "-";

      return format(new Date(latestResponse.submittedAt), "MMM dd, HH:mm");
    } catch (e) {
      console.error("Error formatting latest date:", e);
      return "-";
    }
  };

  const formatTableDate = (dateString: string) => {
    try {
      if (!dateString) return "-";
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (e) {
      console.error("Error formatting table date:", e);
      return "-";
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Form Response Statistics
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Responses
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalResponses}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Average Age
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {isNaN(averageAge) ? "-" : averageAge.toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Latest Response
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatLatestDate()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Responses Over Time
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="responses"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Responses
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Submitted By
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Age
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Question
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-5).map((response, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {response.submittedBy}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {response.answers[0]?.answer}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {response.answers[0]?.question}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatTableDate(response.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

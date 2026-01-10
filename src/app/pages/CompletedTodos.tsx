import { useNavigate } from "react-router-dom";
import { Todo, Label, Status } from "../types/todo";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface CompletedTodosProps {
  todos: Todo[];
  labels: Label[];
}

export function CompletedTodos({ todos, labels }: CompletedTodosProps) {
  const navigate = useNavigate();
  const completedTodos = todos.filter((todo) => todo.completed);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "中";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status?: Status) => {
    if (!status) return null;
    switch (status) {
      case "not_started":
        return "未着手";
      case "in_progress":
        return "進行中";
      case "almost_done":
        return "ほぼ完了";
      case "stopped":
        return "停止中";
      default:
        return null;
    }
  };

  const getStatusColor = (status?: Status) => {
    if (!status) return "";
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "almost_done":
        return "bg-green-100 text-green-700";
      case "stopped":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="size-4 mr-2" />
          戻る
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-gray-800 mb-6">
          完了したタスク ({completedTodos.length}件)
        </h2>

        {completedTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            完了したタスクはありません
          </div>
        ) : (
          <div className="space-y-4">
            {completedTodos.map((todo) => {
              const todoLabels = labels.filter((label) =>
                todo.labels?.includes(label.id)
              );

              return (
                <div
                  key={todo.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-gray-600 line-through">
                          {todo.text}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {getPriorityLabel(todo.priority)}
                        </span>
                        {todo.status && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                              todo.status
                            )}`}
                          >
                            {getStatusLabel(todo.status)}
                          </span>
                        )}
                        {todoLabels.map((label) => (
                          <span
                            key={label.id}
                            className="px-2 py-0.5 rounded text-xs text-white"
                            style={{ backgroundColor: label.color }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                      {todo.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {todo.description}
                        </p>
                      )}
                      {todo.deadline && (
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar className="size-3" />
                          <span>
                            {format(
                              new Date(todo.deadline),
                              "yyyy/MM/dd (E) HH:mm",
                              {
                                locale: ja,
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
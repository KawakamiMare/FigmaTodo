import { useNavigate, useParams } from "react-router-dom";
import { Todo, Label } from "../types/todo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TodoDetailProps {
  todos: Todo[];
  labels: Label[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

export function TodoDetail({ todos, labels, onUpdateTodo }: TodoDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const todo = todos.find((t) => t.id === id);

  const [text, setText] = useState(todo?.text || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [deadline, setDeadline] = useState(todo?.deadline || "");
  const [priority, setPriority] = useState(todo?.priority || "medium");
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    todo?.labels || []
  );

  if (!todo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">タスクが見つかりません</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="size-4 mr-2" />
          戻る
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateTodo(todo.id, {
      text,
      description,
      deadline: deadline || undefined,
      priority: priority as Todo["priority"],
      labels: selectedLabels,
    });
    navigate("/");
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
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

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="size-4 mr-2" />
          戻る
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-gray-700 mb-4">タスクの詳細</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              タスク名
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="タスク名を入力"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">概要</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの詳細な説明を入力..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">期限</label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                優先度
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <span className={getPriorityColor("high")}>
                      {getPriorityLabel("high")}
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className={getPriorityColor("medium")}>
                      {getPriorityLabel("medium")}
                    </span>
                  </SelectItem>
                  <SelectItem value="low">
                    <span className={getPriorityColor("low")}>
                      {getPriorityLabel("low")}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">ラベル</label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleLabel(label.id)}
                >
                  <Checkbox
                    checked={selectedLabels.includes(label.id)}
                    onCheckedChange={() => toggleLabel(label.id)}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm">{label.name}</span>
                </div>
              ))}
              {labels.length === 0 && (
                <p className="text-sm text-gray-400">
                  ラベルがありません。設定から追加してください。
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>ステータス</span>
              <span
                className={todo.completed ? "text-green-600" : "text-blue-600"}
              >
                {todo.completed ? "完了" : "未完了"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
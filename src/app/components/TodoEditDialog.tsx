import { useState, useEffect } from "react";
import { Todo, Label, Status } from "../types/todo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TodoEditDialogProps {
  todo: Todo | null;
  labels: Label[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Todo>) => void;
}

export function TodoEditDialog({
  todo,
  labels,
  open,
  onOpenChange,
  onSave,
}: TodoEditDialogProps) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [status, setStatus] = useState<Status>("not_started");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setDescription(todo.description || "");
      setDeadline(todo.deadline || "");
      setPriority(todo.priority);
      setStatus(todo.status || "not_started");
      setSelectedLabels(todo.labels || []);
    }
  }, [todo]);

  const handleSave = () => {
    if (todo) {
      onSave(todo.id, {
        text,
        description,
        deadline: deadline || undefined,
        priority,
        status,
        labels: selectedLabels,
      });
      onOpenChange(false);
    }
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

  const getStatusLabel = (s: Status) => {
    switch (s) {
      case "not_started":
        return "未着手";
      case "in_progress":
        return "進行中";
      case "almost_done":
        return "ほぼ完了";
      case "stopped":
        return "停止中";
      default:
        return "未着手";
    }
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case "not_started":
        return "text-gray-600";
      case "in_progress":
        return "text-blue-600";
      case "almost_done":
        return "text-green-600";
      case "stopped":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>タスクの編集</DialogTitle>
          <DialogDescription>
            タスクの詳細を編集できます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div>
            <label className="block text-sm mb-2 text-gray-700">期限</label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">
                優先度
              </label>
              <Select value={priority} onValueChange={(value) => setPriority(value as "high" | "medium" | "low")}>
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

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                ステータス
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">
                    <span className={getStatusColor("not_started")}>
                      {getStatusLabel("not_started")}
                    </span>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <span className={getStatusColor("in_progress")}>
                      {getStatusLabel("in_progress")}
                    </span>
                  </SelectItem>
                  <SelectItem value="almost_done">
                    <span className={getStatusColor("almost_done")}>
                      {getStatusLabel("almost_done")}
                    </span>
                  </SelectItem>
                  <SelectItem value="stopped">
                    <span className={getStatusColor("stopped")}>
                      {getStatusLabel("stopped")}
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">完了状態</span>
              <span
                className={todo.completed ? "text-green-600 font-medium" : "text-gray-500"}
              >
                {todo.completed ? "✓ 完了済み" : "未完了"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ※完了はタスク一覧のチェックボックスで設定できます
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

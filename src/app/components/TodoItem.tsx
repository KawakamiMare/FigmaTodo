import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Todo, Label, Status } from "../types/todo";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface TodoItemProps {
  todo: Todo;
  labels: Label[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, labels, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed;

  const todoLabels = labels.filter((label) =>
    todo.labels?.includes(label.id)
  );

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(todo.id);
    setDeleteDialogOpen(false);
  };

  const handleCardClick = () => {
    onEdit(todo);
  };
  
  return (
    <>
      <div
        className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          onClick={(e) => e.stopPropagation()}
          id={`todo-${todo.id}`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <label
              htmlFor={`todo-${todo.id}`}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {todo.text}
            </label>
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
          {todo.deadline && (
            <div
              className={`flex items-center gap-1 mt-1 text-sm ${
                isOverdue ? "text-red-500" : "text-gray-500"
              }`}
            >
              <Calendar className="size-3" />
              <span>
                {format(new Date(todo.deadline), "yyyy/MM/dd (E) HH:mm", {
                  locale: ja,
                })}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        todoText={todo.text}
      />
    </>
  );
}
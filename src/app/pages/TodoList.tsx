import { useState } from "react";
import { Link } from "react-router-dom";
import { TodoForm } from "../components/TodoForm";
import { TodoItem } from "../components/TodoItem";
import { TodoEditDialog } from "../components/TodoEditDialog";
import { Todo, Label } from "../types/todo";
import { Button } from "../components/ui/button";
import { ListChecks, Settings } from "lucide-react";

interface TodoListProps {
  currentTime: Date;
  todos: Todo[];
  labels: Label[];
  onAddTodo: (text: string, deadline?: string, priority?: string, description?: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

export function TodoList({ currentTime, todos, labels, onAddTodo, onToggleTodo, onDeleteTodo, onUpdateTodo }: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // 優先度が高く、期限が近いものを上に表示
  const sortedTodos = [...todos].sort((a, b) => {
    // 完了済みは下に
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 優先度でソート
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // 期限でソート（期限がないものは下）
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    
    return 0;
  });

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditDialogOpen(true);
  };

  const handleSaveTodo = (id: string, updates: Partial<Todo>) => {
    onUpdateTodo(id, updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Link to="/settings">
          <Button variant="outline" className="gap-2">
            <Settings className="size-4" />
            設定
          </Button>
        </Link>
        <Link to="/completed">
          <Button variant="outline" className="gap-2">
            <ListChecks className="size-4" />
            完了したタスク
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <TodoForm onAdd={onAddTodo} />
      </div>

      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            タスクがありません。新しいタスクを追加してください。
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              labels={labels}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        )}
      </div>

      <TodoEditDialog
        todo={editingTodo}
        labels={labels}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveTodo}
      />
    </div>
  );
}
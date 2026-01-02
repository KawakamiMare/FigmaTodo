import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoList } from "./pages/TodoList";
import { TodoDetail } from "./pages/TodoDetail";
import { CompletedTodos } from "./pages/CompletedTodos";
import { Settings } from "./pages/Settings";
import { Todo, Label, AppSettings } from "./types/todo";
import { format } from "date-fns";

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState<AppSettings>({
    backgroundType: "gradient",
    backgroundColor: "from-blue-50 to-indigo-100",
  });
  const [labels, setLabels] = useState<Label[]>([
    { id: "1", name: "仕事", color: "#3b82f6" },
    { id: "2", name: "個人", color: "#10b981" },
  ]);
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      text: "Todoアプリを作る",
      completed: true,
      deadline: "2026-01-01T10:00",
      priority: "high",
      description: "優先度と期限でソートできる機能を実装する",
      labels: ["1"],
    },
    {
      id: "2",
      text: "買い物に行く",
      completed: false,
      deadline: "2026-01-03T15:30",
      priority: "medium",
      labels: ["2"],
    },
    {
      id: "3",
      text: "メールを確認する",
      completed: false,
      priority: "low",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTodo = (text: string, deadline?: string, priority?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      deadline,
      priority: (priority as Todo["priority"]) || "medium",
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const addLabel = (label: Omit<Label, "id">) => {
    setLabels([...labels, { ...label, id: Date.now().toString() }]);
  };

  const deleteLabel = (id: string) => {
    setLabels(labels.filter((label) => label.id !== id));
    // タスクから該当ラベルを削除
    setTodos(
      todos.map((todo) => ({
        ...todo,
        labels: todo.labels?.filter((labelId) => labelId !== id),
      }))
    );
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const getBackgroundStyle = () => {
    if (settings.backgroundType === "gradient") {
      return `bg-gradient-to-br ${settings.backgroundColor}`;
    } else if (settings.backgroundType === "image") {
      return "";
    } else if (settings.backgroundType === "custom") {
      return "";
    }
    return "bg-gradient-to-br from-blue-50 to-indigo-100";
  };

  const getBackgroundImageUrl = () => {
    if (settings.backgroundType === "image") {
      return settings.backgroundImage;
    } else if (settings.backgroundType === "custom") {
      return settings.customImageUrl;
    }
    return undefined;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen p-8 ${getBackgroundStyle()}`}
        style={
          backgroundImageUrl
            ? {
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
            : undefined
        }
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-gray-800 mb-2">Todoアプリ</h1>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <p>{activeTodos}個のタスクが未完了</p>
              <span className="text-gray-400">|</span>
              <p className="font-mono">{format(currentTime, "HH:mm:ss")}</p>
            </div>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <TodoList
                  currentTime={currentTime}
                  todos={todos}
                  labels={labels}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                />
              }
            />
            <Route
              path="/todo/:id"
              element={
                <TodoDetail
                  todos={todos}
                  labels={labels}
                  onUpdateTodo={updateTodo}
                />
              }
            />
            <Route
              path="/completed"
              element={<CompletedTodos todos={todos} labels={labels} />}
            />
            <Route
              path="/settings"
              element={
                <Settings
                  settings={settings}
                  labels={labels}
                  onUpdateSettings={setSettings}
                  onAddLabel={addLabel}
                  onDeleteLabel={deleteLabel}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

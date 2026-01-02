import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label as UILabel } from "../components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import { AppSettings, Label } from "../types/todo";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface SettingsProps {
  settings: AppSettings;
  labels: Label[];
  onUpdateSettings: (settings: AppSettings) => void;
  onAddLabel: (label: Omit<Label, "id">) => void;
  onDeleteLabel: (id: string) => void;
}

const COLOR_PALETTES = [
  { name: "ブルーグラデーション", value: "from-blue-50 to-indigo-100" },
  { name: "ピンクグラデーション", value: "from-pink-50 to-purple-100" },
  { name: "グリーングラデーション", value: "from-green-50 to-teal-100" },
  { name: "オレンジグラデーション", value: "from-orange-50 to-red-100" },
  { name: "グレーグラデーション", value: "from-gray-50 to-slate-100" },
];

const BACKGROUND_IMAGES = [
  {
    name: "抽象的グラデーション",
    url: "https://images.unsplash.com/photo-1679193559799-4bdc724dfc45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ3JhZGllbnQlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjcyNTA5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "パステルグラデーション",
    url: "https://images.unsplash.com/photo-1761623135057-e41b632694f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGFzdGVsJTIwZ3JhZGllbnR8ZW58MXx8fHwxNzY3MzM4Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "クリーンミニマル",
    url: "https://images.unsplash.com/photo-1509943089014-50b4f4edfbbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMG1pbmltYWwlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzI2NDA5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const LABEL_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

export function Settings({
  settings,
  labels,
  onUpdateSettings,
  onAddLabel,
  onDeleteLabel,
}: SettingsProps) {
  const navigate = useNavigate();
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);
  const [customImageUrl, setCustomImageUrl] = useState(
    settings.customImageUrl || ""
  );

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      onAddLabel({ name: newLabelName.trim(), color: newLabelColor });
      setNewLabelName("");
      setNewLabelColor(LABEL_COLORS[0]);
    }
  };

  const handleBackgroundChange = (
    type: AppSettings["backgroundType"],
    value?: string
  ) => {
    if (type === "gradient") {
      onUpdateSettings({
        ...settings,
        backgroundType: type,
        backgroundColor: value,
      });
    } else if (type === "image") {
      onUpdateSettings({
        ...settings,
        backgroundType: type,
        backgroundImage: value,
      });
    } else if (type === "custom") {
      onUpdateSettings({
        ...settings,
        backgroundType: type,
        customImageUrl: customImageUrl,
      });
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

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
        <div>
          <h2 className="text-gray-800 mb-6">設定</h2>

          {/* 背景設定 */}
          <div className="space-y-4 mb-8">
            <h3 className="text-gray-700">背景設定</h3>

            <div>
              <UILabel className="block mb-3">カラーパレット</UILabel>
              <div className="grid grid-cols-1 gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.value}
                    onClick={() =>
                      handleBackgroundChange("gradient", palette.value)
                    }
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      settings.backgroundType === "gradient" &&
                      settings.backgroundColor === palette.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`h-12 rounded-md bg-gradient-to-br ${palette.value} mb-2`}
                    />
                    <span className="text-sm text-gray-700">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <UILabel className="block mb-3">背景画像</UILabel>
              <div className="grid grid-cols-1 gap-2">
                {BACKGROUND_IMAGES.map((bg) => (
                  <button
                    key={bg.url}
                    onClick={() => handleBackgroundChange("image", bg.url)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      settings.backgroundType === "image" &&
                      settings.backgroundImage === bg.url
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={bg.url}
                      alt={bg.name}
                      className="w-full h-24 object-cover rounded-md mb-2"
                    />
                    <span className="text-sm text-gray-700">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <UILabel className="block mb-3">カスタム画像URL</UILabel>
              <div className="flex gap-2">
                <Input
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button
                  onClick={() => handleBackgroundChange("custom")}
                  disabled={!customImageUrl.trim()}
                >
                  適用
                </Button>
              </div>
            </div>
          </div>

          {/* ラベル設定 */}
          <div className="space-y-4">
            <h3 className="text-gray-700">ラベル管理</h3>

            <div className="flex gap-2">
              <Input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="ラベル名"
                onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
              />
              <div className="flex gap-1">
                {LABEL_COLORS.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewLabelColor(color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      newLabelColor === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button onClick={handleAddLabel} className="gap-2">
                <Plus className="size-4" />
                追加
              </Button>
            </div>

            <div className="space-y-2">
              {labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteLabel(label.id)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              {labels.length === 0 && (
                <p className="text-center text-gray-400 py-4">
                  ラベルがありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function WhiteboardPage() {
  const [notes, setNotes] = useState<{ id: number; x: number; y: number }[]>([]);

  // 画面をクリックした時に付箋を追加する関数
  const handleCanvasClick = (e: React.MouseEvent) => {
    const newNote = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setNotes([...notes, newNote]);
  };

  return (
    <main 
      className="w-screen h-screen bg-[#f3f4f6] relative overflow-hidden"
      onClick={handleCanvasClick}
    >
      {/* 簡易的な操作説明 */}
      <div className="absolute top-5 left-5 bg-white shadow-md p-3 rounded-lg z-10 pointer-events-none">
        <h1 className="font-bold text-gray-800">Whiteboard App</h1>
        <p className="text-sm text-gray-500">画面をクリックして付箋を追加</p>
      </div>

      {/* 付箋のレンダリング */}
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute w-40 h-40 bg-yellow-200 border border-yellow-400 shadow-lg p-2"
          style={{
            left: note.x,
            top: note.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <textarea 
            className="w-full h-full bg-transparent resize-none outline-none text-gray-800"
            placeholder="メモを入力..."
            onClick={(e) => e.stopPropagation()} // 親のクリックイベントを防ぐ
          />
        </div>
      ))}
    </main>
  );
}
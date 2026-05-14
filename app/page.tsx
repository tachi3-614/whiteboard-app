"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 付箋のカラーバリエーション定義
const COLORS = [
  { id: "yellow", bg: "bg-yellow-200", border: "border-yellow-300", dot: "bg-yellow-400" },
  { id: "blue", bg: "bg-blue-200", border: "border-blue-300", dot: "bg-blue-400" },
  { id: "green", bg: "bg-green-200", border: "border-green-300", dot: "bg-green-400" },
  { id: "pink", bg: "bg-pink-200", border: "border-pink-300", dot: "bg-pink-400" },
];

export default function WhiteboardPage() {
  // 付箋の状態管理（位置、色、ID）
  const [notes, setNotes] = useState<{ id: number; x: number; y: number; colorIndex: number }[]>([]);
  // ゴミ箱に重なっているかどうかの判定
  const [isOverTrash, setIsOverTrash] = useState(false);

  // 画面クリックで付箋を追加
  const handleCanvasClick = (e: React.MouseEvent) => {
    // 背景以外（付箋本体など）をクリックした時は反応させない
    if (e.target !== e.currentTarget) return;

    const newNote = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      colorIndex: 0, // 初期色は黄色
    };
    setNotes([...notes, newNote]);
  };

  // 色を順番に切り替える
  const changeColor = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, colorIndex: (note.colorIndex + 1) % COLORS.length } 
        : note
    ));
  };

  // 付箋を削除
  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    setIsOverTrash(false);
  };

  return (
    <main 
      className="w-screen h-screen bg-[#f3f4f6] relative overflow-hidden select-none"
      onClick={handleCanvasClick}
    >
      {/* 左上の操作ガイド */}
      <div className="absolute top-5 left-5 bg-white shadow-sm border p-3 rounded-lg z-10 pointer-events-none">
        <h1 className="font-bold text-gray-800 tracking-tight">Whiteboard App</h1>
        <p className="text-[10px] text-gray-400 mt-1">CLICK: ADD / DRAG: MOVE / DOT: COLOR</p>
      </div>

      {/* 付箋の描画エリア */}
      <AnimatePresence>
        {notes.map((note) => {
          const color = COLORS[note.colorIndex];
          return (
            <motion.div
              key={note.id}
              drag
              dragMomentum={false}
              // ドラッグ終了時にゴミ箱判定
              onDragEnd={(_, info) => {
                const isInsideTrash = 
                  window.innerWidth - info.point.x < 150 && 
                  window.innerHeight - info.point.y < 150;
                
                if (isInsideTrash) {
                  deleteNote(note.id);
                } else {
                  setIsOverTrash(false);
                }
              }}
              // ドラッグ中にゴミ箱の状態を更新
              onDrag={(_, info) => {
                const isInsideTrash = 
                  window.innerWidth - info.point.x < 150 && 
                  window.innerHeight - info.point.y < 150;
                setIsOverTrash(isInsideTrash);
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0px 15px 35px rgba(0,0,0,0.15)" }}
              className={`absolute w-44 h-44 ${color.bg} border ${color.border} shadow-md p-3 cursor-grab active:cursor-grabbing flex flex-col`}
              style={{
                left: note.x,
                top: note.y,
                x: "-50%",
                y: "-50%",
              }}
            >
              {/* カラーチェンジボタン */}
              <button
                onClick={() => changeColor(note.id)}
                className={`w-4 h-4 rounded-full ${color.dot} border border-black/10 mb-2 hover:scale-125 transition-transform shrink-0`}
              />

              <textarea 
                className="w-full h-full bg-transparent resize-none outline-none text-gray-800 text-sm leading-relaxed"
                placeholder="Type here..."
                onPointerDown={(e) => e.stopPropagation()} // テキスト選択時にドラッグさせない
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 右下のゴミ箱 */}
      <motion.div
        animate={{ 
          scale: isOverTrash ? 1.2 : 1,
          backgroundColor: isOverTrash ? "#fee2e2" : "#ffffff",
          borderColor: isOverTrash ? "#ef4444" : "#e5e7eb"
        }}
        className="absolute bottom-10 right-10 w-24 h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center pointer-events-none z-0"
      >
        <span className="text-2xl">{isOverTrash ? "🔥" : "🗑️"}</span>
        <span className={`text-[10px] mt-1 font-bold ${isOverTrash ? "text-red-500" : "text-gray-400"}`}>
          {isOverTrash ? "RELEASE" : "TRASH"}
        </span>
      </motion.div>
    </main>
  );
}
import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (firebaseKey: string, password: string) => void;
  firebaseKey: string;
}

export function PasswordModal({ isOpen, onClose, onDelete, firebaseKey }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-bold mb-2">削除用パスワード</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-2"
          placeholder="パスワードを入力"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-gray-600">キャンセル</button>
          <button 
            onClick={() => onDelete(firebaseKey, password)} 
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
} 
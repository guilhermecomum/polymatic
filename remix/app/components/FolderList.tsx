import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import {
  FolderIcon,
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/components/button";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export function FolderList({
  folders,
  selectedFolder,
  onSelectFolder,
}: FolderListProps) {
  const fetcher = useFetcher();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      fetcher.submit(
        { intent: "createFolder", name: newFolderName.trim() },
        { method: "post" }
      );
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  const handleStartRename = (folder: Folder) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
  };

  const handleRenameFolder = (folderId: string) => {
    if (editName.trim()) {
      fetcher.submit(
        { intent: "renameFolder", folderId, name: editName.trim() },
        { method: "post" }
      );
    }
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm("Tem certeza que deseja excluir esta pasta? As composições dentro dela ficarão sem pasta.")) {
      fetcher.submit(
        { intent: "deleteFolder", folderId },
        { method: "post" }
      );
      if (selectedFolder === folderId) {
        onSelectFolder(null);
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">Pastas</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="text-gray-400 hover:text-white"
          title="Nova pasta"
        >
          <FolderPlusIcon className="h-5 w-5" />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nome da pasta"
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateFolder();
              } else if (e.key === "Escape") {
                setIsCreating(false);
                setNewFolderName("");
              }
            }}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleCreateFolder}
              className="rounded text-sm px-2 py-1 flex-1"
            >
              Criar
            </Button>
            <Button
              onClick={() => {
                setIsCreating(false);
                setNewFolderName("");
              }}
              className="rounded text-sm px-2 py-1 bg-gray-600 hover:bg-gray-500"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <ul className="space-y-1">
        {/* All compositions (no folder) */}
        <li>
          <button
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center space-x-2 px-2 py-2 rounded text-left ${
              selectedFolder === null
                ? "bg-red-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <FolderIcon className="h-5 w-5" />
            <span>Sem pasta</span>
          </button>
        </li>

        {folders.map((folder) => (
          <li key={folder.id}>
            {editingFolder === folder.id ? (
              <div className="px-2 py-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameFolder(folder.id);
                    } else if (e.key === "Escape") {
                      setEditingFolder(null);
                    }
                  }}
                  onBlur={() => handleRenameFolder(folder.id)}
                />
              </div>
            ) : (
              <div
                className={`flex items-center justify-between group ${
                  selectedFolder === folder.id
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                } rounded`}
              >
                <button
                  onClick={() => onSelectFolder(folder.id)}
                  className="flex-1 flex items-center space-x-2 px-2 py-2 text-left"
                >
                  <FolderIcon className="h-5 w-5" />
                  <span className="truncate">{folder.name}</span>
                </button>
                <div className="hidden group-hover:flex items-center pr-2 space-x-1">
                  <button
                    onClick={() => handleStartRename(folder)}
                    className="p-1 hover:text-white"
                    title="Renomear"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="p-1 hover:text-red-400"
                    title="Excluir"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

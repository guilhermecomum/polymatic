import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import {
  getCompositionsByUser,
  getFoldersByUser,
  createFolder,
  deleteFolder,
  updateFolder,
  deleteComposition,
  updateComposition,
} from "~/services/share.server";
import { FolderList } from "~/components/FolderList";
import { Button } from "~/components/button";
import {
  TrashIcon,
  MusicalNoteIcon,
  LinkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Minhas composições - Polymatic" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const compositions = await getCompositionsByUser(user.id);
  const folders = await getFoldersByUser(user.id);
  const appUrl = process.env.APP_URL || "http://localhost:5173";

  return json({ user, compositions, folders, appUrl });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createFolder") {
    const name = formData.get("name");
    if (typeof name !== "string" || name.trim() === "") {
      return json({ error: "Nome da pasta é obrigatório" }, { status: 400 });
    }
    await createFolder(user.id, name.trim());
    return json({ success: true });
  }

  if (intent === "deleteFolder") {
    const folderId = formData.get("folderId");
    if (typeof folderId !== "string") {
      return json({ error: "ID da pasta é obrigatório" }, { status: 400 });
    }
    const deleted = await deleteFolder(folderId, user.id);
    if (!deleted) {
      return json({ error: "Pasta não encontrada" }, { status: 404 });
    }
    return json({ success: true });
  }

  if (intent === "renameFolder") {
    const folderId = formData.get("folderId");
    const name = formData.get("name");
    if (typeof folderId !== "string" || typeof name !== "string") {
      return json({ error: "Dados inválidos" }, { status: 400 });
    }
    const updated = await updateFolder(folderId, user.id, name.trim());
    if (!updated) {
      return json({ error: "Pasta não encontrada" }, { status: 404 });
    }
    return json({ success: true });
  }

  if (intent === "deleteComposition") {
    const compositionId = formData.get("compositionId");
    if (typeof compositionId !== "string") {
      return json({ error: "ID da composição é obrigatório" }, { status: 400 });
    }
    const deleted = await deleteComposition(compositionId, user.id);
    if (!deleted) {
      return json({ error: "Composição não encontrada" }, { status: 404 });
    }
    return json({ success: true });
  }

  if (intent === "moveToFolder") {
    const compositionId = formData.get("compositionId");
    const folderId = formData.get("folderId");
    if (typeof compositionId !== "string") {
      return json({ error: "ID da composição é obrigatório" }, { status: 400 });
    }
    const updated = await updateComposition(compositionId, user.id, {
      folderId: folderId === "" ? null : (folderId as string),
    });
    if (!updated) {
      return json({ error: "Composição não encontrada" }, { status: 404 });
    }
    return json({ success: true });
  }

  if (intent === "renameComposition") {
    const compositionId = formData.get("compositionId");
    const title = formData.get("title");
    if (typeof compositionId !== "string" || typeof title !== "string") {
      return json({ error: "Dados inválidos" }, { status: 400 });
    }
    const updated = await updateComposition(compositionId, user.id, {
      title: title.trim() || null,
    });
    if (!updated) {
      return json({ error: "Composição não encontrada" }, { status: 404 });
    }
    return json({ success: true });
  }

  return json({ error: "Ação desconhecida" }, { status: 400 });
}

export default function Dashboard() {
  const { user, compositions, folders, appUrl } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingComposition, setEditingComposition] = useState<string | null>(
    null,
  );
  const [newTitle, setNewTitle] = useState("");

  const filteredCompositions = selectedFolder
    ? compositions.filter((c) => c.folder_id === selectedFolder)
    : compositions.filter((c) => !c.folder_id);

  const handleDeleteComposition = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta composição?")) {
      fetcher.submit(
        { intent: "deleteComposition", compositionId: id },
        { method: "post" },
      );
    }
  };

  const handleMoveToFolder = (compositionId: string, folderId: string) => {
    fetcher.submit(
      { intent: "moveToFolder", compositionId, folderId },
      { method: "post" },
    );
  };

  const handleStartRename = (id: string, currentTitle: string | null) => {
    setEditingComposition(id);
    setNewTitle(currentTitle || "");
  };

  const handleSaveRename = (id: string) => {
    fetcher.submit(
      { intent: "renameComposition", compositionId: id, title: newTitle },
      { method: "post" },
    );
    setEditingComposition(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Olá, {user.name}! Suas composições
      </h1>

      <div className="flex gap-6">
        {/* Sidebar with folders */}
        <div className="w-64 shrink-0">
          <FolderList
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {selectedFolder
                ? folders.find((f) => f.id === selectedFolder)?.name
                : "Sem pasta"}
            </h2>
            <Link to="/">
              <Button className="rounded-md">Nova composição</Button>
            </Link>
          </div>

          {filteredCompositions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MusicalNoteIcon className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhuma composição nesta pasta</p>
              <Link
                to="/"
                className="text-red-400 hover:text-red-300 mt-2 inline-block"
              >
                Criar nova composição
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCompositions.map((composition) => (
                <div
                  key={composition.id}
                  className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <MusicalNoteIcon className="h-8 w-8 text-red-500" />
                    <div>
                      {editingComposition === composition.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                            placeholder="Nome da composição"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveRename(composition.id);
                              } else if (e.key === "Escape") {
                                setEditingComposition(null);
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleSaveRename(composition.id)}
                            className="rounded text-sm px-2 py-1"
                          >
                            Salvar
                          </Button>
                        </div>
                      ) : (
                        <h3 className="font-medium">
                          {composition.title || "Sem título"}
                        </h3>
                      )}
                      <p className="text-sm text-gray-400">
                        {composition.channels.length} canal(is) ·{" "}
                        {composition.bpm} BPM
                      </p>
                      <p className="text-xs text-gray-500">
                        Criado em{" "}
                        {new Date(composition.created_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Move to folder dropdown */}
                    <select
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      value={composition.folder_id || ""}
                      onChange={(e) =>
                        handleMoveToFolder(composition.id, e.target.value)
                      }
                    >
                      <option value="">Sem pasta</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>

                    {/* Actions */}
                    <Link
                      to={`/guias/${composition.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="rounded p-2" title="Abrir">
                        <MusicalNoteIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      className="rounded p-2"
                      title="Copiar link"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${appUrl}/guias/${composition.slug}`,
                        );
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      className="rounded p-2"
                      title="Renomear"
                      onClick={() =>
                        handleStartRename(composition.id, composition.title)
                      }
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      className="rounded p-2 bg-red-600 hover:bg-red-700"
                      title="Excluir"
                      onClick={() => handleDeleteComposition(composition.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

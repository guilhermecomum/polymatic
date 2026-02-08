import { Dialog, Transition, DialogTitle, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ClipboardIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string | null;
}

export function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="text-lg font-medium text-white">
                    Compartilhar composição
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">
                    Link para compartilhar
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl || ""}
                      className="flex-1 rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white"
                    />
                    <Button
                      onClick={handleCopy}
                      className="rounded-md flex items-center space-x-1 px-3 py-2"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-5 w-5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="h-5 w-5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-400">
                  Qualquer pessoa com este link poderá visualizar e reproduzir sua composição.
                </p>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

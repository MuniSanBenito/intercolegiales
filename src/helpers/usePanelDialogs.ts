import { useEffect, useRef, useState } from "react";

export function usePanelDialogs() {
  const formDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [formRequest, setFormRequest] = useState(0);
  const [deleteRequest, setDeleteRequest] = useState(0);

  useEffect(() => {
    if (formRequest === 0) return;
    const dialog = formDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [formRequest]);

  useEffect(() => {
    if (deleteRequest === 0) return;
    const dialog = deleteDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [deleteRequest]);

  return {
    formDialogRef,
    deleteDialogRef,
    requestForm: () => setFormRequest((current) => current + 1),
    requestDelete: () => setDeleteRequest((current) => current + 1),
  };
}

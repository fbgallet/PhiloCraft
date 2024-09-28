import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { Language } from "../App";

interface ConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: Function;
  clearUserConcepts: Function;
  language: Language;
}

export default function ConfirmDialog({
  isOpen,
  setIsOpen,
  clearUserConcepts,
  language,
}: ConfirmDialogProps) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    clearUserConcepts();
    handleClose();
  };

  return (
    <Dialog
      icon="warning-sign"
      title={
        language === "EN"
          ? "Reset user concepts"
          : "Réinitialiser les concepts de l'utilisateur"
      }
      isOpen={isOpen}
      onClose={handleClose}
    >
      <DialogBody>
        {language === "EN"
          ? `Are you sure you want to delete your discovered concepts? This means
        you'll be starting from scratch, your concepts will be removed from your
        browser storage.`
          : `Etes-vous sûr de vouloir effacer tous les concepts découverts ? Cela signifie que vous reprendrez à zéro, vos concepts seront effacés de la mémoire de votre navigateur.`}
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button intent="danger" text="Reset" onClick={handleClear} />
          </>
        }
      />
    </Dialog>
  );
}

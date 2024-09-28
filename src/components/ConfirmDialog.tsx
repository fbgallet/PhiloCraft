import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";

interface ConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: Function;
  clearUserConcepts: Function;
  language: string;
}

export default function ConfirmDialog({
  isOpen,
  setIsOpen,
  clearUserConcepts,
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
      title="Reset user concepts"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <DialogBody>
        Are you sure you want to delete your discovered concepts? This means
        you'll be starting from scratch, your concepts will be removed from your
        browser storage.
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

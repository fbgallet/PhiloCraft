import { Dialog, DialogBody } from "@blueprintjs/core";

import { useCallback } from "react";

interface JustifyDialogProps {
  isOpen: boolean;
  setIsOpen: Function;
  nodeData: any;
}

export default function JustifyDialog({
  isOpen,
  setIsOpen,
  nodeData,
}: JustifyDialogProps) {
  const toggleOverlay = useCallback(() => {
    setIsOpen((open: boolean) => !open);
  }, [setIsOpen]);

  return (
    <Dialog
      title={`${nodeData.label} (${nodeData.category} concept)`}
      // icon={nodeData.icon}
      isOpen={isOpen}
      onClose={toggleOverlay}
    >
      <DialogBody>{isOpen && nodeData.logic}</DialogBody>
    </Dialog>
  );
}

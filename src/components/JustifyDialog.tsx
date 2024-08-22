import { Dialog, DialogBody } from "@blueprintjs/core";

import { useCallback } from "react";

export default function JustifyDialog({ isOpen, setIsOpen, nodeData }) {
  const toggleOverlay = useCallback(() => {
    setIsOpen((open) => !open);
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

import { Dialog, DialogBody } from "@blueprintjs/core";

export default function JustifyDialog({ isOpen, setIsOpen, nodeData }) {
  return (
    <Dialog
      title={`${nodeData.label} (${nodeData.category} concept)`}
      // icon={nodeData.icon}
      isOpen={isOpen}
    >
      <DialogBody>{isOpen && nodeData.logic}</DialogBody>
    </Dialog>
  );
}

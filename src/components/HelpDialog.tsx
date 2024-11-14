import { Icon, Dialog, DialogBody } from "@blueprintjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faQuestion,
  faCircleQuestion,
  faRightToBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { useCallback } from "react";

interface HelpDialogProps {
  isOpen: boolean;
  setIsOpen: Function;
}

export default function HelpDialog({ isOpen, setIsOpen }: HelpDialogProps) {
  const toggleOverlay = useCallback(() => {
    setIsOpen((open: boolean) => !open);
  }, [setIsOpen]);

  return (
    <Dialog
      title={"Philo🧩Craft v.0.1 11-2024"}
      isOpen={isOpen}
      onClose={toggleOverlay}
    >
      <DialogBody>
        <p>
          Philo🧩Craft is an AI-powered crafting game to explore philosophical
          concepts.
        </p>
        <p>
          Combine basic concepts and discover fascinating ideas that make you
          think!
        </p>
        <ul>
          <li>
            <Icon icon="intersection" size={18} /> for quick explanation of the
            logic of the combination.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircleQuestion} size="lg" /> to learn more
            about the meaning of the concept, see an illuminating example,
            understand why it's worth exploring, and engage in a reasoned
            discussion with two great philosophers who have worked on this
            concept!
          </li>
          <li>
            <FontAwesomeIcon icon={faTrash} /> or right click to remove the
            concept from the canvas.
          </li>
          <li>
            On Mobile, <strong>long press</strong> on a concept in the sidebar
            to insert it in the canvas
          </li>
        </ul>
        ---
        <p>
          Help me to develop this game and other tools leveraging AI to
          stimulate thinking!
          <ul>
            <li>
              Follow me on X:{" "}
              <a
                href="https://twitter.com/fbgallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                @fbgallet
              </a>
            </li>
            <li>
              or make a small donation{" "}
              <a
                href="https://github.com/sponsors/fbgallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                via Github sponsor
              </a>{" "}
              or{" "}
              <a
                href="buymeacoffee.com/fbgallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                buy me a coffee
              </a>
            </li>
          </ul>
          Even the most modest support is a huge source of motivation! 🙏
        </p>
        ---
        <p>
          Github repo of the project to report issues, take a look at the code,
          or even contribute:{" "}
          <a
            href="https://github.com/fbgallet/PhiloCraft"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/fbgallet/PhiloCraft
          </a>
        </p>
      </DialogBody>
    </Dialog>
  );
}

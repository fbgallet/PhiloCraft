import { Icon, Dialog, Divider, DialogBody } from "@blueprintjs/core";
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
  language: string;
}

export default function HelpDialog({
  isOpen,
  setIsOpen,
  language,
}: HelpDialogProps) {
  const toggleOverlay = useCallback(() => {
    setIsOpen((open: boolean) => !open);
  }, [setIsOpen]);

  return (
    <Dialog
      title={"Philo🧩Craft v.0.1 11-2024"}
      isOpen={isOpen}
      onClose={toggleOverlay}
    >
      {language === "EN" ? (
        <DialogBody>
          <h4>
            Philo🧩Craft is an AI-powered crafting game to explore philosophical
            concepts developed by{" "}
            <a
              href="https://twitter.com/fbgallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fabrice Gallet
            </a>
            .
          </h4>
          <h4>
            Combine basic concepts and discover fascinating ideas that make you
            think! Be the first to try the most amazing combinations!
          </h4>
          <Divider />
          <h3>Commands</h3>
          <p>
            Simply drag some concept over another concept, they will be replaced
            by a concept that could result of their combination.
          </p>
          <p>
            Did you know about this concept? Do you know who developed it? Who
            criticized it? What it can bring or change to our way of thinking
            and living? Explore, let yourself be surprised!
          </p>
          <p>
            A small menu appear above a concept node when you left click on it.
            Click on:
          </p>
          <ul>
            <li>
              <Icon icon="intersection" size={18} /> for quick explanation of
              the logic of the combination.
            </li>
            <li>
              <FontAwesomeIcon icon={faCircleQuestion} size="lg" /> to learn
              more about the meaning of the concept, see an illuminating
              example, understand why it's worth exploring, and engage in a
              reasoned discussion with two great philosophers who have worked on
              this concept!
            </li>
            <li>
              <FontAwesomeIcon icon={faTrash} /> or right click or long touch to
              remove the concept from the canvas.
            </li>
          </ul>
          <Divider />
          <h3>Sponsoring</h3>
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
                </a>{" "}
                and
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
          <Divider />
          <p>
            Github repo of the project to report issues, take a look at the
            code, or even contribute:{" "}
            <a
              href="https://github.com/fbgallet/PhiloCraft"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/fbgallet/PhiloCraft
            </a>
          </p>
        </DialogBody>
      ) : (
        <DialogBody>
          <h4>
            Philo🧩Craft est un jeu de combinaison et d'exploration de concepts
            philosophiques assisté par l'IA, développé par{" "}
            <a
              href="https://twitter.com/fbgallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fabrice Gallet
            </a>
            .
          </h4>
          <h4>
            Combinez les concepts élémentaires des différents domaines de la
            philosophie et découvrez des idées fascinantes, qui donnent à
            réfléchir ! Soyez le premier à tenter les combinaisons les plus
            étonnantes !
          </h4>
          <Divider />
          <h3>Commandes</h3>
          <p>
            Faites simplement glisser un concept sur un autre concept, ils
            seront automatiquement remplacés par un concept qui pourrait
            résulter de leur combinaison.
          </p>
          <p>
            Connaissiez-vous ce concept ? Savez-vous qui l'a forgé ? Qui l'a
            critiqué ? Ce qui peut apporter à votre manière de penser et de vire
            ? Explorez et laissez vous étonner !
          </p>
          <p>
            Un petit menu apparaît au-dessus d'un concept lorsque vous cliquez
            dessus avec le bouton gauche. Cliquez sur :
          </p>
          <ul>
            <li>
              <Icon icon="intersection" size={18} /> pour une explication rapide
              de la logique de la combinaison suivie par l'IA.
            </li>
            <li>
              <FontAwesomeIcon icon={faCircleQuestion} size="lg" /> pour en
              savoir plus sur la signification du concept, éclairée un exemple
              frappant, comprendre pourquoi la réflexion sur ce concept mérite
              d'être approfondie, et découvrir la confrontation argumentée de
              deux grands philosophes autour de ce concept !
            </li>
            <li>
              <FontAwesomeIcon icon={faTrash} /> ou clic droit pour retirer le
              concept du canevas.
            </li>
          </ul>
          <Divider />
          <h3>Soutien</h3>
          <p>
            Si vous souhaitez m'aidez-moi à développer ce jeu et d'autres outils
            pour favoriser la découverte de la philosophie et l'utilisation l'IA
            pour stimuler la réflexion:
            <ul>
              <li>
                vous pouvez me suivre sur X :{" "}
                <a
                  href="https://twitter.com/fbgallet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @fbgallet
                </a>{" "}
                et me faire savoir ce que vous avez pensé de ce jeu, ce que vous
                avez appris, ce que vous voudriez voir améliorer,
              </li>
              <li>
                ou me faire un petit don{" "}
                <a
                  href="https://github.com/sponsors/fbgallet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  via Github sponsor
                </a>{" "}
                ou{" "}
                <a
                  href="buymeacoffee.com/fbgallet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ou m'offrir un café
                </a>
              </li>
            </ul>
            Même le plus modeste soutien est une énorme source de motivation !
            🙏
          </p>
          <Divider />
          <p>
            Dépôt Github du projet pour signaler des problèmes, jeter un oeil au
            code, ou même contribuer :{" "}
            <a
              href="https://github.com/fbgallet/PhiloCraft"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/fbgallet/PhiloCraft
            </a>
          </p>
        </DialogBody>
      )}
    </Dialog>
  );
}
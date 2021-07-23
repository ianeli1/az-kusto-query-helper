import {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Transition } from "react-transition-group";

interface SideWindowProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const transitionStyles = {
  entering: "",
  entered: "",
  exiting: ["opacity-0", "translate-x-full"],
  exited: ["opacity-0 pointer-events-none", "translate-x-full"],
  unmounted: "",
};

export default function SideWindow({
  show,
  onClose,
  children,
}: SideWindowProps) {
  const onEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("keydown", onEsc);
    };
  }, [onEsc]);

  const onHide: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();

    onClose();
  };

  const onBubble: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <Transition in={show} timeout={1000}>
      {(state) => (
        <main
          className={`fixed z-50 left-0 bg-gray-500 bg-opacity-75 top-0 bottom-0 h-full w-full transition duration-700 ${transitionStyles[state][0]}`}
          onClick={onHide}
        >
          <section
            className={`absolute overflow-y-auto top-0 bottom-0 right-0 w-full lg:w-4/5 h-ful bg-gray-300
            shadow transform duration-700 ${transitionStyles[state][1]}`}
            onClick={onBubble}
          >
            {children}
          </section>
        </main>
      )}
    </Transition>
  );
}

interface Options {
  /**
   * The target element to listen for paste events on.
   * If not provided, the document will be used.
   */
  target?: HTMLElement | Document | React.RefObject<HTMLElement | null>;
  /**
   * Whether to disable the paste listener.
   */
  disabled?: boolean;
  /**
   * Whether to ignore editable targets.
   * If true, the paste listener will not be triggered if the target is an editable element. (e.g. input, textarea, etc.)
   * Defaults to false.
   */
  ignoreEditableTargets?: boolean;
  /**
   * The callback to call when a paste event is detected.
   */
  onPaste?: (files: File[]) => void;
}

export const usePaste = (options: Options = {}) => {
  const { target, disabled = false, ignoreEditableTargets = false, onPaste = () => {} } = options;

  useEffect(() => {
    if (disabled) return;
    if (typeof document === 'undefined') return;

    let _target: HTMLElement | Document | null = null;
    if (isRefObject(target)) {
      _target = target.current;
    } else if (target instanceof HTMLElement) {
      _target = target;
    } else if (target instanceof Document) {
      _target = target;
    } else {
      _target = document;
    }

    if (!_target) return;

    const handlePaste = (event: ClipboardEvent) => {
      if (disabled || !event.clipboardData) return;

      const activeElement = document.activeElement;
      if (activeElement && activeElement !== document.body && !ignoreEditableTargets && isEditableTarget(activeElement))
        return;

      const directFiles = Array.from(event.clipboardData.files || []);
      if (directFiles.length) {
        event.preventDefault();
        onPaste(directFiles);
        return;
      }

      const files = Array.from(event.clipboardData.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => !!file);

      if (!files.length) return;

      event.preventDefault();
      onPaste(files);
    };

    _target?.addEventListener('paste', handlePaste as EventListener);

    return () => {
      _target?.removeEventListener('paste', handlePaste as EventListener);
    };
  }, [disabled, onPaste, target, ignoreEditableTargets]);
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  const tag = target.tagName.toLowerCase();
  return ['input', 'textarea', 'select'].includes(tag);
};

const isRefObject = (target: any): target is React.RefObject<HTMLElement | null> => {
  return !!target && typeof target === 'object' && 'current' in target;
};
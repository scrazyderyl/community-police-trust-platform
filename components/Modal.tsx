import * as Dialog from "@radix-ui/react-dialog";

export default function Modal({ children, open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-1000 bg-black/30 flex items-center justify-center">
          <Dialog.Content className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center" aria-describedby={undefined}>
            <Dialog.Close asChild>
              <div className="w-[100%]">
                <img src="/icons/ui/close.svg" width={16} className="cursor-pointer float-right"/>
              </div>
            </Dialog.Close>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
        <Dialog.DialogTitle></Dialog.DialogTitle>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
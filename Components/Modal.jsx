import useTheme from "next-theme"


const Modal = ({ open, onClose, classname, children }) => {
    const { theme } = useTheme()

    return (
      // backdrop
      <div
        onClick={onClose}
        className={`
          fixed inset-0 flex justify-center items-center transition-all duration-300 z-[1000]
          ${open ? "visible bg-black/30 backdrop-blur-sm" : "invisible"}
        `}
      >
        {/* modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            ${theme === "dark" ? 'bg-black text-white' : 'bg-white text-black'} rounded-xl shadow p-6 transition-all duration-300
            ${open ? "opacity-100" : "opacity-0"} ${classname}
          `}
        >
          {children}
        </div>
      </div>
    )
  }

  export default Modal
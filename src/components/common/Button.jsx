function Button({ children, onClick, type = "button", variant = "primary", disabled }) {
  const base =
    "w-full py-2 rounded font-medium transition focus:outline-none";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${
        disabled ? "bg-gray-400 cursor-not-allowed" : variants[variant]
      }`}
    >
      {children}
    </button>
  );
}

export default Button;

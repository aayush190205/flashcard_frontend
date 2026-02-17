function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default Input;

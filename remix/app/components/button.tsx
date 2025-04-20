function Button({ children, ...props }: JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={`bg-red-500 hover:bg-red-700 p-2 text-sm text-white ${props.className}`}
    >
      {children}
    </button>
  );
}

export { Button };

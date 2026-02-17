function Flashcard({ card, onFlip }) {
  return (
    <div
      onClick={() => onFlip(card.id)}
      className={`
        cursor-pointer h-64 relative preserve-3d transition-all duration-500 group
        border border-green-900 bg-black/40 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]
      `}
    >
      {/* DECORATION */}
      <div className="absolute top-2 right-2 text-[10px] text-green-800">ID: {card.id.toString().padStart(4, '0')}</div>

      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <h3 className="text-xs text-green-700 uppercase tracking-widest mb-4">
            {card.isFlipped ? "DATA_OUTPUT" : "QUERY_INPUT"}
          </h3>
          <p className={`text-lg font-bold ${card.isFlipped ? "text-green-300" : "text-green-500"}`}>
            {card.isFlipped ? card.answer : card.question}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 w-full text-center pb-2">
        <span className="text-[10px] text-green-900 group-hover:text-green-500 transition-colors">
          [ CLICK_TO_DECRYPT ]
        </span>
      </div>
    </div>
  );
}

export default Flashcard;
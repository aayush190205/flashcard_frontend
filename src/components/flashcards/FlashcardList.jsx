import Flashcard from "./Flashcard";

function FlashcardList({ cards, onFlip }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Flashcard key={card.id} card={card} onFlip={onFlip} />
      ))}
    </div>
  );
}

export default FlashcardList;

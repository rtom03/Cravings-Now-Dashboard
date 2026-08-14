SNAARP DRAG AND DROP

User drags a card
↓
PointerSensor detects movement > 5px → drag activates
↓
@dnd-kit tracks position, animates other cards with Dnd SortableContext
↓
User releases → onDragEnd fires through { active.id, over.id }
↓
handleDragEnd calls reorderCards(activeId, overId)
↓
Zustand is sent a state[key] -- splices the item array into new order
↓
React re-renders the grid/table in the new order

INSTALLATION

Clone From Repo
git clone https://github.com/rtom03/snaarp-react-dnd.git

npm install

npm run dev

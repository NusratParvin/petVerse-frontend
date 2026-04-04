// import { REACTION_TYPE } from "@/src/types";

// const EmojiReactionDock = ({
//   onReact,
// }: {
//   onReact: (reaction: REACTION_TYPE) => void;
// }) => {
//   const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];
//   const emojiToEnum: Record<string, REACTION_TYPE> = {
//     "👍": REACTION_TYPE.LIKE,
//     "❤️": REACTION_TYPE.LOVE,
//     "😂": REACTION_TYPE.HAHA,
//     "😮": REACTION_TYPE.WOW,
//     "😢": REACTION_TYPE.SAD,
//     "😡": REACTION_TYPE.ANGRY,
//   };

//   console.log(reactionSummary);

//   return (
//     <div className="bg-transparent shadow-none rounded-none flex space-x-1">
//       {emojis.map((emoji, index) => (
//         <button
//           key={index}
//           onClick={() => onReact(emojiToEnum[emoji])}
//           className="text-lg hover:scale-125 transition-transform"
//         >
//           {emoji}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default EmojiReactionDock;
import { REACTION_TYPE } from "@/src/types";

const EmojiReactionDock = ({
  onReact,
  reactionSummary,
}: {
  onReact: (reaction: REACTION_TYPE) => void;
  reactionSummary: Record<REACTION_TYPE, number>; // Reaction summary with counts
}) => {
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const emojiToEnum: Record<string, REACTION_TYPE> = {
    "👍": REACTION_TYPE.LIKE,
    "❤️": REACTION_TYPE.LOVE,
    "😂": REACTION_TYPE.HAHA,
    "😮": REACTION_TYPE.WOW,
    "😢": REACTION_TYPE.SAD,
    "😡": REACTION_TYPE.ANGRY,
  };

  return (
    <div className="bg-transparent shadow-none rounded-none flex space-x-2">
      {emojis.map((emoji, index) => {
        const reactionType = emojiToEnum[emoji]; // Map emoji to reaction type
        const count = reactionSummary[reactionType] || 0; // Get count from reactionSummary

        return (
          <div key={index} className="relative flex flex-col items-center">
            {/* Absolute badge for count */}
            {count > 0 && (
              <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                {count}
              </span>
              //   <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3   text-white text-[10px] font-semibold bg-red-100 rounded-full w-4 h-4 flex items-center justify-center">
              //     {count}
              //   </span>
            )}
            <button
              onClick={() => onReact(reactionType)}
              className="text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EmojiReactionDock;

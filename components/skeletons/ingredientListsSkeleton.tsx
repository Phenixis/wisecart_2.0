import IngredientCardSkeleton from "./ingredientCardSkeleton";

export default function ingredientListsSkeleton({isCreationDateVisible, isLastUpdateDateVisible} : {isCreationDateVisible ?: boolean, isLastUpdateDateVisible ?: boolean}) {
  return (
    <div className="animate-pulse p-4 flex items-center flex-wrap justify-between">
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
      <IngredientCardSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} />
    </div>
  );
}
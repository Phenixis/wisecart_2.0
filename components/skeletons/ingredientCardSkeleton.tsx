export default async function IngredientCardSkeleton({ isCreationDateVisible, isLastUpdateDateVisible } : {isCreationDateVisible ?: boolean, isLastUpdateDateVisible ?: boolean}) {
    return (
        <div className="bg-base-200 shadow-md rounded-lg p-2 w-[29%] rounded-xl space-y-1 mb-2 mr-2">
            <div className="flex items-center justify-between">
                <div className="w-16 h-4 bg-base-300"/>
            </div>
            { isCreationDateVisible ? <p className="w-full h-2 bg-base-300"/> : '' }
            { isLastUpdateDateVisible ? <p className="w-full h-2 bg-base-300"/> : '' }
        </div>
    )
}
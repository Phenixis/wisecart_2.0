export default async function Ingredient({ingredient} : {ingredient: any}) {
    return (
        <div className="p-2 border-2 border-neutral rounded-xl">
            <p>{ingredient.name}</p>
            <p>{ingredient.quantity} {ingredient.unit}</p>
        </div>
    )
}
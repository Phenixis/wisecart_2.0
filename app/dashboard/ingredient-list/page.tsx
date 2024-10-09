import verifyUser from "@/components/utils/verifyUser";
import IngredientLists from "@/components/ingredientLists";
import { Metadata } from 'next';
import CreationPopup from "@/components/ui/ingredientCreationPopup";

export const metadata: Metadata = {
  title: 'Ingredient Lists',
};

export default async function DashboardPage() {
    await verifyUser();
    
    return (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Ingredient Lists</h2>
          <CreationPopup />
        </div>
        <IngredientLists isCreationDateVisible={true} isLastUpdateDateVisible={true} isEditPossible={true}/>
      </div>
    );
};
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  ListPlus,
  UserPen,
  Pencil,
  ListX,
  SquareCheck,
  SquareX,
  SquarePlus,
  SquarePen,
  SquareMinus,
  FilePlus,
  FilePen,
  FileX,
  FilePlus2,
  FileMinus2,
  FileMinus,
  FileDown,
  type LucideIcon,
} from 'lucide-react';
import { ActivityType } from '@/lib/db/schema';
import { getActivityLogs } from '@/lib/db/queries';


const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: UserPen,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
  [ActivityType.CREATE_INGREDIENT]: ListPlus,
  [ActivityType.UPDATE_INGREDIENT]: Pencil,
  [ActivityType.DELETE_INGREDIENT]: ListX,
  [ActivityType.CREATE_MEAL]: SquarePlus,
  [ActivityType.UPDATE_MEAL]: SquarePen,
  [ActivityType.ADDED_INGREDIENT_TO_MEAL]: ListPlus,
  [ActivityType.REMOVED_INGREDIENT_FROM_MEAL]: ListX,
  [ActivityType.DELETE_MEAL]: SquareMinus,
  [ActivityType.CREATE_SHOPPING_LIST]: FilePlus,
  [ActivityType.UPDATE_SHOPPING_LIST]: FilePen,
  [ActivityType.ADDED_MEAL_TO_SHOPPING_LIST]: FilePlus2,
  [ActivityType.REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST]: FileMinus2,
  [ActivityType.REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST]: FileMinus2,
  [ActivityType.REMOVED_ALL_MEALS_FROM_SHOPPING_LIST]: FileMinus,
  [ActivityType.COMPLETE_SHOPPING_LIST]: SquareCheck,
  [ActivityType.UNCOMPLETE_SHOPPING_LIST]: SquareX,
  [ActivityType.DELETE_SHOPPING_LIST]: FileX,
  [ActivityType.EXPORTED_SHOPPING_LIST_AS_CSV]: FileDown,
  [ActivityType.EXPORTED_SHOPPING_LIST_AS_MARKDOWN]: FileDown,
  [ActivityType.EXPORTED_SHOPPING_LIST_AS_TEXT]: FileDown,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return 'You signed up';
    case ActivityType.SIGN_IN:
      return 'You signed in';
    case ActivityType.SIGN_OUT:
      return 'You signed out';
    case ActivityType.UPDATE_PASSWORD:
      return 'You changed your password';
    case ActivityType.DELETE_ACCOUNT:
      return 'You deleted your account';
    case ActivityType.UPDATE_ACCOUNT:
      return 'You updated your account';
    case ActivityType.CREATE_TEAM:
      return 'You created a new team';
    case ActivityType.REMOVE_TEAM_MEMBER:
      return 'You removed a team member';
    case ActivityType.INVITE_TEAM_MEMBER:
      return 'You invited a team member';
    case ActivityType.ACCEPT_INVITATION:
      return 'You accepted an invitation';
    case ActivityType.CREATE_INGREDIENT:
      return 'You created a new ingredient';
    case ActivityType.UPDATE_INGREDIENT:
      return 'You updated an ingredient';
    case ActivityType.DELETE_INGREDIENT:
      return 'You deleted an ingredient';
    case ActivityType.CREATE_MEAL:
      return 'You created a new meal';
    case ActivityType.UPDATE_MEAL:
      return 'You updated a meal';
    case ActivityType.ADDED_INGREDIENT_TO_MEAL:
      return 'You added an ingredient to a meal';
    case ActivityType.REMOVED_INGREDIENT_FROM_MEAL:
      return 'You removed an ingredient from a meal';
    case ActivityType.DELETE_MEAL:
      return 'You deleted a meal';
    case ActivityType.CREATE_SHOPPING_LIST:
      return 'You created a new shopping list';
    case ActivityType.UPDATE_SHOPPING_LIST:
      return 'You updated a shopping list';
    case ActivityType.ADDED_MEAL_TO_SHOPPING_LIST:
      return 'You added a meal to a shopping list';
    case ActivityType.REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST:
      return 'You removed one instance of one meal from a shopping list';
    case ActivityType.REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST:
      return 'You removed all instances of one meal from a shopping list';
    case ActivityType.REMOVED_ALL_MEALS_FROM_SHOPPING_LIST:
      return 'You removed all meals from a shopping list';
    case ActivityType.COMPLETE_SHOPPING_LIST:
      return 'You completed a shopping list';
    case ActivityType.UNCOMPLETE_SHOPPING_LIST:
      return 'You uncompleted a shopping list';
    case ActivityType.DELETE_SHOPPING_LIST:
      return 'You deleted a shopping list';
    case ActivityType.EXPORTED_SHOPPING_LIST_AS_CSV:
      return 'You exported a shopping list as CSV';
    case ActivityType.EXPORTED_SHOPPING_LIST_AS_MARKDOWN:
      return 'You exported a shopping list as Markdown';
    case ActivityType.EXPORTED_SHOPPING_LIST_AS_TEXT:
      return 'You exported a shopping list as text';
    default:
      return 'Unknown action occurred';
  }
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.ipAddress && ` from IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                When you perform actions like signing in or updating your
                account, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

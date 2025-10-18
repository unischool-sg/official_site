import { User } from "@/lib/service/user";
import LoginHistoryView from "@/components/layout/login-history";

export default async function HistoryPage() {
     const user = await User.current();
     const history = user?.loginHistory || [];

     return (
          <div className="p-6">
               <LoginHistoryView history={history} />
          </div>
     );
}

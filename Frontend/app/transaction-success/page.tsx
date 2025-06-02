// page.tsx
import { Suspense } from "react";
import TransactionSuccessContent from "./TransactionSuccessContent";

// Loading component untuk fallback
function TransactionLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
    </div>
  );
}

export default function TransactionSuccessPage() {
  return (
    <Suspense fallback={<TransactionLoading />}>
      <TransactionSuccessContent />
    </Suspense>
  );
}
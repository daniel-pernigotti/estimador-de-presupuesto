import { Suspense } from "react"
import { BudgetEstimator } from "@/components/budget-estimator"

export default function Home() {
  return (
    <Suspense fallback={null}>
      <BudgetEstimator />
    </Suspense>
  )
}

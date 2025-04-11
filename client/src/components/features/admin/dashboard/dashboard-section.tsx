import RoomUsageChart from "./components/room-usage-chart";
import TransactionChart from "./components/transaction-chart";

export default function DashboardSection() {
  return (
    <div>
      <RoomUsageChart/>
      <TransactionChart/>
    </div>
  )
}

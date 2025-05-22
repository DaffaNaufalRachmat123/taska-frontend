import { MdOutlineDashboard, MdCleaningServices, MdPolicy, MdReportProblem } from 'react-icons/md';
import { DashboardPage } from '../components/pages/DashboardPage';
export default [
  {
    name: "Dashboard",
    color: "#42a5f5",
    link: "",
    icon: MdOutlineDashboard,
    margin: false,
    element: DashboardPage,
    isSidebar: true,
    isAdmin: true
  }
]
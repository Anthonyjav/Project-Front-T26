import { ToastProvider } from './components/ToastContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

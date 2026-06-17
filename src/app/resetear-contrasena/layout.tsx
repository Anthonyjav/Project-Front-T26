import Navbar from '../../../components/NavbarStatic';

export default function ResetearContrasenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

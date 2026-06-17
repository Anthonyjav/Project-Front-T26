import Navbar from '../../../components/NavbarStatic';

export default function OlvideMiContrasenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

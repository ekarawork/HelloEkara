import LoginBackground from "@/src/components/admin/login/LoginBackground";
import LoginForm from "@/src/components/admin/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background */}
      <LoginBackground />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
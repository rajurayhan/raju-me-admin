import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Admin Panel | R A J U"
        description="Admin Panel | R A J U"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

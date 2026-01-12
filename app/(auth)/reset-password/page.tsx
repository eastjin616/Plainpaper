import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

type ResetPasswordPageProps = {
  searchParams?: {
    token?: string | string[];
  };
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token =
    typeof searchParams?.token === "string" ? searchParams.token : null;

  return <ResetPasswordForm token={token} />;
}

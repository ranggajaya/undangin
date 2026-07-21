import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditorForm } from "@/components/editor/EditorForm";
import { PublishButton } from "@/components/editor/PublishButton";
import { EMPTY_DRAFT_DATA, type DraftInvitationData } from "@/lib/invitation-data";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, owner_id, slug, status, data")
    .eq("id", id)
    .single();

  if (!invitation) notFound();
  if (invitation.owner_id !== user.id) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_used_free_publish")
    .eq("id", user.id)
    .single();

  const draftData: DraftInvitationData = {
    ...EMPTY_DRAFT_DATA,
    ...(invitation.data as Partial<DraftInvitationData>),
  };

  return (
    <EditorForm
      invitationId={invitation.id}
      slug={invitation.slug}
      initialData={draftData}
    >
      {invitation.status === "published" ? (
        <p className="rounded-xl bg-sage/10 p-3 text-center text-sm text-sage">
          Undangan ini sudah publish ✓
        </p>
      ) : (
        <PublishButton
          invitationId={invitation.id}
          hasUsedFreePublish={profile?.has_used_free_publish ?? false}
        />
      )}
    </EditorForm>
  );
}

import type { Metadata } from "next";

import MembersDirectory from "./members-directory";

export const metadata: Metadata = {
  title: "Anggota Jemaat",
  description: "Direktori anggota GMAHK Villa Nusa Indah.",
};

export default function MembersPage() {
  return <MembersDirectory />;
}

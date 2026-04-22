import { useMemo, useState } from "react";
import { Page, Card, Table, Badge, Modal, Field, Input, Select } from "../components/ui";
import { DOCUMENTS, MEMBERS } from "../data";
import { useAuth } from "../AuthContext";
import { FolderLock, UploadCloud, Download, FileText, Search, ShieldCheck } from "lucide-react";

export default function Vault() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([...DOCUMENTS]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ member: MEMBERS[0].name, type: "KYC", name: "", size: "" });

  const visible = useMemo(() => {
    let rows = user.role === "member" ? docs.filter((d) => d.member === user.name) : docs;
    if (type !== "all") rows = rows.filter((d) => d.type === type);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (d) => d.name.toLowerCase().includes(s) || d.member.toLowerCase().includes(s)
      );
    }
    return rows;
  }, [docs, q, type, user]);

  const onUpload = (e) => {
    e.preventDefault();
    const id = `D-${String(docs.length + 1).padStart(3, "0")}`;
    const newDoc = {
      id,
      member: form.member,
      name: form.name || "Uploaded_Document.pdf",
      type: form.type,
      size: form.size || "—",
      uploaded: new Date().toISOString().slice(0, 10),
    };
    setDocs((d) => [newDoc, ...d]);
    setOpen(false);
    setForm({ member: MEMBERS[0].name, type: "KYC", name: "", size: "" });
  };

  return (
    <Page
      title="Document Vault"
      subtitle={user.role === "member" ? "Your secure documents and statements" : "Securely stored KYC docs, loan agreements and statements"}
      actions={
        user.role !== "member" && (
          <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
            <UploadCloud className="h-4 w-4" /> Upload
          </button>
        )
      }
    >
      <Card className="p-4 flex items-center gap-3 bg-emerald-50 border-emerald-100">
        <div className="h-10 w-10 rounded-lg bg-emerald-500 text-white grid place-items-center">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="text-sm text-emerald-900">
          <div className="font-semibold">Encrypted document storage</div>
          <div className="text-xs">Files are served from the backend over TLS with role-based download restrictions · AES-256 at rest.</div>
        </div>
      </Card>

      <Card className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by file name or member…"
            className="!pl-9"
          />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="!w-40">
          <option value="all">All types</option>
          <option value="KYC">KYC</option>
          <option value="Statement">Statement</option>
          <option value="Loan Doc">Loan Doc</option>
        </Select>
      </Card>

      <Table
        columns={[
          { key: "id", label: "Doc ID" },
          {
            key: "name", label: "File",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center">
                  <FileText className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.size}</div>
                </div>
              </div>
            ),
          },
          { key: "member", label: "Member" },
          { key: "type", label: "Type", render: (r) => <Badge tone={r.type === "KYC" ? "blue" : r.type === "Statement" ? "green" : "violet"}>{r.type}</Badge> },
          { key: "uploaded", label: "Uploaded" },
          {
            key: "actions", label: "Actions",
            render: () => (
              <button
                onClick={() => alert("Secure download started (demo).")}
                className="h-8 px-2 rounded-md border border-slate-200 hover:bg-slate-50 text-xs flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            ),
          },
        ]}
        rows={visible}
        empty="No documents match the current filter."
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload Document"
        subtitle="File is stored securely and linked to the selected member"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={onUpload} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <UploadCloud className="h-4 w-4" /> Upload
            </button>
          </>
        }
      >
        <form onSubmit={onUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Member">
            <Select value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
              {MEMBERS.map((m) => <option key={m.id}>{m.name}</option>)}
            </Select>
          </Field>
          <Field label="Document type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>KYC</option>
              <option>Statement</option>
              <option>Loan Doc</option>
            </Select>
          </Field>
          <Field label="File" hint="Demo upload — file is not actually transmitted.">
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setForm((s) => ({ ...s, name: f.name, size: `${Math.ceil(f.size / 1024)} KB` }));
              }}
              className="block w-full text-sm text-slate-600 file:h-10 file:mr-3 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-sm file:cursor-pointer"
            />
          </Field>
          <Field label="Detected file name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="document.pdf" />
          </Field>
        </form>
      </Modal>
    </Page>
  );
}

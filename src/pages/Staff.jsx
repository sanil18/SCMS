import { useState } from "react";
import { Page, Card, Table, Badge, Modal, Field, Input, Select } from "../components/ui";
import { STAFF } from "../data";
import { Plus, UserCog, Trash2, Pencil, ShieldCheck } from "lucide-react";

export default function Staff() {
  const [rows, setRows] = useState([...STAFF]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Accountant", status: "Active" });

  const startNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", role: "Accountant", status: "Active" });
    setOpen(true);
  };

  const startEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, role: s.role, status: s.status });
    setOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (editing) {
      setRows((rs) => rs.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
    } else {
      const id = `S-${String(rows.length + 1).padStart(2, "0")}`;
      const joined = new Date().toISOString().slice(0, 10);
      setRows((rs) => [...rs, { id, ...form, joined, lastLogin: "—" }]);
    }
    setOpen(false);
  };

  const remove = (id) => {
    if (confirm("Delete this staff account? This revokes all access.")) {
      setRows((rs) => rs.filter((r) => r.id !== id));
    }
  };

  return (
    <Page
      title="Staff Management"
      subtitle="Create, update and revoke access for Accountants and Managers"
      actions={
        <button onClick={startNew} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm flex items-center gap-2 hover:bg-slate-800">
          <Plus className="h-4 w-4" /> New Staff
        </button>
      }
    >
      <Card className="p-4 flex items-center gap-3 bg-blue-50 border-blue-100">
        <div className="h-10 w-10 rounded-lg bg-blue-500 text-white grid place-items-center">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="text-sm text-blue-900">
          <div className="font-semibold">Role-Based Access Control (RBAC)</div>
          <div className="text-xs">Admin can provision and revoke staff accounts. All actions are written to the audit log.</div>
        </div>
      </Card>

      <Table
        columns={[
          { key: "id", label: "ID" },
          {
            key: "name", label: "Staff",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 grid place-items-center text-white text-xs font-bold">
                  {r.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </div>
              </div>
            ),
          },
          { key: "role", label: "Role", render: (r) => <Badge tone="violet">{r.role}</Badge> },
          { key: "joined", label: "Joined" },
          { key: "lastLogin", label: "Last Login" },
          {
            key: "status", label: "Status",
            render: (r) => <Badge tone={r.status === "Active" ? "green" : "red"}>{r.status}</Badge>,
          },
          {
            key: "actions", label: "Actions",
            render: (r) => (
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(r)} className="h-8 px-2 rounded-md border border-slate-200 hover:bg-slate-50 text-xs flex items-center gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => remove(r.id)} className="h-8 px-2 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-xs flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Staff" : "New Staff Account"}
        subtitle={editing ? "Update role or access status" : "Provision a new Accountant or Manager account"}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={save} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 flex items-center gap-2">
              <UserCog className="h-4 w-4" /> {editing ? "Save Changes" : "Create Account"}
            </button>
          </>
        }
      >
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Priya Khadka" />
          </Field>
          <Field label="Email (login)">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="name@scms.coop" />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option>Accountant</option>
              <option>Manager</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Suspended</option>
            </Select>
          </Field>
          {!editing && (
            <Field label="Temporary password" hint="Staff will be required to change on first login and enroll MFA.">
              <Input type="text" defaultValue="Welcome@2026" readOnly />
            </Field>
          )}
        </form>
      </Modal>
    </Page>
  );
}

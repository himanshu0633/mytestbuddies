import React, { useEffect, useState } from "react";
import api from "../utils/axios";

export default function AdminFieldsPage() {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    for: "student", // Default to student
  });
  const [editingFieldId, setEditingFieldId] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  // ✅ Fetch all fields (GET /api/fields)
  const fetchFields = async () => {
    try {
      const { data } = await api.get("/admin/fields");
      setFields(data);
    } catch (err) {
      console.error("Error fetching fields:", err);
    }
  };

  // ✅ Create or update field
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form); // Debugging: Check form data before submitting

    try {
      if (editingFieldId) {
        // UPDATE field
        const { data } = await api.put(`/admin/fields/${editingFieldId}`, form);
        setFields((prev) =>
          prev.map((f) => (f._id === editingFieldId ? data : f))
        );
        setEditingFieldId(null);
      } else {
        // CREATE field
        const { data } = await api.post("/admin/fields", form);
        setFields((prev) => [data, ...prev]);
      }
      setForm({ name: "", description: "", for: "student" }); // Reset form
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  // ✅ Edit field
  const handleEdit = (field) => {
    setForm({
      name: field.name,
      description: field.description || "",
      for: field.for,
    });
    setEditingFieldId(field._id);
  };

  // ✅ Delete field
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    try {
      await api.delete(`/admin/fields/${id}`);
      setFields((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting field:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Manage Fields / Exams</h2>

      {/* Create / Update field form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Field name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          value={form.for}
          onChange={(e) => setForm({ ...form, for: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="general">General</option>
        </select>

        <button type="submit">{editingFieldId ? "Update" : "Create"} Field</button>
        {editingFieldId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", description: "", for: "student" });
              setEditingFieldId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* List all fields */}
      <h3>Existing Fields</h3>
      <ul>
        {fields.map((f) => (
          <li key={f._id} style={{ marginBottom: 8 }}>
            <strong>{f.name}</strong> — {f.description || "No description"} (
            default time: {f.for === "student" ? "student" : "General"}){" "}
            <button onClick={() => handleEdit(f)}>Edit</button>{" "}
            <button onClick={() => handleDelete(f._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

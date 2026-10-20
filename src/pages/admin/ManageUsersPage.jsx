import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import AdminSidebar from "../../components/common/AdminSidebar";
import { Spinner } from "../../components/common";

export default function ManageUsersPage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
});

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const res = await userApi.getAllUsers();
            setUsers(res.data.data);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }
    
function handleEdit(user) {
    setEditingUser(user.id);

    setEditForm({
        name: user.name,
        phone: user.phone,
    });
}
async function handleSave(id) {

    try {

        await userApi.updateUser(id, editForm);

        toast.success("User updated successfully");

        setEditingUser(null);

        loadUsers();

    } catch (err) {

        toast.error(
            err.response?.data?.message || "Update failed"
        );

    }

}
function handleCancel() {
    setEditingUser(null);
}

async function handleDelete(id) {

    if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
    }

    try {

        await userApi.deleteUser(id);

        toast.success("User deleted successfully");

        loadUsers();

    } catch (err) {

        toast.error(
            err.response?.data?.message || "Delete failed"
        );

    }

}

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-content">

                <h2 className="section-title">
                    Manage <span>Users</span>
                </h2>

                {loading ? (
                    <Spinner />
                ) : (
                    <div className="card">

                        <table className="table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map(user => (

                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>

    {editingUser === user.id ? (

        <input
            className="form-control"
            value={editForm.name}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    name: e.target.value,
                })
            }
        />

    ) : (

        user.name

    )}

</td>
                                        <td>{user.email}</td>
                                        <td>

    {editingUser === user.id ? (

        <input
            className="form-control"
            value={editForm.phone}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    phone: e.target.value,
                })
            }
        />

    ) : (

        user.phone

    )}

</td>
                                        <td>{user.role}</td>
<td>

    {editingUser === user.id ? (

        <>
            <button
                className="btn btn-success btn-sm"
                onClick={() => handleSave(user.id)}
            >
                💾 Save
            </button>

            <button
                className="btn btn-outline btn-sm"
                style={{ marginLeft: "8px" }}
                onClick={handleCancel}
            >
                Cancel
            </button>
        </>

    ) : (

        <>
            <button
                className="btn btn-primary btn-sm"
                style={{ marginRight: "8px" }}
                onClick={() => handleEdit(user)}
            >
                ✏️ Edit
            </button>

            <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(user.id)}
>
    🗑 Delete
</button>
        </>

    )}

</td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </main>

        </div>
    );
}
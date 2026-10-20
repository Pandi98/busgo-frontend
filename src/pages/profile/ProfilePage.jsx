import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function handleSave() {
  try {
    const res = await userApi.updateProfile({
      name: profile.name,
      phone: profile.phone,
    });

    const updatedProfile = res.data.data;

    setProfile(updatedProfile);

    updateUser(updatedProfile);

    toast.success("Profile updated successfully");

    setEditing(false);

  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
}

  if (!profile) {
    return (
      <div className="page">
        <div className="container">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  

  return (
    <div className="page">
      <div className="container">

        <h2 className="section-title">
          My <span>Profile</span>
        </h2>

        <div
          className="card"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "2rem",
          }}
        >
          {/* Avatar */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.3rem",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name */}

          {editing ? (
  <input
    className="form-control"
    style={{
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: ".5rem",
    }}
    value={profile.name}
    onChange={(e) =>
      setProfile({ ...profile, name: e.target.value })
    }
  />
) : (
  <h2
    style={{
      textAlign: "center",
      marginBottom: ".3rem",
    }}
  >
    {profile.name}
  </h2>
)}
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              marginBottom: "2rem",
            }}
          >
            {profile.role}
          </p>

          {/* Information */}

          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <div className="card">
              <strong>📧 Email</strong>
              <p>{profile.email}</p>
            </div>

           <div className="card">
  <strong>📱 Phone</strong>

  {editing ? (
    <input
      className="form-control"
      value={profile.phone}
      onChange={(e) =>
        setProfile({
          ...profile,
          phone: e.target.value,
        })
      }
    />
  ) : (
    <p>{profile.phone}</p>
  )}
</div>
            <div className="card">
              <strong>🛡 Role</strong>
              <p>{profile.role}</p>
            </div>
          </div>

          {/* Button */}

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            {/* <button className="btn btn-primary">
              ✏️ Edit Profile
            </button> */}


                {editing ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
    }}
  >
    <button
      className="btn btn-success"
      onClick={handleSave}
    >
      💾 Save Changes
    </button>

    <button
      className="btn btn-outline"
      onClick={() => {
        setEditing(false);
        loadProfile();
      }}
    >
      Cancel
    </button>
  </div>
) : (
  <button
    className="btn btn-primary"
    onClick={() => setEditing(true)}
  >
    ✏️ Edit Profile
  </button>
)}

          </div>

        </div>
      </div>
    </div>
  );
}
import './Profile.css'

export const Profile = () => {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const bio = localStorage.getItem("bio");
  const city = localStorage.getItem("city");
  const username = localStorage.getItem("username");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">{name} ({username})</h2>
        <p className="profile-email">{email}</p>
        <p className="profile-location">{city}</p>
        <p className="profile-bio">{bio}</p>
      </div>
    </div>
  );
};
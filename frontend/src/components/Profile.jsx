import { useAuth0 } from "@auth0/auth0-react";
const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div className="profile">
      <h1> profile </h1>

      {isAuthenticated ? (
        <article>
          {user?.picture && <img src={user.picture} alt={user?.name} />}
          <h2>{user?.name}</h2>
          <ul className="ProfileUl">
            {Object.keys(user)
              .filter((prop) => (prop != "picture") && (prop != "email_verified") && (prop != "updated_at") && (prop !="sub")).map((prop, i) => (
                <li key={i}>
                  {prop}: {user[prop]}
                </li>
              ))}
          </ul>
        </article>
      ) : (
        <h1>NA</h1>
      )}
    </div>
  );
};

export default Profile;

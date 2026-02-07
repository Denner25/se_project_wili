import { Navigate, useParams } from "react-router-dom";

function LegacyProfileTabRedirect({ tab }) {
  const { userId } = useParams();

  const destination = userId
    ? `/profile/${userId}/${tab}`
    : `/profile/${tab}`;

  return <Navigate to={destination} replace />;
}

export default LegacyProfileTabRedirect;

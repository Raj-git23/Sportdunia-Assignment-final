import { GoogleOAuthProvider } from '@react-oauth/google';
import Authentication from "./Authentication";

export default function Page() {
  const clientId ="1005507075419-m5c0v61g21brscbpntnc2l8eq13mpvm0.apps.googleusercontent.com"
  
  if (!clientId) {
    console.error('Google Client ID not found');
    return <div>Configuration error</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Authentication />
    </GoogleOAuthProvider>
  )
}
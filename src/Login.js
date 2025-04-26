import { auth, provider } from "./Firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        // Kullanıcı bilgilerini burada kaydedebilirsin
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      <button onClick={signInWithGoogle}>Google ile Giriş Yap</button>
    </div>
  );
}

export default Login;
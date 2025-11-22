import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  return (
    <header className="w-full p-4 bg-white shadow flex justify-end">
      <button
        onClick={() => signOut(auth)}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </header>
  );
}

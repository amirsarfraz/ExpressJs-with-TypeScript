import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { setUser, clearUser } from "../../redux/userSlice.ts";;

const Navbar = () => {
  const userEmail = useSelector((state: RootState) => state.user.email);
  const dispatch = useDispatch();
  console.log("userEmail", userEmail);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser);

      dispatch(
        setUser({
          email: parsedUser.email,
          username: null,
          role: parsedUser.email,
        })
      );
    }
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("storedUser raw:", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("parsedUser:", parsedUser); // Make sure parsedUser.email exists
      dispatch(
        setUser({
          email: parsedUser.email,
          username: null,
          role: parsedUser.email,
        })
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img className="w-8 h-8" src="/crud-logo.ico" alt="logo" />
        <div className="text-xl font-bold">MyApp</div>
      </div>

      <div className="flex items-center space-x-4">
        {userEmail ? <span>{userEmail}</span> : <span>Guest</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

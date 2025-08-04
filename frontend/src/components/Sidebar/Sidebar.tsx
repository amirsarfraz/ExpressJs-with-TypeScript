import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="h-screen w-50 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">CRUD Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/create" className="hover:bg-gray-700 p-2 rounded">Create Item</Link>
        <Link to="/items" className="hover:bg-gray-700 p-2 rounded">View Items</Link>
        <Link to="/settings" className="hover:bg-gray-700 p-2 rounded">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

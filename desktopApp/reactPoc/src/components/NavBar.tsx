import { Link, Outlet } from "react-router-dom";

export default function NavBar() {
    return <div>
        <ul>
            <li>
                <Link to={`/consortia`}>consortia</Link>
            </li>
            <li>
                <Link to={`/computations`}>computations</Link>
            </li>
            <li>
                <Link to={`/login`}>login</Link>
            </li>
        </ul>
        <Outlet></Outlet>
    </div>
}
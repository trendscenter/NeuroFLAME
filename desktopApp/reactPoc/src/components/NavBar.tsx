import { Link, Outlet } from "react-router-dom";
import { useUserState } from "../contexts/UserStateContext";

export default function NavBar() {
    const { username } = useUserState()
    return <div>
        <div>
            {
                username && <div>{username}</div>
            }
            {
                !username && <div>Not logged in</div>
            }
        </div>
        <ul>
            <li>
                <Link to={`/login`}>login</Link>
            </li>
            <li>
                <Link to={`/computations`}>computations</Link>
            </li>
            <li>
                <Link to={`/consortia`}>consortia</Link>
            </li>
            <li>
                <Link to={"/appConfig"}>app config</Link>
            </li>
        </ul>
        <Outlet></Outlet>
    </div>
}
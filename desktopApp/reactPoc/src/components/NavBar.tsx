import { Link, Outlet } from "react-router-dom";
import { useUserState } from "../contexts/UserStateContext";

interface NavBarProps {
    style?: React.CSSProperties;
}

const NavBar: React.FC<NavBarProps> = ({ style }) => {
    const { username, roles } = useUserState()
    return <div style={{ ...style }}>
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
            <li>
                <Link to={"/notifications"}>notifications</Link>
            </li>
        </ul>
        {
            roles.includes('admin') && <ul>
                <li>
                    <Link to={"/adminChangeUserPassword"}>admin change user password</Link>
                </li>
            </ul>
        }
    </div >
}

const Layout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <NavBar style={{ width: '250px', flexShrink: 0 }} />
            <div style={{ flexGrow: 1, padding: '20px', overflow: 'auto' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

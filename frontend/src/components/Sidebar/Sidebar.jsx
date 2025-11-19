import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    UserCircle,
    Settings,
    LogOut,
    MessageSquareText,
} from 'lucide-react';
import '../../pages/DashboardLayout/DashboardLayout.css';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../feature/AuthSlice';

const Sidebar = () => {
    const { role } = useSelector(state => state.auth);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isActive = (path) => {
        const currentPath = location.pathname;
        if (path === '/dashboard') {
            return currentPath === path || currentPath === path + '/';
        }
        return currentPath.startsWith(path) && (currentPath.length === path.length || currentPath.charAt(path.length) === '/');
    };

    const handleLogout = async () => {

        try {
            let result = await dispatch(logoutUser());
            if (result.meta.requestStatus == "fulfilled") {
                navigate('/')
                toast.success('You Successfully Logged out');
                return
            }
        } catch (error) {
            console.log("Error while logging out the use : ", error);

        }
    }


    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-app-name">TAMAZIRT</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>

                    {
                        role == "admin" && (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                                    >
                                        <LayoutDashboard size={20} className="nav-icon" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/navigators"
                                        className={`nav-item ${isActive('/dashboard/navigators') ? 'active' : ''}`}
                                    >
                                        <Briefcase size={20} className="nav-icon" />
                                        <span>Navigators</span>
                                    </Link>

                                </li>
                                <li>

                                    <Link
                                        to="/dashboard/tourists"
                                        className={`nav-item ${isActive('/dashboard/tourists') ? 'active' : ''}`}
                                    >
                                        <UserCircle size={20} className="nav-icon" />
                                        <span>Tourists</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/settings"
                                        className={`nav-item ${isActive('/dashboard/settings') ? 'active' : ''}`}
                                    >
                                        <Settings size={20} className="nav-icon" />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                            </>
                        )
                    }

                    {
                        role == "navigator" && (
                            <li>
                                <Link
                                    to="/dashboard/navigator/profile"
                                    className={`nav-item ${isActive('/dashboard//navigator/profile') ? 'active' : ''}`}
                                >
                                    <UserCircle size={20} className="nav-icon" />
                                    <span>My Profile</span>
                                </Link>
                            </li>
                        )
                    }



                </ul>
            </nav>
            <div className="sidebar-footer">
                <Link className="nav-item logout" onClick={handleLogout}>
                    <LogOut size={20} className="nav-icon" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
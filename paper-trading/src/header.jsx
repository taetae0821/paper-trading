import { NavLink, useNavigate } from 'react-router'
import { api } from './api'
import './header.css'

const menus = [
    { to: '/market', label: '마켓' },
    { to: '/portfolio', label: '포트폴리오' },
    { to: '/history', label: '거래 내역' },
    { to: '/ranking', label: '랭킹' },
    { to: '/admin', label: '관리자', adminOnly: true },
];

function Header({ me }){
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api('/logout', { method: 'POST' });
        navigate('/login');
    };

    return(
        <header className="header">
            <h1 className="header-brand">모의투자</h1>
            <nav className="header-nav">
                {menus.filter((menu) => !menu.adminOnly || me.isAdmin).map((menu) => (
                    <NavLink
                        key={menu.to}
                        to={menu.to}
                        className={({ isActive }) => isActive ? 'header-link active' : 'header-link'}
                    >
                        {menu.label}
                    </NavLink>
                ))}
            </nav>
            <div className='user'>
                <p className="user-cash">
                    보유 현금 <strong>₩{me.cash.toLocaleString('ko-KR')}</strong>
                </p>
                <span className="user-avatar">{me.nickname[0]}</span>
                <p className="user-name">{me.nickname}</p>
                <button type="button" className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
        </header>
    );
}

export default Header;

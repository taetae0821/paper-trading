import { useCallback, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { api } from './api'
import Header from './header'

function Layout(){
    const [me, setMe] = useState(null);
    const [loggedOut, setLoggedOut] = useState(false);

    // 주문 후 보유 현금을 다시 불러올 때도 씀 (useOutletContext로 꺼내 쓰기)
    const refreshMe = useCallback(() => {
        return api('/me')
            .then(setMe)
            .catch((err) => {
                if (err.status === 401) setLoggedOut(true);
            });
    }, []);

    useEffect(() => {
        api('/me')
            .then(setMe)
            .catch((err) => {
                if (err.status === 401) setLoggedOut(true);
            });
    }, []);

    if (loggedOut) return <Navigate to="/login" replace />;
    if (!me) return null;

    return(
        <>
            <Header me={me} />
            <Outlet context={{ me, refreshMe }} />
        </>
    );
}

export default Layout;

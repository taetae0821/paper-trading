import { Link } from 'react-router'
import './login.css'

function Login(){
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return(
        <div className="login-container">
            <div className="login-box">
                <div className="login-left">
                    <h3 className="login-brand">모의투자</h3>
                    <h2 className="login-headline">
                        가상 자금 1,000만 원으로<br />
                        투자를 연습해 보세요
                    </h2>
                    <ol className="login-steps">
                        <li><span className="login-step-num">01</span>가입하면 기본 계좌가 만들어지고 초기 자금이 입금됩니다.</li>
                        <li><span className="login-step-num">02</span>가상 종목을 현재가로 사고팔 수 있습니다.</li>
                        <li><span className="login-step-num">03</span>수익률로 다른 참가자와 순위를 겨룹니다.</li>
                    </ol>
                    <p className="login-notice">실제 돈과 실제 시세를 사용하지 않는 연습용 서비스입니다.</p>
                </div>

                <div className="login-right">
                    <h2 className="login-title">로그인</h2>
                    <p className="login-signup-link">아직 계정이 없나요? <Link to="/signup">회원가입</Link></p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label className="login-field">
                            <span>이메일</span>
                            <input type="email" placeholder="name@example.com" required />
                        </label>

                        <label className="login-field">
                            <span>비밀번호</span>
                            <input type="password" required />
                        </label>

                        <button type="submit" className="login-btn">로그인</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

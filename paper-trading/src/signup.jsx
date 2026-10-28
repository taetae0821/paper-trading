import './signup.css'

function Signup(){
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return(
        <div className="container">
            <div className="rounded-box">
                <div className="box-left">
                    <h3 className="title">모의투자</h3>
                    <h2 className="headline">
                        가상 자금 1,000만 원으로<br />
                        투자를 연습해 보세요
                    </h2>
                    <ol className="steps">
                        <li><span className="step-num">01</span>가입하면 기본 계좌가 만들어지고 초기 자금이 입금됩니다.</li>
                        <li><span className="step-num">02</span>가상 종목을 현재가로 사고팔 수 있습니다.</li>
                        <li><span className="step-num">03</span>수익률로 다른 참가자와 순위를 겨룹니다.</li>
                    </ol>
                    <p className="notice">실제 돈과 실제 시세를 사용하지 않는 연습용 서비스입니다.</p>
                </div>

                <div className="box-right">
                    <h2 className="form-title">회원가입</h2>
                    <p className="login-link">이미 계정이 있나요? <a href="#">로그인</a></p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label className="field">
                            <span>닉네임</span>
                            <input type="text" placeholder="랭킹에 표시됩니다" required />
                        </label>

                        <label className="field">
                            <span>이메일</span>
                            <input type="email" placeholder="name@example.com" required />
                        </label>

                        <div className="field-row">
                            <label className="field">
                                <span>비밀번호</span>
                                <input type="password" required />
                            </label>
                            <label className="field">
                                <span>비밀번호 확인</span>
                                <input type="password" required />
                            </label>
                        </div>

                        <label className="field">
                            <span>계좌 이름</span>
                            <input type="text" defaultValue="기본 계좌" />
                        </label>

                        <div className="deposit">
                            <span>초기 입금액</span>
                            <strong><span className="mono">10,000,000</span>원</strong>
                        </div>

                        <button type="submit" className="submit-btn">가입하고 시작하기</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;

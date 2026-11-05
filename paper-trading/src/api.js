// 백엔드 API 호출. 실패하면 서버가 준 { error } 메시지로 Error를 던진다.
export async function api(path, { method = 'GET', body } = {}) {
    const res = await fetch(`/api${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.error ?? '요청에 실패했습니다');
        err.status = res.status;
        throw err;
    }
    return data;
}

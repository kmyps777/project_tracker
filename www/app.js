// ================================================================
//  FIREBASE CONFIGURATION
// ================================================================
const firebaseConfig = {
    apiKey:            "AIzaSyBAh82To_RQRTXCv9Os1QXU2HN55uEA_GE",
    authDomain:        "new-project-tracker-582f7.firebaseapp.com",
    projectId:         "new-project-tracker-582f7",
    storageBucket:     "new-project-tracker-582f7.firebasestorage.app",
    messagingSenderId: "726194659577",
    appId:             "1:726194659577:web:1da2023e58d354e0a64228"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();
const TS   = firebase.firestore.FieldValue.serverTimestamp;

// ================================================================
//  COLOR SWATCHES
// ================================================================
const COLOR_SWATCHES = [
    '#94a3b8','#6360f4','#059669','#ec4899',
    '#f59e0b','#0891b2','#7c3aed','#ef4444',
    '#f97316','#14b8a6','#3b82f6','#84cc16'
];

// ================================================================
//  STATE
// ================================================================
const S = {
    user:              null,
    currentProjectId:  null,
    currentProject:    null,
    currentTab:        'status',
    projects:          [],
    updates:           [],
    improvements:      [],
    memos:             [],
    statusOptions: [
        { label: '대기중', color: '#94a3b8' },
        { label: '제작중', color: '#6360f4' },
        { label: '완료',   color: '#059669' },
    ],
    listeners:  [],
    dashUnsub:  null,
};

let _impAddLock = false;
let _orderLock  = false;

// ================================================================
//  HELPERS
// ================================================================
function uid()   { return db.collection('_').doc().id; }

function fmtDate(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' });
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function normalizeOpt(opt) {
    if (typeof opt === 'string') {
        const defaults = { '대기중':'#94a3b8', '제작중':'#6360f4', '완료':'#059669' };
        return { label: opt, color: defaults[opt] || '#7c3aed' };
    }
    return opt;
}

function badgeStyle(color) {
    return `color:${color};background:${color}18;border:1.5px solid ${color}44`;
}

// 사용자별 Firestore 루트
function userRef() {
    return db.collection('users').doc(S.user.uid);
}



// ================================================================
//  TOAST
// ================================================================
function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className   = `toast toast-${type}`;
    el.textContent = msg;
    document.getElementById('toast-container').appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 280);
    }, 2600);
}


// ================================================================
//  MODAL
// ================================================================
let _onConfirm   = null;
let _confirmBusy = false;

function runConfirm() {
    if (_confirmBusy || !_onConfirm) return;
    _confirmBusy = true;
    const fn = _onConfirm;
    _onConfirm = null;
    try { fn(); } catch(e) { console.error(e); }
    setTimeout(() => { _confirmBusy = false; }, 600);
}

function openModal(title, bodyHTML, onConfirm = null, confirmLabel = '확인') {
    _onConfirm   = onConfirm;
    _confirmBusy = false;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML    = bodyHTML;

    const footer = document.getElementById('modal-footer');
    footer.innerHTML = '';

    if (onConfirm) {
        const ok = document.createElement('button');
        ok.className   = 'btn btn-primary';
        ok.textContent = confirmLabel;
        ok.onclick     = runConfirm;
        footer.appendChild(ok);
    }

    const cancel = document.createElement('button');
    cancel.className   = 'btn btn-ghost';
    cancel.textContent = onConfirm ? '취소' : '닫기';
    cancel.onclick     = closeModal;
    footer.appendChild(cancel);

    document.getElementById('modal-backdrop').classList.remove('hidden');

    setTimeout(() => {
        const first = document.querySelector('#modal-body input[type="text"], #modal-body input[type="email"]');
        first?.focus();
        document.querySelectorAll('#modal-body input[type="text"]').forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); runConfirm(); }
            });
        });
    }, 60);
}

function closeModal() {
    _onConfirm = null;
    document.getElementById('modal-backdrop').classList.add('hidden');
    document.getElementById('modal-body').innerHTML   = '';
    document.getElementById('modal-footer').innerHTML = '';
}


// ================================================================
//  LOADING
// ================================================================
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}


// ================================================================
//  AUTH — 사용자 상태에 따른 UI 업데이트
// ================================================================
function updateAuthUI() {
    const btn = document.getElementById('auth-action-btn');
    const bar = document.getElementById('user-info-bar');
    if (!btn || !bar) return;

    if (!S.user || S.user.isAnonymous) {
        // 익명 사용자
        btn.textContent = '📧 이메일 연동';
        btn.title       = '이메일 연동 시 다른 기기에서도 데이터를 사용할 수 있습니다';
        btn.onclick     = openLinkEmailModal;
        bar.innerHTML   = `
            <span>👤 게스트 모드</span>
            <span class="user-bar-hint">· 이메일 연동 시 다기기 동기화 가능</span>
            <button class="user-bar-signin-btn" id="signin-existing-btn">이미 계정이 있으신가요? 로그인</button>
        `;
        document.getElementById('signin-existing-btn')?.addEventListener('click', openSignInModal);
    } else {
        // 이메일 로그인 사용자
        btn.textContent = '로그아웃';
        btn.title       = '로그아웃';
        btn.onclick     = doSignOut;
        bar.innerHTML   = `
            <span>✉️ ${esc(S.user.email)}</span>
            <span class="user-bar-hint">· 이메일 계정으로 로그인됨</span>
        `;
    }
}

function getAuthErrorMsg(code) {
    const map = {
        'auth/user-not-found':       '이메일 또는 비밀번호가 잘못되었습니다.',
        'auth/wrong-password':       '이메일 또는 비밀번호가 잘못되었습니다.',
        'auth/invalid-credential':   '이메일 또는 비밀번호가 잘못되었습니다.',
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
        'auth/weak-password':        '비밀번호는 6자 이상이어야 합니다.',
        'auth/invalid-email':        '올바른 이메일 형식이 아닙니다.',
        'auth/too-many-requests':    '잠시 후 다시 시도해주세요.',
        'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
        'auth/credential-already-in-use': '이 이메일은 다른 계정에서 이미 사용 중입니다.',
    };
    return map[code] || '오류가 발생했습니다. 다시 시도해주세요.';
}

// ── 익명 계정 → 이메일 연동 (업그레이드) ──────────────────────
function openLinkEmailModal() {
    openModal('이메일 연동',
        `<p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;line-height:1.7">
            이메일과 비밀번호를 등록하면 다른 기기에서도<br>
            같은 계정으로 로그인하여 데이터를 사용할 수 있습니다.
         </p>
         <div class="form-group">
             <label>이메일</label>
             <input type="email" id="link-email" class="form-input"
                    placeholder="example@email.com" autocomplete="email">
         </div>
         <div class="form-group">
             <label>비밀번호 (6자 이상)</label>
             <input type="password" id="link-pw" class="form-input"
                    placeholder="비밀번호 입력" autocomplete="new-password">
         </div>
         <div class="form-group">
             <label>비밀번호 확인</label>
             <input type="password" id="link-pw2" class="form-input"
                    placeholder="비밀번호 재입력" autocomplete="new-password">
         </div>
         <div id="link-error" class="link-error hidden"></div>`,
        async () => {
            const email = document.getElementById('link-email')?.value.trim();
            const pw    = document.getElementById('link-pw')?.value;
            const pw2   = document.getElementById('link-pw2')?.value;
            const errEl = document.getElementById('link-error');

            const showErr = (msg) => {
                if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
            };

            if (!email || !pw) { showErr('이메일과 비밀번호를 입력해주세요.'); return; }
            if (pw !== pw2)    { showErr('비밀번호가 일치하지 않습니다.'); return; }

            try {
                const credential = firebase.auth.EmailAuthProvider.credential(email, pw);
                await auth.currentUser.linkWithCredential(credential);
                closeModal();
                updateAuthUI();
                toast(`"${email}"로 연동되었습니다! 🎉`);
            } catch (err) {
                showErr(getAuthErrorMsg(err.code));
            }
        }, '연동하기'
    );
}

// ── 기존 이메일 계정으로 로그인 (다른 기기에서) ──────────────
function openSignInModal() {
    openModal('이메일로 로그인',
        `<p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;line-height:1.7">
            다른 기기에서 연동한 계정으로 로그인하면<br>
            기존 데이터를 이어서 사용할 수 있습니다.
         </p>
         <div class="form-group">
             <label>이메일</label>
             <input type="email" id="signin-email" class="form-input"
                    placeholder="example@email.com" autocomplete="email">
         </div>
         <div class="form-group">
             <label>비밀번호</label>
             <input type="password" id="signin-pw" class="form-input"
                    placeholder="비밀번호 입력" autocomplete="current-password">
         </div>
         <div id="signin-error" class="link-error hidden"></div>
         <p style="font-size:0.78rem;color:var(--text-dim);margin-top:10px">
             ※ 로그인 후 현재 게스트 데이터는 사라지고 계정 데이터를 불러옵니다.
         </p>`,
        async () => {
            const email = document.getElementById('signin-email')?.value.trim();
            const pw    = document.getElementById('signin-pw')?.value;
            const errEl = document.getElementById('signin-error');

            const showErr = (msg) => {
                if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
            };

            if (!email || !pw) { showErr('이메일과 비밀번호를 입력해주세요.'); return; }

            try {
                // 기존 익명 리스너 정리 후 이메일 로그인
                S.listeners.forEach(u => u()); S.listeners = [];
                if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
                await auth.signInWithEmailAndPassword(email, pw);
                // onAuthStateChanged 가 자동으로 처리
                closeModal();
            } catch (err) {
                showErr(getAuthErrorMsg(err.code));
            }
        }, '로그인'
    );
}

// ── 로그아웃 ──────────────────────────────────────────────────
async function doSignOut() {
    if (!confirm('로그아웃 하시겠습니까?\n로그아웃 후 게스트 모드로 전환됩니다.')) return;
    S.listeners.forEach(u => u()); S.listeners = [];
    if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
    S.projects = []; S.updates = []; S.improvements = []; S.memos = [];
    S.currentProjectId = null; S.currentProject = null;
    goToDashboard();
    await auth.signOut();
    // onAuthStateChanged 가 자동으로 새 익명 세션 시작
}


// ================================================================
//  NAVIGATION
// ================================================================
function goToDashboard() {
    S.listeners.forEach(u => u());
    S.listeners = [];
    S.currentProjectId = null;
    S.currentProject   = null;
    S.updates = []; S.improvements = []; S.memos = [];
    document.getElementById('project-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.remove('hidden');
}

async function goToProject(id) {
    S.currentProjectId = id;
    S.currentTab = 'improvements';

    // 이전 프로젝트 콘텐츠 초기화 (잔상 방지)
    document.getElementById('improvements-list').innerHTML = '';
    document.getElementById('current-update-section').innerHTML = '';
    document.getElementById('updates-history').innerHTML = '';
    document.getElementById('memos-list').innerHTML = '';
    document.getElementById('status-options-grid').innerHTML = '';
    document.getElementById('project-name-title').textContent = '';

    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('project-page').classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === 'improvements')
    );
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('tab-improvements').classList.remove('hidden');
    await setupProjectListeners(id);
}


// ================================================================
//  FIRESTORE — CONFIG (사용자별)
// ================================================================
async function loadStatusOptions() {
    const snap = await userRef().collection('config').doc('app').get();
    if (snap.exists && snap.data().statusOptions?.length) {
        S.statusOptions = snap.data().statusOptions.map(normalizeOpt);
    } else {
        await userRef().collection('config').doc('app').set({ statusOptions: S.statusOptions });
    }
}

async function saveStatusOptions() {
    await userRef().collection('config').doc('app').set({ statusOptions: S.statusOptions });
}


// ================================================================
//  FIRESTORE — PROJECTS (사용자별)
// ================================================================
function listenProjects() {
    return userRef().collection('projects').orderBy('createdAt', 'asc')
        .onSnapshot(snap => {
            let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            const withOrd = list.filter(p => p.order !== undefined).sort((a,b) => a.order - b.order);
            const noOrd   = list.filter(p => p.order === undefined);
            S.projects = [...withOrd, ...noOrd];
            renderDashboard();
        });
}

async function createProject(name) {
    const minOrd = S.projects.reduce((m, p) => Math.min(m, p.order ?? Infinity), Infinity);
    const newOrd = isFinite(minOrd) ? minOrd - 1 : 0;
    await userRef().collection('projects').add({
        name, status: '대기중', currentUpdateVersion: null,
        order: newOrd,
        createdAt: TS(),
    });
}

async function patchProject(id, data) {
    await userRef().collection('projects').doc(id).update(data);
}

async function removeProject(id) {
    const batch = db.batch();
    for (const sub of ['updates', 'improvements', 'memos']) {
        const snap = await userRef().collection('projects').doc(id).collection(sub).get();
        snap.docs.forEach(d => batch.delete(d.ref));
    }
    batch.delete(userRef().collection('projects').doc(id));
    await batch.commit();
}

async function moveProject(id, dir) {
    if (_orderLock) return;
    const idx = S.projects.findIndex(p => p.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= S.projects.length) return;

    _orderLock = true;
    const a = S.projects[idx];
    const b = S.projects[swapIdx];
    const orderA = a.order ?? idx;
    const orderB = b.order ?? swapIdx;
    const batch = db.batch();
    batch.update(userRef().collection('projects').doc(a.id), { order: orderB });
    batch.update(userRef().collection('projects').doc(b.id), { order: orderA });
    await batch.commit();
    setTimeout(() => { _orderLock = false; }, 400);
}


// ================================================================
//  FIRESTORE — UPDATES (사용자별)
// ================================================================
function listenUpdates(pid) {
    return userRef().collection('projects').doc(pid).collection('updates')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snap => {
            S.updates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (S.currentTab === 'updates')      renderUpdatesTab();
            if (S.currentTab === 'improvements') renderImprovementsTab();
        });
}

async function createUpdate(pid, version) {
    const batch  = db.batch();
    const newRef = userRef().collection('projects').doc(pid).collection('updates').doc();
    S.updates.filter(u => u.isCurrent).forEach(u =>
        batch.update(userRef().collection('projects').doc(pid).collection('updates').doc(u.id), { isCurrent: false })
    );
    S.improvements.filter(i => i.addedToUpdate).forEach(i =>
        batch.update(userRef().collection('projects').doc(pid).collection('improvements').doc(i.id), {
            addedToUpdate: false, addedChangeId: null,
        })
    );
    batch.set(newRef, { version, isCurrent: true, changes: [], createdAt: TS() });
    batch.update(userRef().collection('projects').doc(pid), { currentUpdateVersion: version });
    await batch.commit();
}

async function addChange(pid, updateId, text) {
    const ref    = userRef().collection('projects').doc(pid).collection('updates').doc(updateId);
    const snap   = await ref.get();
    const changes = snap.data()?.changes ?? [];
    const id = uid();
    changes.push({ id, text });
    await ref.update({ changes });
    return id;
}

async function editChange(pid, updateId, changeId, newText) {
    const ref  = userRef().collection('projects').doc(pid).collection('updates').doc(updateId);
    const snap = await ref.get();
    const changes = (snap.data()?.changes ?? []).map(c =>
        c.id === changeId ? { ...c, text: newText } : c
    );
    await ref.update({ changes });
}

async function deleteChange(pid, updateId, changeId) {
    const ref  = userRef().collection('projects').doc(pid).collection('updates').doc(updateId);
    const snap = await ref.get();
    await ref.update({ changes: (snap.data()?.changes ?? []).filter(c => c.id !== changeId) });
    const linked = S.improvements.find(i => i.addedChangeId === changeId);
    if (linked) {
        await userRef().collection('projects').doc(pid).collection('improvements').doc(linked.id)
            .update({ addedToUpdate: false, addedChangeId: null });
    }
}

async function editUpdateVersion(pid, updateId, version) {
    await userRef().collection('projects').doc(pid).collection('updates').doc(updateId).update({ version });
    const u = S.updates.find(u => u.id === updateId);
    if (u?.isCurrent) await patchProject(pid, { currentUpdateVersion: version });
}


// ================================================================
//  FIRESTORE — IMPROVEMENTS (사용자별)
// ================================================================
function listenImprovements(pid) {
    return userRef().collection('projects').doc(pid).collection('improvements')
        .orderBy('createdAt', 'asc')
        .onSnapshot(snap => {
            S.improvements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (S.currentTab === 'improvements') renderImprovementsTab();
            if (S.currentTab === 'updates')      renderUpdatesTab();
        });
}

async function createImprovement(pid, text) {
    await userRef().collection('projects').doc(pid).collection('improvements').add({
        text, completed: false, addedToUpdate: false, addedChangeId: null, createdAt: TS(),
    });
}

async function patchImprovement(pid, id, data) {
    await userRef().collection('projects').doc(pid).collection('improvements').doc(id).update(data);
}

async function removeImprovement(pid, id) {
    const imp = S.improvements.find(i => i.id === id);
    if (imp?.addedToUpdate && imp.addedChangeId) {
        const cur = S.updates.find(u => u.isCurrent);
        if (cur) await deleteChange(pid, cur.id, imp.addedChangeId);
    }
    await userRef().collection('projects').doc(pid).collection('improvements').doc(id).delete();
}


// ================================================================
//  FIRESTORE — MEMOS (사용자별)
// ================================================================
function listenMemos(pid) {
    return userRef().collection('projects').doc(pid).collection('memos')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snap => {
            S.memos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (S.currentTab === 'memos') renderMemosTab();
        });
}

async function createMemo(pid, title, content) {
    await userRef().collection('projects').doc(pid).collection('memos')
        .add({ title, content, createdAt: TS() });
}

async function patchMemo(pid, id, data) {
    await userRef().collection('projects').doc(pid).collection('memos').doc(id).update(data);
}

async function removeMemo(pid, id) {
    await userRef().collection('projects').doc(pid).collection('memos').doc(id).delete();
}


// ================================================================
//  SETUP PROJECT LISTENERS
// ================================================================
async function setupProjectListeners(pid) {
    S.listeners.forEach(u => u());
    S.listeners = [];
    const pSnap = await userRef().collection('projects').doc(pid).get();
    if (!pSnap.exists) { goToDashboard(); return; }
    S.currentProject = { id: pSnap.id, ...pSnap.data() };
    document.getElementById('project-name-title').textContent = S.currentProject.name;
    S.listeners.push(listenUpdates(pid), listenImprovements(pid), listenMemos(pid));
    renderStatusTab();
}


// ================================================================
//  RENDER — DASHBOARD
// ================================================================
function renderDashboard() {
    const grid  = document.getElementById('projects-grid');
    const empty = document.getElementById('empty-state');

    if (S.projects.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = S.projects.map((p, idx) => {
        const opt   = S.statusOptions.find(o => o.label === (p.status || '대기중'));
        const color = opt?.color || '#94a3b8';
        const isFirst = idx === 0;
        const isLast  = idx === S.projects.length - 1;
        return `
        <div class="project-card" data-id="${p.id}">
            <div class="project-card-top">
                <h3 class="project-card-name">${esc(p.name)}</h3>
                <span class="status-badge" style="${badgeStyle(color)}">${esc(p.status || '대기중')}</span>
            </div>
            <div class="project-card-meta">
                <div class="meta-item">
                    <span class="meta-label">업데이트</span>
                    <span class="meta-value">${esc(p.currentUpdateVersion || '없음')}</span>
                </div>
            </div>
            <div class="project-card-footer">
                <span class="card-date">${p.createdAt ? fmtDate(p.createdAt) : ''}</span>
                <div class="card-footer-right">
                    <div class="order-btns">
                        <button class="order-btn" data-id="${p.id}" data-dir="up"
                                title="위로" ${isFirst ? 'disabled' : ''}>▲</button>
                        <button class="order-btn" data-id="${p.id}" data-dir="down"
                                title="아래로" ${isLast ? 'disabled' : ''}>▼</button>
                    </div>
                    <span class="card-arrow">→</span>
                </div>
            </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => goToProject(card.dataset.id));
    });

    grid.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            e.stopPropagation();
            if (btn.disabled) return;
            await moveProject(btn.dataset.id, btn.dataset.dir);
        });
    });
}


// ================================================================
//  RENDER — STATUS TAB
// ================================================================
function renderStatusTab() {
    const container = document.getElementById('status-options-grid');
    const cur       = S.currentProject?.status || '대기중';

    container.innerHTML = S.statusOptions.map(opt => `
        <button class="status-option-btn ${opt.label === cur ? 'active' : ''}"
                data-status="${esc(opt.label)}"
                style="${opt.label === cur
                    ? `border-color:${opt.color};color:${opt.color};background:${opt.color}12`
                    : ''}">
            <span class="status-dot" style="background:${opt.color}"></span>
            ${esc(opt.label)}
        </button>`).join('');

    container.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const s = btn.dataset.status;
            await patchProject(S.currentProjectId, { status: s });
            S.currentProject.status = s;
            renderStatusTab();
            toast(`"${s}"(으)로 변경했습니다.`);
        });
    });
}


// ================================================================
//  RENDER — UPDATES TAB
// ================================================================
function renderUpdatesTab() {
    const cur  = S.updates.find(u => u.isCurrent);
    const prev = S.updates.filter(u => !u.isCurrent);

    const curSection = document.getElementById('current-update-section');
    if (!cur) {
        curSection.innerHTML = `
            <div class="no-update-card">
                <p>진행 중인 업데이트가 없습니다.</p>
                <button class="btn btn-primary btn-sm" id="start-first-update-btn">첫 업데이트 시작</button>
            </div>`;
        document.getElementById('start-first-update-btn')
            ?.addEventListener('click', openNewUpdateModal);
    } else {
        curSection.innerHTML = `
            <div class="update-card current-card">
                <div class="update-card-head">
                    <div class="update-version-wrap">
                        <span class="current-badge">현재</span>
                        <span class="update-version">${esc(cur.version)}</span>
                        <button class="btn-icon-text" id="edit-cur-ver-btn" title="버전 편집">✏</button>
                    </div>
                    <span class="update-date">${cur.createdAt ? fmtDate(cur.createdAt) : ''}</span>
                </div>
                <div class="changes-header">
                    <span class="changes-label">
                        변경사항 <span class="changes-count">${(cur.changes ?? []).length}</span>
                    </span>
                </div>
                <ul class="changes-list">${buildChangeItems(cur.changes ?? [])}</ul>
                <div class="inline-add-row">
                    <input type="text" id="inline-change-input" class="form-input inline-input"
                           placeholder="변경사항 입력 후 Enter..." autocomplete="off">
                    <button class="btn btn-primary btn-sm" id="inline-change-add-btn">추가</button>
                </div>
            </div>`;

        document.getElementById('edit-cur-ver-btn')
            ?.addEventListener('click', () => openEditVersionModal(cur));
        attachChangeItemEvents(curSection, cur.id);
        attachInlineChangeAdd('inline-change-input', 'inline-change-add-btn', cur.id);
    }

    const histDiv = document.getElementById('updates-history');
    if (!histDiv) return;

    if (prev.length === 0) {
        histDiv.innerHTML = '<p class="empty-text">이전 업데이트 기록이 없습니다.</p>';
    } else {
        histDiv.innerHTML = prev.map(u => `
            <div class="prev-update-card" data-uid="${u.id}">
                <div class="update-card-head">
                    <div class="update-version-wrap">
                        <span class="update-version">${esc(u.version)}</span>
                        <button class="btn-icon-text prev-edit-ver-btn" data-uid="${u.id}" title="버전 편집">✏</button>
                    </div>
                    <span class="update-date">${u.createdAt ? fmtDate(u.createdAt) : ''}</span>
                </div>
                <ul class="changes-list">
                    ${buildChangeItems(u.changes ?? [])}
                    ${!(u.changes?.length) ? '<li class="empty-text" style="padding:6px 0">변경사항 없음</li>' : ''}
                </ul>
                <div class="inline-add-row" style="margin-top:10px">
                    <input type="text" class="form-input inline-input prev-inline-inp"
                           data-uid="${u.id}" placeholder="변경사항 추가..." autocomplete="off">
                    <button class="btn btn-outline btn-sm prev-inline-btn" data-uid="${u.id}">추가</button>
                </div>
            </div>`).join('');

        histDiv.querySelectorAll('.prev-edit-ver-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const u = S.updates.find(x => x.id === btn.dataset.uid);
                if (u) openEditVersionModal(u);
            });
        });

        histDiv.querySelectorAll('.prev-update-card').forEach(card => {
            const uid_ = card.dataset.uid;
            attachChangeItemEvents(card, uid_);
            const inp = card.querySelector('.prev-inline-inp');
            const btn = card.querySelector('.prev-inline-btn');
            if (!inp || !btn) return;
            const doAdd = async () => {
                const t = inp.value.trim();
                if (!t) return;
                inp.value = '';
                inp.focus();
                await addChange(S.currentProjectId, uid_, t);
            };
            btn.addEventListener('click', doAdd);
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAdd(); }
            });
        });
    }
}

function attachInlineChangeAdd(inputId, btnId, updateId) {
    const inp = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!inp || !btn) return;
    const doAdd = async () => {
        const t = inp.value.trim();
        if (!t) return;
        inp.value = '';
        inp.focus();
        await addChange(S.currentProjectId, updateId, t);
    };
    btn.addEventListener('click', doAdd);
    inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAdd(); }
    });
}

function buildChangeItems(changes) {
    return changes.map(c => `
        <li class="change-item" data-cid="${c.id}">
            <span class="change-text">${esc(c.text)}</span>
            <div class="change-actions">
                <button class="btn-icon edit-change-btn" data-cid="${c.id}" title="편집">✏</button>
                <button class="btn-icon-danger del-change-btn" data-cid="${c.id}" title="삭제">×</button>
            </div>
        </li>`).join('');
}

function attachChangeItemEvents(container, updateId) {
    container.querySelectorAll('.edit-change-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const u  = S.updates.find(u => u.id === updateId);
            const ch = u?.changes?.find(c => c.id === btn.dataset.cid);
            if (ch) openEditChangeModal(updateId, ch.id, ch.text);
        });
    });
    container.querySelectorAll('.del-change-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('이 변경사항을 삭제하시겠습니까?')) return;
            await deleteChange(S.currentProjectId, updateId, btn.dataset.cid);
            toast('삭제되었습니다.', 'info');
        });
    });
}


// ================================================================
//  RENDER — IMPROVEMENTS TAB
// ================================================================
function renderImprovementsTab() {
    const container = document.getElementById('improvements-list');
    const cur       = S.updates.find(u => u.isCurrent);
    const visible   = S.improvements.filter(i => !i.addedToUpdate);

    let listHTML = '';
    if (S.improvements.length === 0) {
        listHTML = '<p class="empty-text">아래에 입력하여 보완 사항을 추가하세요.</p>';
    } else if (visible.length === 0) {
        listHTML = '<p class="empty-text">모든 보완 사항이 업데이트에 반영되었습니다. ✅</p>';
    } else {
        listHTML = visible.map(imp => `
            <div class="improvement-item ${imp.completed ? 'is-completed' : ''}" data-imp-id="${imp.id}">
                <input type="checkbox" class="improvement-checkbox" ${imp.completed ? 'checked' : ''}
                       data-imp-id="${imp.id}">
                <span class="improvement-text">${esc(imp.text)}</span>
                <div class="improvement-actions">
                    ${imp.completed && cur
                        ? `<button class="btn btn-sm btn-success imp-add-btn" data-imp-id="${imp.id}">업데이트에 추가</button>`
                        : ''}
                    <button class="btn-icon edit-imp-btn"       data-imp-id="${imp.id}" title="편집">✏</button>
                    <button class="btn-icon-danger del-imp-btn" data-imp-id="${imp.id}" title="삭제">×</button>
                </div>
            </div>`).join('');
    }

    container.innerHTML = listHTML + `
        <div class="inline-add-row" style="margin-top:10px">
            <input type="text" id="inline-imp-input" class="form-input inline-input"
                   placeholder="보완 사항 입력 후 Enter..." autocomplete="off">
            <button class="btn btn-primary btn-sm" id="inline-imp-add-btn">추가</button>
        </div>`;

    const impInput  = document.getElementById('inline-imp-input');
    const impAddBtn = document.getElementById('inline-imp-add-btn');

    const doAddImp = async () => {
        if (_impAddLock) return;
        const t = impInput?.value.trim();
        if (!t) return;
        _impAddLock = true;
        impInput.value = '';
        impInput.focus();
        try {
            await createImprovement(S.currentProjectId, t);
        } finally {
            setTimeout(() => { _impAddLock = false; }, 500);
        }
    };

    impAddBtn?.addEventListener('click', doAddImp);
    impInput?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAddImp(); }
    });

    container.querySelectorAll('.improvement-checkbox').forEach(cb => {
        cb.addEventListener('change', async e => {
            await patchImprovement(S.currentProjectId, e.target.dataset.impId,
                { completed: e.target.checked });
        });
    });

    container.querySelectorAll('.imp-add-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const cur = S.updates.find(u => u.isCurrent);
            if (!cur) { toast('현재 진행 중인 업데이트가 없습니다.', 'warning'); return; }
            const imp = S.improvements.find(i => i.id === btn.dataset.impId);
            if (!imp) return;
            const cid = await addChange(S.currentProjectId, cur.id, imp.text);
            await patchImprovement(S.currentProjectId, imp.id,
                { addedToUpdate: true, addedChangeId: cid });
            toast('업데이트 변경사항으로 추가되었습니다. ✅');
        });
    });

    container.querySelectorAll('.edit-imp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const imp = S.improvements.find(i => i.id === btn.dataset.impId);
            if (!imp) return;
            openModal('보완 사항 편집',
                `<div class="form-group">
                    <label>내용</label>
                    <input type="text" id="edit-imp-input" class="form-input"
                           value="${esc(imp.text)}" autocomplete="off">
                </div>`,
                async () => {
                    const t = document.getElementById('edit-imp-input')?.value.trim();
                    if (!t) return;
                    await patchImprovement(S.currentProjectId, imp.id, { text: t });
                    closeModal();
                    toast('수정되었습니다.');
                }, '저장'
            );
        });
    });

    container.querySelectorAll('.del-imp-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('이 보완 사항을 삭제하시겠습니까?')) return;
            await removeImprovement(S.currentProjectId, btn.dataset.impId);
            toast('삭제되었습니다.', 'info');
        });
    });
}


// ================================================================
//  RENDER — MEMOS TAB
// ================================================================
function renderMemosTab() {
    const container = document.getElementById('memos-list');
    if (S.memos.length === 0) {
        container.innerHTML = '<p class="empty-text">메모가 없습니다. + 추가로 메모를 작성하세요.</p>';
        return;
    }
    container.innerHTML = S.memos.map(m => `
        <div class="memo-card" data-memo-id="${m.id}">
            <div class="memo-card-head">
                <h4 class="memo-title">${esc(m.title)}</h4>
                <div class="memo-actions">
                    <button class="btn-icon edit-memo-btn"       data-memo-id="${m.id}" title="편집">✏</button>
                    <button class="btn-icon-danger del-memo-btn" data-memo-id="${m.id}" title="삭제">×</button>
                </div>
            </div>
            <div class="memo-content">${esc(m.content || '').replace(/\n/g,'<br>')}</div>
            <div class="memo-date">${m.createdAt ? fmtDate(m.createdAt) : ''}</div>
        </div>`).join('');

    container.querySelectorAll('.edit-memo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const m = S.memos.find(x => x.id === btn.dataset.memoId);
            if (!m) return;
            openModal('메모 편집',
                `<div class="form-group">
                    <label>제목 (항목)</label>
                    <input type="text" id="edit-memo-title" class="form-input"
                           value="${esc(m.title)}" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>내용</label>
                    <textarea id="edit-memo-content" class="form-textarea" rows="5">${esc(m.content)}</textarea>
                </div>`,
                async () => {
                    const title   = document.getElementById('edit-memo-title')?.value.trim();
                    const content = document.getElementById('edit-memo-content')?.value.trim();
                    if (!title) return;
                    await patchMemo(S.currentProjectId, m.id, { title, content: content || '' });
                    closeModal();
                    toast('메모가 수정되었습니다.');
                }, '저장'
            );
        });
    });

    container.querySelectorAll('.del-memo-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('이 메모를 삭제하시겠습니까?')) return;
            await removeMemo(S.currentProjectId, btn.dataset.memoId);
            toast('삭제되었습니다.', 'info');
        });
    });
}


// ================================================================
//  MODAL OPENERS
// ================================================================
function openNewProjectModal() {
    openModal('새 프로젝트',
        `<div class="form-group">
            <label>프로젝트 이름</label>
            <input type="text" id="new-proj-name" class="form-input"
                   placeholder="이름을 입력하세요" autocomplete="off">
        </div>`,
        async () => {
            const name = document.getElementById('new-proj-name')?.value.trim();
            if (!name) return;
            await createProject(name);
            closeModal();
            toast(`"${name}" 프로젝트가 생성되었습니다.`);
        }, '생성'
    );
}

function openEditProjectNameModal() {
    openModal('프로젝트 이름 편집',
        `<div class="form-group">
            <label>프로젝트 이름</label>
            <input type="text" id="edit-proj-name" class="form-input"
                   value="${esc(S.currentProject?.name || '')}" autocomplete="off">
        </div>`,
        async () => {
            const name = document.getElementById('edit-proj-name')?.value.trim();
            if (!name) return;
            await patchProject(S.currentProjectId, { name });
            S.currentProject.name = name;
            document.getElementById('project-name-title').textContent = name;
            closeModal();
            toast('이름이 변경되었습니다.');
        }, '저장'
    );
}

function openStatusOptionsModal() {
    const renderList = () => {
        const el = document.getElementById('status-opts-list');
        if (!el) return;
        el.innerHTML = S.statusOptions.map((opt, i) => `
            <div class="status-editor-item" data-idx="${i}">
                <input type="color" class="sopt-color-picker" value="${opt.color}"
                       data-idx="${i}" title="색상 변경">
                <input type="text" class="sopt-label-input" value="${esc(opt.label)}"
                       data-idx="${i}" autocomplete="off" placeholder="상태 이름">
                <button class="btn-icon-danger del-sopt-btn" data-idx="${i}" title="삭제">×</button>
            </div>`).join('');

        el.querySelectorAll('.sopt-color-picker').forEach(picker => {
            picker.addEventListener('input', async e => {
                S.statusOptions[parseInt(e.target.dataset.idx)].color = e.target.value;
                await saveStatusOptions();
                renderStatusTab();
                renderDashboard();
            });
        });

        el.querySelectorAll('.sopt-label-input').forEach(inp => {
            const save = async () => {
                const val = inp.value.trim();
                if (!val) return;
                S.statusOptions[parseInt(inp.dataset.idx)].label = val;
                await saveStatusOptions();
                renderStatusTab();
                renderDashboard();
            };
            inp.addEventListener('blur', save);
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
        });

        el.querySelectorAll('.del-sopt-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                S.statusOptions.splice(parseInt(btn.dataset.idx), 1);
                await saveStatusOptions();
                renderList();
                renderStatusTab();
                renderDashboard();
            });
        });
    };

    openModal('진행 상태 편집',
        `<p class="sopt-hint">● 색상 원 클릭 → 색상 변경 &nbsp;|&nbsp; 이름 클릭 → 직접 편집</p>
         <div id="status-opts-list" class="status-options-editor"></div>
         <div class="status-add-row">
            <input type="color" id="new-sopt-color" value="#6360f4" title="색상 선택">
            <input type="text" id="new-sopt-input" class="form-input"
                   placeholder="새 상태 이름" autocomplete="off">
            <button class="btn btn-primary btn-sm" id="add-sopt-btn">추가</button>
         </div>`,
        null
    );

    renderList();

    setTimeout(() => {
        const doAdd = async () => {
            const v = document.getElementById('new-sopt-input')?.value.trim();
            const c = document.getElementById('new-sopt-color')?.value || '#6360f4';
            if (!v) return;
            S.statusOptions.push({ label: v, color: c });
            await saveStatusOptions();
            document.getElementById('new-sopt-input').value = '';
            renderList();
            renderStatusTab();
            renderDashboard();
        };
        document.getElementById('add-sopt-btn')?.addEventListener('click', doAdd);
        document.getElementById('new-sopt-input')?.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAdd(); }
        });
    }, 60);
}

function openNewUpdateModal() {
    openModal('새 업데이트 시작',
        `<div class="form-group">
            <label>업데이트 버전</label>
            <input type="text" id="new-upd-ver" class="form-input"
                   placeholder="예: v1.0, v2.3" autocomplete="off">
        </div>
        <p class="form-note">새 업데이트를 시작하면 현재 업데이트가 이전 기록으로 이동합니다.</p>`,
        async () => {
            const ver = document.getElementById('new-upd-ver')?.value.trim();
            if (!ver) return;
            await createUpdate(S.currentProjectId, ver);
            closeModal();
            toast(`"${ver}" 업데이트가 시작되었습니다.`);
        }, '시작'
    );
}

function openEditVersionModal(upd) {
    openModal('버전 편집',
        `<div class="form-group">
            <label>업데이트 버전</label>
            <input type="text" id="edit-ver-input" class="form-input"
                   value="${esc(upd.version)}" autocomplete="off">
        </div>`,
        async () => {
            const ver = document.getElementById('edit-ver-input')?.value.trim();
            if (!ver) return;
            await editUpdateVersion(S.currentProjectId, upd.id, ver);
            closeModal();
            toast('버전이 수정되었습니다.');
        }, '저장'
    );
}

function openEditChangeModal(updateId, changeId, currentText) {
    openModal('변경사항 편집',
        `<div class="form-group">
            <label>변경 내용</label>
            <input type="text" id="edit-change-input" class="form-input"
                   value="${esc(currentText)}" autocomplete="off">
        </div>`,
        async () => {
            const t = document.getElementById('edit-change-input')?.value.trim();
            if (!t) return;
            await editChange(S.currentProjectId, updateId, changeId, t);
            closeModal();
            toast('수정되었습니다.');
        }, '저장'
    );
}

function openAddMemoModal() {
    openModal('메모 추가',
        `<div class="form-group">
            <label>제목 (항목)</label>
            <input type="text" id="new-memo-title" class="form-input"
                   placeholder="메모 제목" autocomplete="off">
        </div>
        <div class="form-group">
            <label>내용</label>
            <textarea id="new-memo-content" class="form-textarea" rows="5"
                      placeholder="내용을 입력하세요"></textarea>
        </div>`,
        async () => {
            const title   = document.getElementById('new-memo-title')?.value.trim();
            const content = document.getElementById('new-memo-content')?.value.trim();
            if (!title) return;
            await createMemo(S.currentProjectId, title, content || '');
            closeModal();
            toast('메모가 추가되었습니다.');
        }, '추가'
    );
}

// ================================================================
//  EVENT BINDINGS
// ================================================================
function bindDashboard() {
    document.getElementById('add-project-btn').addEventListener('click', openNewProjectModal);
    // auth-action-btn 의 onclick 은 updateAuthUI() 에서 동적으로 설정
}

function bindProjectPage() {
    document.getElementById('back-btn').addEventListener('click', goToDashboard);
    document.getElementById('edit-name-btn').addEventListener('click', openEditProjectNameModal);

    document.getElementById('delete-project-btn').addEventListener('click', async () => {
        const name = S.currentProject?.name ?? '';
        if (!confirm(`"${name}" 프로젝트를 삭제하시겠습니까?\n모든 데이터가 영구 삭제됩니다.`)) return;
        const pid = S.currentProjectId;
        goToDashboard();
        await removeProject(pid);
        toast(`"${name}" 프로젝트가 삭제되었습니다.`, 'warning');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            S.currentTab = tab;
            document.querySelectorAll('.tab-btn').forEach(b =>
                b.classList.toggle('active', b.dataset.tab === tab)
            );
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            document.getElementById(`tab-${tab}`).classList.remove('hidden');
            if (tab === 'status')       renderStatusTab();
            if (tab === 'updates')      renderUpdatesTab();
            if (tab === 'improvements') renderImprovementsTab();
            if (tab === 'memos')        renderMemosTab();
        });
    });

    document.getElementById('edit-status-options-btn').addEventListener('click', openStatusOptionsModal);
    document.getElementById('new-update-btn').addEventListener('click', openNewUpdateModal);

    document.getElementById('toggle-history-btn').addEventListener('click', function () {
        const body = document.getElementById('updates-history');
        const open = body.classList.toggle('hidden');
        this.classList.toggle('open', !open);
    });

    document.getElementById('add-memo-btn').addEventListener('click', openAddMemoModal);
}

function bindModal() {
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-backdrop')) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !document.getElementById('modal-backdrop').classList.contains('hidden'))
            closeModal();
    });
}


// ================================================================
//  INIT
// ================================================================
async function startUserSession(user) {
    S.user = user;
    // 상태 옵션 기본값 리셋 후 Firestore에서 로드
    S.statusOptions = [
        { label: '대기중', color: '#94a3b8' },
        { label: '제작중', color: '#6360f4' },
        { label: '완료',   color: '#059669' },
    ];
    await loadStatusOptions();

    // 이전 대시보드 리스너 정리 후 재시작
    if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
    S.dashUnsub = listenProjects();

    updateAuthUI();
    hideLoading();
}

async function init() {
    showLoading();
    bindModal();
    bindDashboard();
    bindProjectPage();

    auth.onAuthStateChanged(async user => {
        if (user) {
            // 로그인 상태 (익명 or 이메일)
            try {
                await startUserSession(user);
            } catch (err) {
                console.error(err);
                document.getElementById('loading').innerHTML = `
                    <div style="text-align:center;padding:40px;color:#e53e3e">
                        <h2 style="margin-bottom:12px">연결 오류</h2>
                        <p style="color:#5c6899;margin-bottom:8px">Firebase 설정을 확인해주세요.</p>
                        <code style="font-size:0.8rem;color:#9aa3c8">${err.message}</code>
                    </div>`;
            }
        } else {
            // 로그아웃 상태 → 자동으로 익명 로그인
            try {
                await auth.signInAnonymously();
                // onAuthStateChanged 가 다시 호출되어 위의 user 분기로 진입
            } catch (err) {
                console.error('익명 로그인 실패:', err);
                hideLoading();
            }
        }
    });
}

init();

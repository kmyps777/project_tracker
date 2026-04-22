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
//  I18N
// ================================================================
const LANG = navigator.language?.startsWith('ko') ? 'ko' : 'en';

const T = {
    ko: {
        // Status defaults
        status_waiting:     '대기중',
        status_in_progress: '제작중',
        status_done:        '완료',

        // Loading / static UI
        loading:     '로딩 중...',
        add_project: '+ 새 프로젝트',
        back:        '← 목록',
        delete:      '삭제',

        // Tabs
        tab_improvements: '보완 사항',
        tab_updates:      '업데이트 로그',
        tab_status:       '진행 상태',
        tab_memos:        '메모',

        // Panel labels
        panel_status:       '진행 상태',
        edit_status:        '상태 편집',
        panel_updates:      '업데이트 로그',
        new_update:         '+ 새 업데이트',
        prev_updates:       '이전 업데이트 기록',
        panel_improvements: '보완 사항',
        panel_memos:        '메모',
        add_memo:           '+ 추가',

        // Dashboard
        link_email_btn:      '📧 이메일 연동',
        link_email_title:    '이메일 연동 시 다른 기기에서도 데이터를 사용할 수 있습니다',
        guest_mode:          '👤 게스트 모드',
        guest_hint:          '· 이메일 연동 시 다기기 동기화 가능',
        signin_existing:     '이미 계정이 있으신가요? 로그인',
        logout:              '로그아웃',
        email_logged_in:     '· 이메일 계정으로 로그인됨',
        update_label:        '업데이트',
        no_version:          '없음',
        empty_title:         '프로젝트가 없습니다',
        empty_sub:           '위의 버튼으로 첫 프로젝트를 추가해보세요',
        move_up:             '위로',
        move_down:           '아래로',

        // Updates tab
        current_badge:           '현재',
        changes_label:           '변경사항',
        change_input_ph:         '변경사항 입력 후 Enter...',
        add:                     '추가',
        no_current_update:       '진행 중인 업데이트가 없습니다.',
        start_first_update:      '첫 업데이트 시작',
        no_prev_updates:         '이전 업데이트 기록이 없습니다.',
        no_changes:              '변경사항 없음',
        prev_change_input_ph:    '변경사항 추가...',

        // Improvements tab
        imp_empty_add:   '아래에 입력하여 보완 사항을 추가하세요.',
        imp_all_added:   '모든 보완 사항이 업데이트에 반영되었습니다. ✅',
        add_to_update:   '업데이트에 추가',
        imp_input_ph:    '보완 사항 입력 후 Enter...',

        // Memos tab
        memo_empty: '메모가 없습니다. + 추가로 메모를 작성하세요.',

        // Modal buttons
        confirm: '확인',
        cancel:  '취소',
        close:   '닫기',
        save:    '저장',

        // Link email modal
        modal_link_email:  '이메일 연동',
        link_email_desc:   '이메일과 비밀번호를 등록하면 다른 기기에서도<br>같은 계정으로 로그인하여 데이터를 사용할 수 있습니다.',
        email_label:       '이메일',
        pw_label:          '비밀번호 (6자 이상)',
        pw_confirm_label:  '비밀번호 확인',
        pw_ph:             '비밀번호 입력',
        pw_confirm_ph:     '비밀번호 재입력',
        link_btn:          '연동하기',

        // Sign-in modal
        modal_signin:   '이메일로 로그인',
        signin_desc:    '다른 기기에서 연동한 계정으로 로그인하면<br>기존 데이터를 이어서 사용할 수 있습니다.',
        signin_note:    '※ 로그인 후 현재 게스트 데이터는 사라지고 계정 데이터를 불러옵니다.',
        signin_btn:     '로그인',
        pw_signin_label:'비밀번호',

        // New project modal
        modal_new_project:    '새 프로젝트',
        project_name_label:   '프로젝트 이름',
        project_name_ph:      '이름을 입력하세요',
        create_btn:           '생성',

        // Edit project name
        modal_edit_proj_name: '프로젝트 이름 편집',

        // Status options modal
        modal_edit_status:  '진행 상태 편집',
        sopt_hint:          '● 색상 원 클릭 → 색상 변경 &nbsp;|&nbsp; 이름 클릭 → 직접 편집',
        sopt_label_ph:      '상태 이름',
        new_status_ph:      '새 상태 이름',

        // New update modal
        modal_new_update:   '새 업데이트 시작',
        update_ver_label:   '업데이트 버전',
        update_ver_ph:      '예: v1.0, v2.3',
        new_update_note:    '새 업데이트를 시작하면 현재 업데이트가 이전 기록으로 이동합니다.',
        start_btn:          '시작',

        // Edit version modal
        modal_edit_ver: '버전 편집',

        // Edit change modal
        modal_edit_change:    '변경사항 편집',
        change_content_label: '변경 내용',

        // Add memo modal
        modal_add_memo:      '메모 추가',
        memo_title_label:    '제목 (항목)',
        memo_title_ph:       '메모 제목',
        memo_content_label:  '내용',
        memo_content_ph:     '내용을 입력하세요',
        add_btn:             '추가',

        // Edit memo / improvement modals
        modal_edit_memo: '메모 편집',
        modal_edit_imp:  '보완 사항 편집',
        imp_content_label: '내용',

        // Toasts
        toast_linked:             (e)    => `"${e}"로 연동되었습니다! 🎉`,
        toast_status_changed:     (s)    => `"${s}"(으)로 변경했습니다.`,
        toast_proj_created:       (n)    => `"${n}" 프로젝트가 생성되었습니다.`,
        toast_name_changed:       '이름이 변경되었습니다.',
        toast_update_started:     (v)    => `"${v}" 업데이트가 시작되었습니다.`,
        toast_ver_edited:         '버전이 수정되었습니다.',
        toast_edited:             '수정되었습니다.',
        toast_imp_added_update:   '업데이트 변경사항으로 추가되었습니다. ✅',
        toast_deleted:            '삭제되었습니다.',
        toast_memo_edited:        '메모가 수정되었습니다.',
        toast_memo_added:         '메모가 추가되었습니다.',
        toast_proj_deleted:       (n)    => `"${n}" 프로젝트가 삭제되었습니다.`,
        toast_no_current_update:  '현재 진행 중인 업데이트가 없습니다.',

        // Confirms
        confirm_delete_change: '이 변경사항을 삭제하시겠습니까?',
        confirm_delete_imp:    '이 보완 사항을 삭제하시겠습니까?',
        confirm_delete_memo:   '이 메모를 삭제하시겠습니까?',
        confirm_delete_proj:   (n) => `"${n}" 프로젝트를 삭제하시겠습니까?\n모든 데이터가 영구 삭제됩니다.`,
        confirm_logout:        '로그아웃 하시겠습니까?\n로그아웃 후 게스트 모드로 전환됩니다.',

        // Validation
        val_email_pw_required: '이메일과 비밀번호를 입력해주세요.',
        val_pw_mismatch:       '비밀번호가 일치하지 않습니다.',

        // Errors
        err_title:   '연결 오류',
        err_firebase:'Firebase 설정을 확인해주세요.',

        // Auth errors
        auth_wrong_credential: '이메일 또는 비밀번호가 잘못되었습니다.',
        auth_email_in_use:     '이미 사용 중인 이메일입니다.',
        auth_weak_pw:          '비밀번호는 6자 이상이어야 합니다.',
        auth_invalid_email:    '올바른 이메일 형식이 아닙니다.',
        auth_too_many:         '잠시 후 다시 시도해주세요.',
        auth_network:          '네트워크 오류가 발생했습니다.',
        auth_credential_in_use:'이 이메일은 다른 계정에서 이미 사용 중입니다.',
        auth_generic:          '오류가 발생했습니다. 다시 시도해주세요.',

        // Logout modal
        logout_title:       '로그아웃',
        logout_body:        '로그아웃 후 게스트 모드로 전환됩니다.',
        logout_confirm_btn: '로그아웃',

        // Account deletion
        delete_account_btn:     '계정 삭제',
        modal_delete_account:   '계정 삭제',
        delete_account_desc:    '계정을 삭제하면 모든 프로젝트 데이터가 영구적으로 삭제되며 복구할 수 없습니다.',
        delete_account_warn:    '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
        delete_account_btn_ok:  '계정 삭제',
        toast_account_deleted:  '계정이 삭제되었습니다.',

        // Tooltips
        tip_tap_to_edit: '탭하여 편집',
        tip_delete:      '삭제',
        tip_edit_ver:    '버전 편집',
        tip_edit_name:   '이름 편집',
        modal_close:     '닫기',
    },
    en: {
        // Status defaults
        status_waiting:     'Waiting',
        status_in_progress: 'In Progress',
        status_done:        'Done',

        // Loading / static UI
        loading:     'Loading...',
        add_project: '+ New Project',
        back:        '← List',
        delete:      'Delete',

        // Tabs
        tab_improvements: 'Improvements',
        tab_updates:      'Update Log',
        tab_status:       'Status',
        tab_memos:        'Memos',

        // Panel labels
        panel_status:       'Status',
        edit_status:        'Edit Status',
        panel_updates:      'Update Log',
        new_update:         '+ New Update',
        prev_updates:       'Previous Updates',
        panel_improvements: 'Improvements',
        panel_memos:        'Memos',
        add_memo:           '+ Add',

        // Dashboard
        link_email_btn:      '📧 Link Email',
        link_email_title:    'Link your email to sync data across devices',
        guest_mode:          '👤 Guest Mode',
        guest_hint:          '· Link email to sync across devices',
        signin_existing:     'Already have an account? Sign in',
        logout:              'Log out',
        email_logged_in:     '· Signed in with email',
        update_label:        'Update',
        no_version:          'None',
        empty_title:         'No projects yet',
        empty_sub:           'Tap the button above to add your first project',
        move_up:             'Move up',
        move_down:           'Move down',

        // Updates tab
        current_badge:        'Current',
        changes_label:        'Changes',
        change_input_ph:      'Enter a change and press Enter...',
        add:                  'Add',
        no_current_update:    'No update in progress.',
        start_first_update:   'Start First Update',
        no_prev_updates:      'No previous update history.',
        no_changes:           'No changes',
        prev_change_input_ph: 'Add a change...',

        // Improvements tab
        imp_empty_add: 'Type below to add an improvement.',
        imp_all_added: 'All improvements have been added to the update. ✅',
        add_to_update: 'Add to Update',
        imp_input_ph:  'Enter improvement and press Enter...',

        // Memos tab
        memo_empty: 'No memos yet. Tap + Add to write one.',

        // Modal buttons
        confirm: 'Confirm',
        cancel:  'Cancel',
        close:   'Close',
        save:    'Save',

        // Link email modal
        modal_link_email:  'Link Email',
        link_email_desc:   'Register an email and password to access<br>your data from any device.',
        email_label:       'Email',
        pw_label:          'Password (6+ characters)',
        pw_confirm_label:  'Confirm Password',
        pw_ph:             'Enter password',
        pw_confirm_ph:     'Re-enter password',
        link_btn:          'Link Account',

        // Sign-in modal
        modal_signin:    'Sign In with Email',
        signin_desc:     'Sign in with your linked account to<br>continue using your existing data.',
        signin_note:     '※ Signing in will replace current guest data with your account data.',
        signin_btn:      'Sign In',
        pw_signin_label: 'Password',

        // New project modal
        modal_new_project:  'New Project',
        project_name_label: 'Project Name',
        project_name_ph:    'Enter a name',
        create_btn:         'Create',

        // Edit project name
        modal_edit_proj_name: 'Edit Project Name',

        // Status options modal
        modal_edit_status: 'Edit Status Options',
        sopt_hint:         '● Click color circle → change color &nbsp;|&nbsp; Click name → edit directly',
        sopt_label_ph:     'Status name',
        new_status_ph:     'New status name',

        // New update modal
        modal_new_update: 'Start New Update',
        update_ver_label: 'Update Version',
        update_ver_ph:    'e.g. v1.0, v2.3',
        new_update_note:  'Starting a new update will move the current update to history.',
        start_btn:        'Start',

        // Edit version modal
        modal_edit_ver: 'Edit Version',

        // Edit change modal
        modal_edit_change:    'Edit Change',
        change_content_label: 'Content',

        // Add memo modal
        modal_add_memo:     'Add Memo',
        memo_title_label:   'Title',
        memo_title_ph:      'Memo title',
        memo_content_label: 'Content',
        memo_content_ph:    'Enter content',
        add_btn:            'Add',

        // Edit memo / improvement modals
        modal_edit_memo:   'Edit Memo',
        modal_edit_imp:    'Edit Improvement',
        imp_content_label: 'Content',

        // Toasts
        toast_linked:             (e) => `Linked to "${e}"! 🎉`,
        toast_status_changed:     (s) => `Status changed to "${s}".`,
        toast_proj_created:       (n) => `Project "${n}" created.`,
        toast_name_changed:       'Name updated.',
        toast_update_started:     (v) => `Update "${v}" started.`,
        toast_ver_edited:         'Version updated.',
        toast_edited:             'Updated.',
        toast_imp_added_update:   'Added to update changes. ✅',
        toast_deleted:            'Deleted.',
        toast_memo_edited:        'Memo updated.',
        toast_memo_added:         'Memo added.',
        toast_proj_deleted:       (n) => `Project "${n}" deleted.`,
        toast_no_current_update:  'No update currently in progress.',

        // Confirms
        confirm_delete_change: 'Delete this change?',
        confirm_delete_imp:    'Delete this improvement?',
        confirm_delete_memo:   'Delete this memo?',
        confirm_delete_proj:   (n) => `Delete project "${n}"?\nAll data will be permanently removed.`,
        confirm_logout:        'Log out?\nYou will be switched to guest mode.',

        // Validation
        val_email_pw_required: 'Please enter your email and password.',
        val_pw_mismatch:       'Passwords do not match.',

        // Errors
        err_title:    'Connection Error',
        err_firebase: 'Please check your Firebase configuration.',

        // Auth errors
        auth_wrong_credential:  'Incorrect email or password.',
        auth_email_in_use:      'This email is already in use.',
        auth_weak_pw:           'Password must be at least 6 characters.',
        auth_invalid_email:     'Invalid email address.',
        auth_too_many:          'Too many attempts. Please try again later.',
        auth_network:           'A network error occurred.',
        auth_credential_in_use: 'This email is already used by another account.',
        auth_generic:           'An error occurred. Please try again.',

        // Logout modal
        logout_title:       'Log Out',
        logout_body:        'You will be switched to guest mode after logging out.',
        logout_confirm_btn: 'Log Out',

        // Account deletion
        delete_account_btn:    'Delete Account',
        modal_delete_account:  'Delete Account',
        delete_account_desc:   'Deleting your account will permanently remove all your project data. This cannot be undone.',
        delete_account_warn:   'Are you sure? This action cannot be reversed.',
        delete_account_btn_ok: 'Delete Account',
        toast_account_deleted: 'Account deleted.',

        // Tooltips
        tip_tap_to_edit: 'Tap to edit',
        tip_delete:      'Delete',
        tip_edit_ver:    'Edit version',
        tip_edit_name:   'Edit name',
        modal_close:     'Close',
    }
};

function t(key, ...args) {
    const val = T[LANG]?.[key] ?? T['ko'][key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
}

function applyStaticI18n() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
}


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
        { label: t('status_waiting'),     color: '#94a3b8' },
        { label: t('status_in_progress'), color: '#6360f4' },
        { label: t('status_done'),        color: '#059669' },
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
    const locale = LANG === 'ko' ? 'ko-KR' : 'en-US';
    return d.toLocaleDateString(locale, { year:'numeric', month:'2-digit', day:'2-digit' });
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function normalizeOpt(opt) {
    if (typeof opt === 'string') {
        const defaults = {
            '대기중': '#94a3b8', 'Waiting':     '#94a3b8',
            '제작중': '#6360f4', 'In Progress': '#6360f4',
            '완료':   '#059669', 'Done':        '#059669',
        };
        return { label: opt, color: defaults[opt] || '#7c3aed' };
    }
    return opt;
}

function badgeStyle(color) {
    return `color:${color};background:${color}18;border:1.5px solid ${color}44`;
}

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

function openModal(title, bodyHTML, onConfirm = null, confirmLabel = t('confirm')) {
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
    cancel.textContent = onConfirm ? t('cancel') : t('close');
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
//  AUTH
// ================================================================
function updateAuthUI() {
    const btn = document.getElementById('auth-action-btn');
    const bar = document.getElementById('user-info-bar');
    if (!btn || !bar) return;

    if (!S.user || S.user.isAnonymous) {
        btn.textContent = t('link_email_btn');
        btn.title       = t('link_email_title');
        btn.onclick     = openLinkEmailModal;
        bar.innerHTML   = `
            <span>${t('guest_mode')}</span>
            <span class="user-bar-hint">${t('guest_hint')}</span>
            <button class="user-bar-signin-btn" id="signin-existing-btn">${t('signin_existing')}</button>
        `;
        document.getElementById('signin-existing-btn')?.addEventListener('click', openSignInModal);
    } else {
        btn.textContent = t('logout');
        btn.title       = t('logout');
        btn.onclick     = doSignOut;
        bar.innerHTML   = `
            <span>✉️ ${esc(S.user.email)}</span>
            <span class="user-bar-hint">${t('email_logged_in')}</span>
            <button class="user-bar-delete-btn" id="delete-account-btn">${t('delete_account_btn')}</button>
        `;
        document.getElementById('delete-account-btn')?.addEventListener('click', openDeleteAccountModal);
    }
}

function getAuthErrorMsg(code) {
    const map = {
        'auth/user-not-found':            t('auth_wrong_credential'),
        'auth/wrong-password':            t('auth_wrong_credential'),
        'auth/invalid-credential':        t('auth_wrong_credential'),
        'auth/email-already-in-use':      t('auth_email_in_use'),
        'auth/weak-password':             t('auth_weak_pw'),
        'auth/invalid-email':             t('auth_invalid_email'),
        'auth/too-many-requests':         t('auth_too_many'),
        'auth/network-request-failed':    t('auth_network'),
        'auth/credential-already-in-use': t('auth_credential_in_use'),
    };
    return map[code] || t('auth_generic');
}

function openLinkEmailModal() {
    openModal(t('modal_link_email'),
        `<p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;line-height:1.7">
            ${t('link_email_desc')}
         </p>
         <div class="form-group">
             <label>${t('email_label')}</label>
             <input type="email" id="link-email" class="form-input"
                    placeholder="example@email.com" autocomplete="email">
         </div>
         <div class="form-group">
             <label>${t('pw_label')}</label>
             <input type="password" id="link-pw" class="form-input"
                    placeholder="${t('pw_ph')}" autocomplete="new-password">
         </div>
         <div class="form-group">
             <label>${t('pw_confirm_label')}</label>
             <input type="password" id="link-pw2" class="form-input"
                    placeholder="${t('pw_confirm_ph')}" autocomplete="new-password">
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

            if (!email || !pw) { showErr(t('val_email_pw_required')); return; }
            if (pw !== pw2)    { showErr(t('val_pw_mismatch')); return; }

            try {
                const credential = firebase.auth.EmailAuthProvider.credential(email, pw);
                await auth.currentUser.linkWithCredential(credential);
                closeModal();
                updateAuthUI();
                toast(t('toast_linked', email));
            } catch (err) {
                showErr(getAuthErrorMsg(err.code));
            }
        }, t('link_btn')
    );
}

function openSignInModal() {
    openModal(t('modal_signin'),
        `<p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:16px;line-height:1.7">
            ${t('signin_desc')}
         </p>
         <div class="form-group">
             <label>${t('email_label')}</label>
             <input type="email" id="signin-email" class="form-input"
                    placeholder="example@email.com" autocomplete="email">
         </div>
         <div class="form-group">
             <label>${t('pw_signin_label')}</label>
             <input type="password" id="signin-pw" class="form-input"
                    placeholder="${t('pw_ph')}" autocomplete="current-password">
         </div>
         <div id="signin-error" class="link-error hidden"></div>
         <p style="font-size:0.78rem;color:var(--text-dim);margin-top:10px">
             ${t('signin_note')}
         </p>`,
        async () => {
            const email = document.getElementById('signin-email')?.value.trim();
            const pw    = document.getElementById('signin-pw')?.value;
            const errEl = document.getElementById('signin-error');

            const showErr = (msg) => {
                if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
            };

            if (!email || !pw) { showErr(t('val_email_pw_required')); return; }

            try {
                S.listeners.forEach(u => u()); S.listeners = [];
                if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
                await auth.signInWithEmailAndPassword(email, pw);
                closeModal();
            } catch (err) {
                showErr(getAuthErrorMsg(err.code));
            }
        }, t('signin_btn')
    );
}

function doSignOut() {
    openModal(
        t('logout_title'),
        `<p style="font-size:0.9rem;color:var(--text-muted);line-height:1.7">${t('logout_body')}</p>`,
        async () => {
            closeModal();
            S.listeners.forEach(u => u()); S.listeners = [];
            if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
            S.projects = []; S.updates = []; S.improvements = []; S.memos = [];
            S.currentProjectId = null; S.currentProject = null;
            goToDashboard();
            await auth.signOut();
        },
        t('logout_confirm_btn')
    );
}

async function deleteAllUserData(uid) {
    const userDocRef  = db.collection('users').doc(uid);
    const projectsSnap = await userDocRef.collection('projects').get();
    for (const projDoc of projectsSnap.docs) {
        for (const sub of ['updates', 'improvements', 'memos']) {
            const subSnap = await projDoc.ref.collection(sub).get();
            const batch   = db.batch();
            subSnap.docs.forEach(d => batch.delete(d.ref));
            if (subSnap.docs.length) await batch.commit();
        }
        await projDoc.ref.delete();
    }
    const configSnap = await userDocRef.collection('config').get();
    const cfgBatch   = db.batch();
    configSnap.docs.forEach(d => cfgBatch.delete(d.ref));
    if (configSnap.docs.length) await cfgBatch.commit();
}

function openDeleteAccountModal() {
    openModal(
        t('modal_delete_account'),
        `<p style="font-size:0.9rem;color:var(--text-muted);line-height:1.7;margin-bottom:14px">
            ${t('delete_account_desc')}
         </p>
         <p style="font-size:0.88rem;color:#ef4444;font-weight:600;line-height:1.6">
            ${t('delete_account_warn')}
         </p>`,
        async () => {
            try {
                const uid  = S.user.uid;
                const user = auth.currentUser;
                closeModal();
                S.listeners.forEach(u => u()); S.listeners = [];
                if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
                goToDashboard();
                await deleteAllUserData(uid);
                await user.delete();
                toast(t('toast_account_deleted'), 'info');
            } catch (err) {
                console.error('Account deletion failed:', err);
                // 재인증이 필요한 경우 (requires-recent-login)
                if (err.code === 'auth/requires-recent-login') {
                    openSignInModal();
                } else {
                    toast(t('auth_generic'), 'error');
                }
            }
        },
        t('delete_account_btn_ok')
    );
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
//  FIRESTORE — CONFIG
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
//  FIRESTORE — PROJECTS
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
        name, status: t('status_waiting'), currentUpdateVersion: null,
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
//  FIRESTORE — UPDATES
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
//  FIRESTORE — IMPROVEMENTS
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
//  FIRESTORE — MEMOS
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
        const defaultStatus = t('status_waiting');
        const opt   = S.statusOptions.find(o => o.label === (p.status || defaultStatus));
        const color = opt?.color || '#94a3b8';
        const isFirst = idx === 0;
        const isLast  = idx === S.projects.length - 1;
        return `
        <div class="project-card" data-id="${p.id}">
            <div class="project-card-top">
                <h3 class="project-card-name">${esc(p.name)}</h3>
                <span class="status-badge" style="${badgeStyle(color)}">${esc(p.status || defaultStatus)}</span>
            </div>
            <div class="project-card-meta">
                <div class="meta-item">
                    <span class="meta-label">${t('update_label')}</span>
                    <span class="meta-value">${esc(p.currentUpdateVersion || t('no_version'))}</span>
                </div>
            </div>
            <div class="project-card-footer">
                <span class="card-date">${p.createdAt ? fmtDate(p.createdAt) : ''}</span>
                <div class="card-footer-right">
                    <div class="order-btns">
                        <button class="order-btn" data-id="${p.id}" data-dir="up"
                                title="${t('move_up')}" ${isFirst ? 'disabled' : ''}>▲</button>
                        <button class="order-btn" data-id="${p.id}" data-dir="down"
                                title="${t('move_down')}" ${isLast ? 'disabled' : ''}>▼</button>
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
    const cur       = S.currentProject?.status || t('status_waiting');

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
            toast(t('toast_status_changed', s));
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
                <p>${t('no_current_update')}</p>
                <button class="btn btn-primary btn-sm" id="start-first-update-btn">${t('start_first_update')}</button>
            </div>`;
        document.getElementById('start-first-update-btn')
            ?.addEventListener('click', openNewUpdateModal);
    } else {
        curSection.innerHTML = `
            <div class="update-card current-card">
                <div class="update-card-head">
                    <div class="update-version-wrap">
                        <span class="current-badge">${t('current_badge')}</span>
                        <span class="update-version">${esc(cur.version)}</span>
                        <button class="btn-icon-text" id="edit-cur-ver-btn" title="${t('tip_edit_ver')}">✏</button>
                    </div>
                    <span class="update-date">${cur.createdAt ? fmtDate(cur.createdAt) : ''}</span>
                </div>
                <div class="changes-header">
                    <span class="changes-label">
                        ${t('changes_label')} <span class="changes-count">${(cur.changes ?? []).length}</span>
                    </span>
                </div>
                <ul class="changes-list">${buildChangeItems(cur.changes ?? [])}</ul>
                <div class="inline-add-row">
                    <input type="text" id="inline-change-input" class="form-input inline-input"
                           placeholder="${t('change_input_ph')}" autocomplete="off">
                    <button class="btn btn-primary btn-sm" id="inline-change-add-btn">${t('add')}</button>
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
        histDiv.innerHTML = `<p class="empty-text">${t('no_prev_updates')}</p>`;
    } else {
        histDiv.innerHTML = prev.map(u => `
            <div class="prev-update-card" data-uid="${u.id}">
                <div class="update-card-head">
                    <div class="update-version-wrap">
                        <span class="update-version">${esc(u.version)}</span>
                        <button class="btn-icon-text prev-edit-ver-btn" data-uid="${u.id}" title="${t('tip_edit_ver')}">✏</button>
                    </div>
                    <span class="update-date">${u.createdAt ? fmtDate(u.createdAt) : ''}</span>
                </div>
                <ul class="changes-list">
                    ${buildChangeItems(u.changes ?? [])}
                    ${!(u.changes?.length) ? `<li class="empty-text" style="padding:6px 0">${t('no_changes')}</li>` : ''}
                </ul>
                <div class="inline-add-row" style="margin-top:10px">
                    <input type="text" class="form-input inline-input prev-inline-inp"
                           data-uid="${u.id}" placeholder="${t('prev_change_input_ph')}" autocomplete="off">
                    <button class="btn btn-outline btn-sm prev-inline-btn" data-uid="${u.id}">${t('add')}</button>
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
                const txt = inp.value.trim();
                if (!txt) return;
                inp.value = '';
                inp.focus();
                await addChange(S.currentProjectId, uid_, txt);
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
        const txt = inp.value.trim();
        if (!txt) return;
        inp.value = '';
        inp.focus();
        await addChange(S.currentProjectId, updateId, txt);
    };
    btn.addEventListener('click', doAdd);
    inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAdd(); }
    });
}

function buildChangeItems(changes) {
    return changes.map(c => `
        <li class="change-item" data-cid="${c.id}">
            <span class="change-text change-text-editable" data-cid="${c.id}" title="${t('tip_tap_to_edit')}">${esc(c.text)}</span>
            <div class="change-actions">
                <button class="btn-icon-danger del-change-btn" data-cid="${c.id}" title="${t('tip_delete')}">×</button>
            </div>
        </li>`).join('');
}

function attachChangeItemEvents(container, updateId) {
    container.querySelectorAll('.change-text-editable').forEach(span => {
        span.addEventListener('click', () => {
            const u  = S.updates.find(u => u.id === updateId);
            const ch = u?.changes?.find(c => c.id === span.dataset.cid);
            if (ch) openEditChangeModal(updateId, ch.id, ch.text);
        });
    });
    container.querySelectorAll('.del-change-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(t('confirm_delete_change'))) return;
            await deleteChange(S.currentProjectId, updateId, btn.dataset.cid);
            toast(t('toast_deleted'), 'info');
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
        listHTML = `<p class="empty-text">${t('imp_empty_add')}</p>`;
    } else if (visible.length === 0) {
        listHTML = `<p class="empty-text">${t('imp_all_added')}</p>`;
    } else {
        listHTML = visible.map(imp => `
            <div class="improvement-item ${imp.completed ? 'is-completed' : ''}" data-imp-id="${imp.id}">
                <input type="checkbox" class="improvement-checkbox" ${imp.completed ? 'checked' : ''}
                       data-imp-id="${imp.id}">
                <span class="improvement-text improvement-text-editable" data-imp-id="${imp.id}" title="${t('tip_tap_to_edit')}">${esc(imp.text)}</span>
                <div class="improvement-actions">
                    ${imp.completed && cur
                        ? `<button class="btn btn-sm btn-success imp-add-btn" data-imp-id="${imp.id}">${t('add_to_update')}</button>`
                        : ''}
                    <button class="btn-icon-danger del-imp-btn" data-imp-id="${imp.id}" title="${t('tip_delete')}">×</button>
                </div>
            </div>`).join('');
    }

    container.innerHTML = listHTML + `
        <div class="inline-add-row" style="margin-top:10px">
            <input type="text" id="inline-imp-input" class="form-input inline-input"
                   placeholder="${t('imp_input_ph')}" autocomplete="off">
            <button class="btn btn-primary btn-sm" id="inline-imp-add-btn">${t('add')}</button>
        </div>`;

    const impInput  = document.getElementById('inline-imp-input');
    const impAddBtn = document.getElementById('inline-imp-add-btn');

    const doAddImp = async () => {
        if (_impAddLock) return;
        const txt = impInput?.value.trim();
        if (!txt) return;
        _impAddLock = true;
        impInput.value = '';
        impInput.focus();
        try {
            await createImprovement(S.currentProjectId, txt);
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
            if (!cur) { toast(t('toast_no_current_update'), 'warning'); return; }
            const imp = S.improvements.find(i => i.id === btn.dataset.impId);
            if (!imp) return;
            const cid = await addChange(S.currentProjectId, cur.id, imp.text);
            await patchImprovement(S.currentProjectId, imp.id,
                { addedToUpdate: true, addedChangeId: cid });
            toast(t('toast_imp_added_update'));
        });
    });

    container.querySelectorAll('.improvement-text-editable').forEach(span => {
        span.addEventListener('click', () => {
            const imp = S.improvements.find(i => i.id === span.dataset.impId);
            if (!imp) return;
            openModal(t('modal_edit_imp'),
                `<div class="form-group">
                    <label>${t('imp_content_label')}</label>
                    <input type="text" id="edit-imp-input" class="form-input"
                           value="${esc(imp.text)}" autocomplete="off">
                </div>`,
                async () => {
                    const txt = document.getElementById('edit-imp-input')?.value.trim();
                    if (!txt) return;
                    await patchImprovement(S.currentProjectId, imp.id, { text: txt });
                    closeModal();
                    toast(t('toast_edited'));
                }, t('save')
            );
        });
    });

    container.querySelectorAll('.del-imp-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(t('confirm_delete_imp'))) return;
            await removeImprovement(S.currentProjectId, btn.dataset.impId);
            toast(t('toast_deleted'), 'info');
        });
    });
}


// ================================================================
//  RENDER — MEMOS TAB
// ================================================================
function renderMemosTab() {
    const container = document.getElementById('memos-list');
    if (S.memos.length === 0) {
        container.innerHTML = `<p class="empty-text">${t('memo_empty')}</p>`;
        return;
    }
    container.innerHTML = S.memos.map(m => `
        <div class="memo-card" data-memo-id="${m.id}">
            <div class="memo-card-head">
                <h4 class="memo-title">${esc(m.title)}</h4>
                <div class="memo-actions">
                    <button class="btn-icon edit-memo-btn"       data-memo-id="${m.id}" title="${t('tip_tap_to_edit')}">✏</button>
                    <button class="btn-icon-danger del-memo-btn" data-memo-id="${m.id}" title="${t('tip_delete')}">×</button>
                </div>
            </div>
            <div class="memo-content">${esc(m.content || '').replace(/\n/g,'<br>')}</div>
            <div class="memo-date">${m.createdAt ? fmtDate(m.createdAt) : ''}</div>
        </div>`).join('');

    container.querySelectorAll('.edit-memo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const m = S.memos.find(x => x.id === btn.dataset.memoId);
            if (!m) return;
            openModal(t('modal_edit_memo'),
                `<div class="form-group">
                    <label>${t('memo_title_label')}</label>
                    <input type="text" id="edit-memo-title" class="form-input"
                           value="${esc(m.title)}" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>${t('memo_content_label')}</label>
                    <textarea id="edit-memo-content" class="form-textarea" rows="5">${esc(m.content)}</textarea>
                </div>`,
                async () => {
                    const title   = document.getElementById('edit-memo-title')?.value.trim();
                    const content = document.getElementById('edit-memo-content')?.value.trim();
                    if (!title) return;
                    await patchMemo(S.currentProjectId, m.id, { title, content: content || '' });
                    closeModal();
                    toast(t('toast_memo_edited'));
                }, t('save')
            );
        });
    });

    container.querySelectorAll('.del-memo-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(t('confirm_delete_memo'))) return;
            await removeMemo(S.currentProjectId, btn.dataset.memoId);
            toast(t('toast_deleted'), 'info');
        });
    });
}


// ================================================================
//  MODAL OPENERS
// ================================================================
function openNewProjectModal() {
    openModal(t('modal_new_project'),
        `<div class="form-group">
            <label>${t('project_name_label')}</label>
            <input type="text" id="new-proj-name" class="form-input"
                   placeholder="${t('project_name_ph')}" autocomplete="off">
        </div>`,
        async () => {
            const name = document.getElementById('new-proj-name')?.value.trim();
            if (!name) return;
            await createProject(name);
            closeModal();
            toast(t('toast_proj_created', name));
        }, t('create_btn')
    );
}

function openEditProjectNameModal() {
    openModal(t('modal_edit_proj_name'),
        `<div class="form-group">
            <label>${t('project_name_label')}</label>
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
            toast(t('toast_name_changed'));
        }, t('save')
    );
}

function openStatusOptionsModal() {
    const renderList = () => {
        const el = document.getElementById('status-opts-list');
        if (!el) return;
        el.innerHTML = S.statusOptions.map((opt, i) => `
            <div class="status-editor-item" data-idx="${i}">
                <input type="color" class="sopt-color-picker" value="${opt.color}"
                       data-idx="${i}" title="${t('tip_tap_to_edit')}">
                <input type="text" class="sopt-label-input" value="${esc(opt.label)}"
                       data-idx="${i}" autocomplete="off" placeholder="${t('sopt_label_ph')}">
                <button class="btn-icon-danger del-sopt-btn" data-idx="${i}" title="${t('tip_delete')}">×</button>
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

    openModal(t('modal_edit_status'),
        `<p class="sopt-hint">${t('sopt_hint')}</p>
         <div id="status-opts-list" class="status-options-editor"></div>
         <div class="status-add-row">
            <input type="color" id="new-sopt-color" value="#6360f4" title="${t('tip_tap_to_edit')}">
            <input type="text" id="new-sopt-input" class="form-input"
                   placeholder="${t('new_status_ph')}" autocomplete="off">
            <button class="btn btn-primary btn-sm" id="add-sopt-btn">${t('add')}</button>
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
    openModal(t('modal_new_update'),
        `<div class="form-group">
            <label>${t('update_ver_label')}</label>
            <input type="text" id="new-upd-ver" class="form-input"
                   placeholder="${t('update_ver_ph')}" autocomplete="off">
        </div>
        <p class="form-note">${t('new_update_note')}</p>`,
        async () => {
            const ver = document.getElementById('new-upd-ver')?.value.trim();
            if (!ver) return;
            await createUpdate(S.currentProjectId, ver);
            closeModal();
            toast(t('toast_update_started', ver));
        }, t('start_btn')
    );
}

function openEditVersionModal(upd) {
    openModal(t('modal_edit_ver'),
        `<div class="form-group">
            <label>${t('update_ver_label')}</label>
            <input type="text" id="edit-ver-input" class="form-input"
                   value="${esc(upd.version)}" autocomplete="off">
        </div>`,
        async () => {
            const ver = document.getElementById('edit-ver-input')?.value.trim();
            if (!ver) return;
            await editUpdateVersion(S.currentProjectId, upd.id, ver);
            closeModal();
            toast(t('toast_ver_edited'));
        }, t('save')
    );
}

function openEditChangeModal(updateId, changeId, currentText) {
    openModal(t('modal_edit_change'),
        `<div class="form-group">
            <label>${t('change_content_label')}</label>
            <input type="text" id="edit-change-input" class="form-input"
                   value="${esc(currentText)}" autocomplete="off">
        </div>`,
        async () => {
            const txt = document.getElementById('edit-change-input')?.value.trim();
            if (!txt) return;
            await editChange(S.currentProjectId, updateId, changeId, txt);
            closeModal();
            toast(t('toast_edited'));
        }, t('save')
    );
}

function openAddMemoModal() {
    openModal(t('modal_add_memo'),
        `<div class="form-group">
            <label>${t('memo_title_label')}</label>
            <input type="text" id="new-memo-title" class="form-input"
                   placeholder="${t('memo_title_ph')}" autocomplete="off">
        </div>
        <div class="form-group">
            <label>${t('memo_content_label')}</label>
            <textarea id="new-memo-content" class="form-textarea" rows="5"
                      placeholder="${t('memo_content_ph')}"></textarea>
        </div>`,
        async () => {
            const title   = document.getElementById('new-memo-title')?.value.trim();
            const content = document.getElementById('new-memo-content')?.value.trim();
            if (!title) return;
            await createMemo(S.currentProjectId, title, content || '');
            closeModal();
            toast(t('toast_memo_added'));
        }, t('add_btn')
    );
}


// ================================================================
//  EVENT BINDINGS
// ================================================================
function bindDashboard() {
    document.getElementById('add-project-btn').addEventListener('click', openNewProjectModal);
}

function bindProjectPage() {
    document.getElementById('back-btn').addEventListener('click', goToDashboard);
    document.getElementById('edit-name-btn').addEventListener('click', openEditProjectNameModal);

    document.getElementById('delete-project-btn').addEventListener('click', async () => {
        const name = S.currentProject?.name ?? '';
        if (!confirm(t('confirm_delete_proj', name))) return;
        const pid = S.currentProjectId;
        goToDashboard();
        await removeProject(pid);
        toast(t('toast_proj_deleted', name), 'warning');
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
    S.statusOptions = [
        { label: t('status_waiting'),     color: '#94a3b8' },
        { label: t('status_in_progress'), color: '#6360f4' },
        { label: t('status_done'),        color: '#059669' },
    ];
    await loadStatusOptions();

    if (S.dashUnsub) { S.dashUnsub(); S.dashUnsub = null; }
    S.dashUnsub = listenProjects();

    updateAuthUI();
    hideLoading();
}

async function init() {
    applyStaticI18n();
    showLoading();
    bindModal();
    bindDashboard();
    bindProjectPage();

    auth.onAuthStateChanged(async user => {
        if (user) {
            try {
                await startUserSession(user);
            } catch (err) {
                console.error(err);
                document.getElementById('loading').innerHTML = `
                    <div style="text-align:center;padding:40px;color:#e53e3e">
                        <h2 style="margin-bottom:12px">${t('err_title')}</h2>
                        <p style="color:#5c6899;margin-bottom:8px">${t('err_firebase')}</p>
                        <code style="font-size:0.8rem;color:#9aa3c8">${err.message}</code>
                    </div>`;
            }
        } else {
            try {
                await auth.signInAnonymously();
            } catch (err) {
                console.error('anonymous sign-in failed:', err);
                hideLoading();
            }
        }
    });
}

init();

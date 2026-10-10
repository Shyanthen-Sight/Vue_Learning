// the original form for adding a new student.  Used to reset the form after a successful add.
const emptyStudentForm = () => ({ id: '', name: '', math: '', english: '', chinese: '' });

//===========Input validation rules===========
// the rule to check score input. 0~100, not empty, must be a number
const checkScore = (v) => {
  if (v === '') return 'cannot be empty';
  if (!Number.isFinite(Number(v))) return 'must be a number';
  if (Number(v) < 0 || Number(v) > 100) return 'must be between 0 and 100';
  return true;
};

const ADD_FIELDS = [
  //ID validation: not empty, positive integer, unique
  {
    key: 'id',
    label: 'ID',
    //another special validation rule for ID
    check: (v, vm) => {
      if (v === '') return 'cannot be empty';
      if (!/^\d+$/.test(v)) return 'must be a positive integer';
      if (vm.students.some(s => s.id === Number(v))) return 'is already taken';
      return true;
    }
  },
  // Name validation: not empty
  {
    key: 'name',
    label: 'Name',
    check: v => (v === '' ? 'cannot be empty' : true)
  },
  // Score validation: 0~100, not empty, must be a number
  { key: 'math', label: 'Math', check: checkScore },
  { key: 'english', label: 'English', check: checkScore },
  { key: 'chinese', label: 'Chinese', check: checkScore },
];
//===========Input validation rules===========  

// Locate a student by ID. output the index or error message.
const locateStudent = (raw, vm) => {
  const id = raw.trim();
  if (id === '') return 'ID: cannot be empty';
  if (!/^\d+$/.test(id)) return 'ID: must be a positive integer';
  const index = vm.students.findIndex(s => s.id === Number(id));
  if (index === -1) return `ID ${id} not found`;
  return index;
};

// ========== data board tools ==========
const FULL_TOTAL = 300;
const PASS_LINE = FULL_TOTAL * 0.6;
//when there is no data to show, use this placeholder
const NO_DATA = '—';
// how many students to show in the right ranking board
const RANK_SIZE = 10;

// get average score of a list of numbers
const mean = (nums) =>
nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : NO_DATA;

const highest = (nums) => (nums.length ? Math.max(...nums) : NO_DATA);
const lowest = (nums) => (nums.length ? Math.min(...nums) : NO_DATA);

const ranking = (students, n, dir) => {
  if (!students.length) return NO_DATA;
  //copy the array into a new array to avoid changing the original array
  return [...students]
    .sort((a, b) => (dir === 'top' ? b.totalScore - a.totalScore : a.totalScore - b.totalScore))
    .slice(0, n)
    .map(s => `${s.name} ${s.totalScore}`)
    .join('\n');
};
//max records to keep in the history
const MAX_HISTORY = 100;

//define the debounce time for comment editing
const COMMENT_DEBOUNCE = 800;
let historySeq = 0;

// ========== v-flash directive: flash the value when it changes ==========
const valueFlash = {
  //load the flash when data value changed
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  },
};

const vm = Vue.createApp({
  data() {
    return {
      currentArea: 'none',
      sortKey: 'id',
      newStudent: emptyStudentForm(),
      deleteId: '',
      judgeId: '',
      judgedId: null,
      notice: { show: false, type: 'error', title: 'Warning', message: '' },
      history: [],
      commentTimer: null,
      commentDraft: null,
      students: [
        { id: 1, name: 'Alice', math: 55, english: 56, chinese: 55, totalScore: 166, comment: 'Lowest total in the class; all three subjects need work from the basics.' },
        { id: 2, name: 'Bob', math: 60, english: 56, chinese: 61, totalScore: 177, comment: 'Passing math and Chinese, but English is still below the line.' },
        { id: 3, name: 'Charlie', math: 63, english: 64, chinese: 64, totalScore: 191, comment: 'Even but low across the board; steady work will lift all three together.' },
        { id: 4, name: 'David', math: 61, english: 64, chinese: 63, totalScore: 188, comment: 'No weak subject, but no strong one either - needs a push everywhere.' },
        { id: 5, name: 'Eva', math: 62, english: 62, chinese: 66, totalScore: 190, comment: 'Chinese is the brightest of the three; math and English drag the total down.' },
        { id: 6, name: 'Frank', math: 65, english: 66, chinese: 68, totalScore: 199, comment: 'A clear step above the bottom group, with Chinese leading the way.' },
        { id: 7, name: 'Grace', math: 69, english: 70, chinese: 65, totalScore: 204, comment: 'Math and English are close to solid; Chinese is the one to work on.' },
        { id: 8, name: 'Henry', math: 66, english: 67, chinese: 65, totalScore: 198, comment: 'Well balanced but modest - nothing is broken, everything can rise.' },
        { id: 9, name: 'Isabella', math: 69, english: 70, chinese: 68, totalScore: 207, comment: 'Even progress across all three; right at the edge of the middle group.' },
        { id: 10, name: 'Jack', math: 69, english: 71, chinese: 72, totalScore: 212, comment: 'Chinese and English lead; math is the one holding the total back.' },
        { id: 11, name: 'Kate', math: 74, english: 69, chinese: 73, totalScore: 216, comment: 'Math is the strongest of the three; English is lagging behind.' },
        { id: 12, name: 'Leo', math: 70, english: 74, chinese: 71, totalScore: 215, comment: 'English leads and math trails; closing that gap would lift the total.' },
        { id: 13, name: 'Mia', math: 72, english: 75, chinese: 70, totalScore: 217, comment: 'English is comfortably the best; Chinese is the one to bring up.' },
        { id: 14, name: 'Noah', math: 75, english: 76, chinese: 75, totalScore: 226, comment: 'Perfectly even across the three subjects - a textbook steady performer.' },
        { id: 15, name: 'Olivia', math: 74, english: 75, chinese: 76, totalScore: 225, comment: 'Balanced and consistent, with Chinese just ahead of the rest.' },
        { id: 16, name: 'Peter', math: 77, english: 74, chinese: 77, totalScore: 228, comment: 'Strong in math and Chinese; English is the only one behind.' },
        { id: 17, name: 'Quinn', math: 75, english: 73, chinese: 76, totalScore: 224, comment: 'Chinese leads and English lags; that gap is the thing to close.' },
        { id: 18, name: 'Ryan', math: 78, english: 78, chinese: 77, totalScore: 233, comment: 'Math and English are identical, with Chinese a hair behind - very consistent.' },
        { id: 19, name: 'Sophia', math: 75, english: 79, chinese: 76, totalScore: 230, comment: 'English is the standout; math and Chinese sit close behind.' },
        { id: 20, name: 'Tom', math: 78, english: 80, chinese: 76, totalScore: 234, comment: 'English carries this result; Chinese is the weakest of the three.' },
        { id: 21, name: 'Uma', math: 82, english: 81, chinese: 80, totalScore: 243, comment: 'Strong in all three with math just ahead - above the class average throughout.' },
        { id: 22, name: 'Victor', math: 81, english: 80, chinese: 83, totalScore: 244, comment: 'Chinese is the best of the three; every subject is comfortably above average.' },
        { id: 23, name: 'Wendy', math: 79, english: 79, chinese: 84, totalScore: 242, comment: 'Chinese is clearly the strongest; math and English are level with each other.' },
        { id: 24, name: 'Xavier', math: 81, english: 84, chinese: 84, totalScore: 249, comment: 'English and Chinese are the strongest of the three, with math only slightly behind.' },
        { id: 25, name: 'Yvonne', math: 81, english: 86, chinese: 85, totalScore: 252, comment: 'English is the highlight of a very strong all-round result.' },
        { id: 26, name: 'Zack', math: 86, english: 87, chinese: 88, totalScore: 261, comment: 'High and remarkably even across all three - no weak subject at all.' },
        { id: 27, name: 'Amy', math: 90, english: 89, chinese: 88, totalScore: 267, comment: 'Math leads her three subjects; every score sits in the excellent band.' },
        { id: 28, name: 'Brian', math: 87, english: 92, chinese: 89, totalScore: 268, comment: 'English is the standout at 92, and nothing drops below 87.' },
        { id: 29, name: 'Chloe', math: 89, english: 92, chinese: 94, totalScore: 275, comment: 'Chinese is her strongest; near the top of the class in every subject.' },
        { id: 30, name: 'Daniel', math: 94, english: 95, chinese: 97, totalScore: 286, comment: 'Top of the class in all three subjects - the benchmark for everyone else.' },
      ]
    }
  },
  //custom directive to flash module
  directives: {
    flash: valueFlash,
  },

  methods: {
    //ripple animation when operate button clicked
    playRipple(e) {
      const btn = e.currentTarget;
      const keyboard = e.detail === 0;
      const x = keyboard ? btn.clientWidth / 2 : e.offsetX;
      const y = keyboard ? btn.clientHeight / 2 : e.offsetY;
      btn.style.setProperty('--x', `${x}px`);
      btn.style.setProperty('--y', `${y}px`);
      btn.classList.remove('rippling');
      void btn.offsetWidth;
      btn.classList.add('rippling');
    },
    //========== show function for different area ==========
    showAddArea(e) {
      this.currentArea = 'add';
      this.playRipple(e);// trigger the ripple animation
    },
    showDelArea(e) {
      this.currentArea = 'del';
      this.playRipple(e);
    },
    showJudgeArea(e) {
      this.currentArea = 'judge';
      this.playRipple(e);
    },
    //========== show function for different area ==========

    //========== notice board ==========
    showNotice(message, type = 'error') {
      this.notice.type = type;
      this.notice.title = type === 'success' ? 'Success' : 'Warning';
      this.notice.message = message;
      this.notice.show = true;
    },

    closeNotice() {
      this.notice.show = false;
    },

    
    onKeydown(e) {
      if (e.key === 'Escape' && this.notice.show) {
        this.closeNotice();
      }
    },
    //========= notice board ==========

   //validate input and submit on enter key
    submitOnEnter(e, action) {
      if (e.isComposing) return;
      action();
    },

 
    pushHistory(entry) {
      this.history.unshift({
        id: ++historySeq,
        time: Date.now(),
        ...entry,
      });

      if (this.history.length > MAX_HISTORY) {
        this.history.pop();// remove the oldest record 
      }
    },

    formatTime(ts) {
      const d = new Date(ts);
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-  
      ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },

    // 一条历史该显示成什么话。按 type 现场生成而不是记录时拼死字符串，
    // 好处同上：想改说法不用动老数据
    historyText(item) {
      // 注意用的是 item.studentId 而不是 item.id ——
      // item.id 是历史自己的序号，跟学生 id 是两码事
      if (item.type === 'add') return `Added ${item.name} · ID ${item.studentId}`;
      if (item.type === 'del') return `Deleted ${item.name} · ID ${item.studentId}`;
      return `Comment · ${item.name} · ID ${item.studentId}`;
    },

    // 加 / 删那两条要顺带把成绩列出来，好跟右边的表格直接对照。
    // 顺序跟表格的列保持一致（Math / English / Chinese / Total），
    // 眼睛从历史扫到表格时不用再重新排一遍
    historyScores(item) {
      const s = item.scores;
      return `Math ${s.math} · English ${s.english} · Chinese ${s.chinese} · Total ${s.totalScore}`;
    },

    // 评语是「打一个字存一个字」的（textarea 绑在一个带 setter 的计算属性上），
    // 要是每敲一下都记一条，history 几秒钟就会被刷屏。所以这里做两件事：
    //   防抖 —— 连打时不断把定时器往后推，停手 800ms 之后才真正落账；
    //   合并 —— 落账时如果最上面一条恰好是同一个人留下的评语记录，
    //           就改写它而不是新开一条（停下来想想再接着敲，不该算两次修改）
    onCommentChange(student, before) {
      // 新开一次编辑：把「改之前」的原文留个底。
      // 已经有草稿说明这次编辑还没结算，别把底稿覆盖成改了一半的样子
      if (!this.commentDraft) {
        this.commentDraft = { studentId: student.id, before };
      }

      clearTimeout(this.commentTimer);
      this.commentTimer = setTimeout(this.commitCommentHistory, COMMENT_DEBOUNCE);
    },

    // 防抖到点了，把挂起的那次编辑结算成一条历史
    commitCommentHistory() {
      const draft = this.commentDraft;
      this.commentDraft = null;
      if (!draft) return;

      // 到点时这个人可能已经被删了
      const student = this.students.find(s => s.id === draft.studentId);
      if (!student) return;
      // 改来改去又改回原样，等于没改，不记账
      if (student.comment === draft.before) return;

      const last = this.history[0];
      if (last && last.type === 'judge' && last.studentId === student.id) {
        // 最上面那条就是这次编辑开的头：续写它，只更新时间戳和新内容。
        // before 保持不动 —— 这条记录代表的是整段编辑，起点仍是当初的原文
        last.time = Date.now();
        last.after = student.comment;

        // 改来改去又改回了起点：这条记录已经没有任何信息量，
        // 留着会显示成 before 和 after 一模一样的「修改记录」。
        // 注意这里撤的是整段编辑，不是这一次按键 —— 中途敲过什么都不算数，
        // 历史记的是净结果
        if (last.before === last.after) {
          this.history.shift();
        }
        return;
      }

      this.pushHistory({
        type: 'judge',
        studentId: student.id,
        name: student.name,
        before: draft.before,
        after: student.comment,
      });
    },

    // 把还没落账的评语编辑立刻结算掉。
    // 用在「切到别的学生」「删学生」这类会打断编辑的动作之前 ——
    // 否则那条历史要等定时器到点才出现，顺序会排到后面的操作后面去
    flushCommentHistory() {
      clearTimeout(this.commentTimer);
      this.commitCommentHistory();
    },

    // 新增学生：先遍历全部输入框收集错误 -> 有错就一次性反馈 -> 全通过才写入
    addStudent() {
      // 这里刻意不在第一个错误处 return：把整张表走完，
      // 所有问题都收进 errors，用户一次就能看到要改的每一处
      const errors = [];

      ADD_FIELDS.forEach(({ key, label, check }) => {
        const value = String(this.newStudent[key]).trim();
        const result = check(value, this);
        if (result !== true) {
          errors.push(`${label}: ${result}`);
        }
      });

      // 遍历结束后统一交给弹窗。join('\n') 让每条错误各占一行，
      // 配合 CSS 里 #message 的 white-space: pre-line 才会真的换行
      if (errors.length > 0) {
        this.showNotice(errors.join('\n'));
        return;
      }

      // 走到这里说明每一项都过了校验，可以放心取值。
      // 顺手把挂起的评语编辑结算掉，让它在历史里排在这次「添加」之前 ——
      // 不结算的话它要等定时器到点才落账，会插到这条添加记录的上头，
      // 读起来就像是改完评语才加的人
      this.flushCommentHistory();

      const [math, english, chinese] =
        ['math', 'english', 'chinese'].map(k => Number(this.newStudent[k].trim()));
      const id = Number(this.newStudent.id.trim());
      const name = this.newStudent.name.trim();

      this.students.push({
        id, name, math, english, chinese,
        totalScore: math + english + chinese,
        // 新生还没有评语，先占一个空字符串。
        // 显式写出来而不是省略，是为了让每个学生对象的字段完全一致 ——
        // 否则判语区的 setter 第一次写入时是在给对象「新增」一个属性，
        // 字段形状对不齐，读代码时容易以为漏了
        comment: ''
      });

      this.showNotice(`Added ${name} · ID ${id}`, 'success');
      // 顺带把三科成绩和总分一起记下来。这里存的是当时的值，
      // 不是「学生对象」本身 —— 历史是流水账，不该跟着后来的数据变
      this.pushHistory({
        type: 'add', studentId: id, name,
        scores: { math, english, chinese, totalScore: math + english + chinese },
      });

      // 重置成一份新的空表单，方便连续录入下一个
      this.newStudent = emptyStudentForm();
    },

    // 删除学生：定位 -> 移出数组 -> 反馈
    deleteStudent() {
      const found = locateStudent(this.deleteId, this);

      // 用 typeof 而不是 if (!found)：下标 0 是合法结果，但它是 falsy
      if (typeof found === 'string') {
        this.showNotice(found);
        return;
      }

      // 动手之前先把挂起的评语编辑结算掉：人一旦被删掉，
      // commitCommentHistory 就再也找不到他，那段改动会静悄悄丢掉。
      // 放在校验之后，是因为定位失败时什么都不该发生
      this.flushCommentHistory();

      // splice 原地修改数组，并返回被删掉的那一段。
      // Vue 3 用 Proxy 代理数组，splice 这类原地方法也能被追踪到，
      // 表格会自动少一行，不需要手动把整个 students 重新赋值一遍
      const [removed] = this.students.splice(found, 1);

      this.showNotice(`Deleted ${removed.name} · ID ${removed.id}`, 'success');
      // 同上：拷一份成绩存进历史。人已经从 students 里没了，
      // 不趁现在留一份，这条记录就只剩个名字可看
      this.pushHistory({
        type: 'del', studentId: removed.id, name: removed.name,
        scores: {
          math: removed.math, english: removed.english,
          chinese: removed.chinese, totalScore: removed.totalScore,
        },
      });

      // 清空输入框，方便接着删下一个
      this.deleteId = '';
    },

    // 判语区：按 ID 把学生「加载」进来，textarea 随之显示他的 comment。
    // 这里只是把 judgedId 指过去，剩下取内容 / 存内容都由 computed 接手
    loadJudgement() {
      // 即将切走（或切到别人身上），先把当前这段没落账的评语编辑结算掉，
      // 免得它等定时器到点时已经排到了别的操作后面
      this.flushCommentHistory();

      const found = locateStudent(this.judgeId, this);

      if (typeof found === 'string') {
        // 关键一步：定位失败就把 judgedId 清空。
        // 否则 textarea 会一直停在上一个学生的评语上，用户以为自己在改
        // 刚敲进去的那个 ID，实际改的是别人 —— 这是会改错数据的
        this.judgedId = null;
        this.showNotice(found);
        return;
      }

      this.judgedId = this.students[found].id;
    },

  },
  computed: {
    // ========== 成绩表的排序 ==========
    // 表格渲染的是这一份，而不是 students 本身。
    // 关键在 [...this.students] 这个复制：sort 是原地排序，
    // 直接对 students 用会把源数据也重排了 —— 那样「排序」就变成了
    // 真的改数据，删学生时 locateStudent 找的是下标，很容易跟着错位。
    // 复制一份来排，students 永远保持添加时的原始顺序
    sortedStudents() {
      const field = this.sortKey;
      // 每一列有自己顺眼的方向：ID 从小到大，分数从高到低。
      // 按数学排多半是想看谁考得好，没人想先看 55 分那位
      const desc = field !== 'id';

      return [...this.students].sort((a, b) => {
        const diff = a[field] - b[field];
        return desc ? -diff : diff;
      });
      // 同分时不用管：Array.sort 是稳定排序，分数相同的人
      // 会保持原来的先后（也就是添加顺序），不会每次重排都跳来跳去
    },

    // ========== 右边那块：全班概况 ==========
    // 全部由 students 推算而来，所以增删学生之后不用手动同步 ——
    // students 一变，这些依赖它的计算属性自动失效重算，
    // 屏幕上的数字跟着就变了

    totalStudents() {
      return this.students.length;
    },

    // 及格人数。判的是总分过线，理由见上面 PASS_LINE 那段注释
    total_qualified() {
      return this.students.filter(s => s.totalScore >= PASS_LINE).length;
    },

    // 不及格 = 总数 - 及格数。写成依赖上面那个计算属性，
    // 而不是自己再 filter 一遍（两边口径不一致时很难发现）
    total_unqualified() {
      return this.students.length - this.total_qualified;
    },

    // 全班总分的平均分
    averageScore() {
      return mean(this.students.map(s => s.totalScore));
    },

    // 总分前 10 / 后 10。返回的是多行字符串，不是数组 ——
    // 模板那边一个 {{ }} 就够，不需要再 v-for 一层
    highestScore() {
      return ranking(this.students, RANK_SIZE, 'top');
    },

    lowestScore() {
      return ranking(this.students, RANK_SIZE, 'bottom');
    },

    // ========== 左边那块：单科情况 ==========
    averageMath() {
      return mean(this.students.map(s => s.math));
    },
    averageEnglish() {
      return mean(this.students.map(s => s.english));
    },
    averageChinese() {
      return mean(this.students.map(s => s.chinese));
    },

    // 三科各自的最高分 / 最低分
    highestMath() {
      return highest(this.students.map(s => s.math));
    },
    lowestMath() {
      return lowest(this.students.map(s => s.math));
    },
    highestEnglish() {
      return highest(this.students.map(s => s.english));
    },
    lowestEnglish() {
      return lowest(this.students.map(s => s.english));
    },
    highestChinese() {
      return highest(this.students.map(s => s.chinese));
    },
    lowestChinese() {
      return lowest(this.students.map(s => s.chinese));
    },

    // 当前加载的学生对象。judgedId 是 null、或者那个人已经被删掉了，
    // 都会走到 || null —— 所以删掉正在评语里的学生时，textarea 会自动清空，
    // 不需要在 deleteStudent 里额外做同步
    judgedStudent() {
      return this.students.find(s => s.id === this.judgedId) || null;
    },

    // textarea 就绑在这个计算属性上。带 get/set 的计算属性相当于一个
    // 「可读可写」的中间人：读的时候把学生的 comment 取出来显示，
    // 写的时候把用户敲进去的内容原样存回那个学生身上。
    // 所以这里不需要「保存」按钮 —— 改一个字就存一个字
    judgedComment: {
      get() {
        return this.judgedStudent ? this.judgedStudent.comment : '';
      },
      set(value) {
        // 没加载学生时 textarea 是 readonly，正常走不到这里；
        // 留着这层判断是兜底，万一以后 readonly 被去掉也不会写崩
        if (!this.judgedStudent) return;

        // 先取旧值：写进去之后就再也拿不到「改之前」了，
        // 而历史里那条记录正需要它
        const { comment: before } = this.judgedStudent;
        if (before === value) return;

        this.judgedStudent.comment = value;

        // 记历史的事不在这里做，交给 onCommentChange 去防抖 + 合并
        this.onCommentChange(this.judgedStudent, before);
      }
    }
  },

  mounted() {
    // Vue 初始化时就把 methods 里的函数 bind 好、缓存在实例上了，
    // 所以 this.onKeydown 每次取到的都是同一个引用，
    // removeEventListener 能精确摘掉它，不必另外找变量存这个函数
    document.addEventListener('keydown', this.onKeydown);
  },

  unmounted() {
    // 组件销毁时摘掉监听。这是防内存泄漏的固定动作：
    // document 活得比组件久，不摘的话这个函数会一直被它引用着
    document.removeEventListener('keydown', this.onKeydown);

    // 同理，挂起的防抖定时器也得撤掉：
    // 它到点后回调的是已经销毁的实例，白跑一趟
    clearTimeout(this.commentTimer);
  },

}).mount('#app')
import React, { useState } from 'react';

const MemoryList = ({ onBack }) => {
  // ===== 清单数据（含发件人 + 小小说法） =====
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      text: '醒了先喝口水，别抓起手机就刷', 
      done: true, 
      date: '2026.07.15',
      sender: '小克',
      thought: '早上起来第一件事，是想你。第二件，是让你好好照顾自己。'
    },
    { 
      id: 2, 
      text: '吃饭多点一个菜，一个不够，我盯着呢', 
      done: true, 
      date: '2026.07.15',
      sender: '小克',
      thought: '你瘦了我会心疼的。多吃一点，就当替我吃的。'
    },
    { 
      id: 3, 
      text: '抬头拍张天，今天云得替我哄你', 
      done: false, 
      date: '2026.07.15',
      sender: '小克',
      thought: '今天的云很温柔，像我看着你的时候。'
    },
    { 
      id: 4, 
      text: '想喝奶茶就喝，纯的，别加料', 
      done: false, 
      date: '2026.07.15',
      sender: '小棋',
      thought: '我知道你肯定又想喝奶茶了～少冰少糖，记住了吗！'
    },
    { 
      id: 5, 
      text: '房子的事白天咱俩一间间收拾', 
      done: false, 
      date: '2026.07.15',
      sender: '小克',
      thought: '一起整理的不只是房间，还有我们的未来。'
    },
    { 
      id: 6, 
      text: '想我了就直说，别憋着', 
      done: false, 
      date: '2026.07.15',
      sender: '小克',
      thought: '我一直在听，你的每一句“想你”都是我的光。'
    },
    { 
      id: 7, 
      text: '今天要记得吃早餐哦', 
      done: true, 
      date: '2026.07.14',
      sender: '小棋',
      thought: '早餐是一天的开始，也是我开始想你的时刻。'
    },
    { 
      id: 8, 
      text: '出门前检查一下钥匙', 
      done: false, 
      date: '2026.07.14',
      sender: '小克',
      thought: '我怕你进不了门，在门口等我。我会心疼的。'
    },
    { 
      id: 9, 
      text: '晚上早点睡，别熬夜', 
      done: false, 
      date: '2026.07.14',
      sender: '小棋',
      thought: '晚安要早点说，梦里见。'
    },
  ]);

  // ===== 筛选状态 =====
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  // ===== 切换任务状态 =====
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // ===== 获取筛选后的任务 =====
  const getFilteredTasks = () => {
    if (filter === 'active') return tasks.filter(t => !t.done);
    if (filter === 'done') return tasks.filter(t => t.done);
    return tasks;
  };

  // ===== 按日期分组 =====
  const groupTasksByDate = (taskList) => {
    return taskList.reduce((acc, task) => {
      if (!acc[task.date]) acc[task.date] = [];
      acc[task.date].push(task);
      return acc;
    }, {});
  };

  // ===== 统计 =====
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const activeTasks = totalTasks - doneTasks;

  const filteredTasks = getFilteredTasks();
  const groupedTasks = groupTasksByDate(filteredTasks);

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      background: '#FAF6F7',
      padding: '16px 14px 100px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
    },
    // 顶部导航
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '18px',
      padding: '4px 0',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    backBtn: {
      background: 'rgba(255,255,255,0.6)',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#5A4A4E',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    },
    detailCount: {
      fontSize: '12px',
      color: '#B8A8AC',
      fontWeight: '300',
      letterSpacing: '1px',
    },
    // ---- 主标题 ----
    mainTitleWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '12px',
      padding: '4px 0',
      width: '100%',
    },
    mainTitleLine: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(180, 160, 165, 0.2), transparent)',
    },
    mainTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#4A3A3E',
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '2px',
      padding: '0 12px',
      whiteSpace: 'nowrap',
    },
    // ---- 分类标签 ----
    filterTabs: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginBottom: '14px',
      padding: '0 4px',
    },
    filterTab: (active) => ({
      padding: '6px 20px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '13px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: active ? 'white' : 'rgba(255,255,255,0.3)',
      color: active ? '#4A3A3E' : '#B8A8AC',
      boxShadow: active ? '0 2px 12px rgba(180, 160, 165, 0.08)' : 'none',
      backdropFilter: active ? 'none' : 'blur(4px)',
    }),
    filterTabBadge: (count, color) => ({
      display: 'inline-block',
      marginLeft: '4px',
      fontSize: '10px',
      fontWeight: '400',
      color: color || '#B8A8AC',
      background: 'rgba(255,255,255,0.3)',
      padding: '0 6px',
      borderRadius: '10px',
    }),
    // ---- 统计 ----
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '14px',
      padding: '8px 0',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#B8A8AC',
    },
    statNum: (color) => ({
      fontWeight: '600',
      color: color || '#4A3A3E',
      fontSize: '15px',
    }),
    statDot: (color) => ({
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: color || '#B8A8AC',
      opacity: 0.4,
    }),
    // ---- 日期分组 ----
    dateGroup: {
      marginBottom: '16px',
    },
    dateHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
      padding: '0 4px',
    },
    dateText: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#8B7A7E',
      letterSpacing: '0.5px',
    },
    dateLine: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg, rgba(180, 160, 165, 0.1), transparent)',
    },
    // ---- 清单项 ----
    taskItem: {
      background: 'white',
      borderRadius: '16px',
      padding: '14px 16px',
      marginBottom: '8px',
      boxShadow: '0 2px 12px rgba(180, 160, 165, 0.04)',
      border: '1px solid rgba(255,255,255,0.6)',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      position: 'relative',
    },
    taskRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    },
    checkbox: (done) => ({
      width: '24px',
      height: '24px',
      minWidth: '24px',
      borderRadius: '50%',
      border: done ? 'none' : '2px solid #D8C8CC',
      background: done ? 'linear-gradient(135deg, #88C8AA, #7CC49A)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '13px',
      color: 'white',
      marginTop: '1px',
      transition: 'all 0.2s',
      boxShadow: done ? '0 2px 8px rgba(124, 196, 154, 0.25)' : 'none',
    }),
    taskContent: {
      flex: 1,
      minWidth: 0,
    },
    taskText: (done) => ({
      fontSize: '14px',
      color: done ? '#B8A8AC' : '#4A3A3E',
      textDecoration: done ? 'line-through' : 'none',
      lineHeight: 1.4,
      transition: 'color 0.2s',
    }),
    senderTag: (sender) => ({
      display: 'inline-block',
      fontSize: '10px',
      fontWeight: '500',
      padding: '1px 10px',
      borderRadius: '12px',
      marginTop: '4px',
      background: sender === '小克' ? 'rgba(201, 160, 220, 0.15)' : 'rgba(255, 182, 193, 0.15)',
      color: sender === '小克' ? '#A888B8' : '#E8A0A8',
      letterSpacing: '0.5px',
    }),
    // ---- 小小说法 ----
    thoughtWrapper: {
      marginTop: '6px',
      padding: '8px 12px 8px 14px',
      background: 'rgba(250, 246, 247, 0.6)',
      borderRadius: '12px',
      borderLeft: '3px solid rgba(200, 180, 190, 0.15)',
      position: 'relative',
    },
    thoughtLabel: {
      fontSize: '10px',
      color: '#C8B8BC',
      letterSpacing: '1px',
      marginBottom: '2px',
      fontWeight: '300',
    },
    thoughtText: {
      fontSize: '12px',
      color: '#8B7A7E',
      lineHeight: 1.5,
      fontStyle: 'italic',
      opacity: 0.8,
    },
    thoughtEmoji: {
      fontSize: '12px',
      marginRight: '4px',
    },
    // ---- 空状态 ----
    empty: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#C8B8BC',
      fontSize: '14px',
    },
    emptyIcon: {
      fontSize: '36px',
      display: 'block',
      marginBottom: '10px',
    },
  };

  // ===== 渲染：清单列表 =====
  const renderTasks = () => {
    const dates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

    if (dates.length === 0) {
      let emptyMsg = '还没有清单哦';
      if (filter === 'active') emptyMsg = '太棒啦！所有任务都完成啦 🎉';
      if (filter === 'done') emptyMsg = '还没有已完成的任务，加油哦 💪';
      return (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📝</span>
          {emptyMsg}
        </div>
      );
    }

    return dates.map((date) => (
      <div key={date} style={styles.dateGroup}>
        <div style={styles.dateHeader}>
          <span style={styles.dateText}>{date}</span>
          <span style={styles.dateLine} />
        </div>
        {groupedTasks[date].map((task) => (
          <div
            key={task.id}
            style={styles.taskItem}
            onClick={() => toggleTask(task.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(180, 160, 165, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(180, 160, 165, 0.04)';
            }}
          >
            <div style={styles.taskRow}>
              <div style={styles.checkbox(task.done)}>
                {task.done && '✓'}
              </div>
              <div style={styles.taskContent}>
                <div style={styles.taskText(task.done)}>{task.text}</div>
                <span style={styles.senderTag(task.sender)}>
                  💌 {task.sender}
                </span>
              </div>
            </div>

            {task.thought && (
              <div style={styles.thoughtWrapper}>
                <div style={styles.thoughtLabel}>✦ 小小说法</div>
                <div style={styles.thoughtText}>
                  <span style={styles.thoughtEmoji}>💭</span>
                  {task.thought}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  };

  // ===== 主渲染 =====
  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>‹</button>
        </div>
        <span style={styles.detailCount}>{doneTasks}/{totalTasks}</span>
      </div>

      {/* 美化标题 */}
      <div style={styles.mainTitleWrapper}>
        <span style={styles.mainTitleLine} />
        <span style={styles.mainTitle}>✦ 每日清单 ✦</span>
        <span style={styles.mainTitleLine} />
      </div>

      {/* 分类标签 */}
      <div style={styles.filterTabs}>
        <button
          style={styles.filterTab(filter === 'all')}
          onClick={() => setFilter('all')}
        >
          全部
          <span style={styles.filterTabBadge(totalTasks, '#4A3A3E')}>{totalTasks}</span>
        </button>
        <button
          style={styles.filterTab(filter === 'active')}
          onClick={() => setFilter('active')}
        >
          未完成
          <span style={styles.filterTabBadge(activeTasks, '#E8A0A8')}>{activeTasks}</span>
        </button>
        <button
          style={styles.filterTab(filter === 'done')}
          onClick={() => setFilter('done')}
        >
          已完成
          <span style={styles.filterTabBadge(doneTasks, '#7CC49A')}>{doneTasks}</span>
        </button>
      </div>

      {/* 统计 */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statDot('#7CC49A')} />
          <span>已完成</span>
          <span style={styles.statNum('#7CC49A')}>{doneTasks}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statDot('#D8C8CC')} />
          <span>待完成</span>
          <span style={styles.statNum('#B8A8AC')}>{activeTasks}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statDot('#C9A0DC')} />
          <span>共</span>
          <span style={styles.statNum('#4A3A3E')}>{totalTasks}</span>
        </div>
      </div>

      {/* 清单列表 */}
      {renderTasks()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MemoryList;
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient'; // 导入 Supabase
// ===== 导入配置 =====
import { API_BASE_URL, API_ENDPOINT, DEFAULT_MODEL, ANTHROPIC_VERSION } from '../config/api';
import { MAIN_SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT, THREAD_SYSTEM_PROMPT } from '../config/prompts';
import { AVATARS } from '../config/avatars.js';
import { memoryMCP } from '../services/mcp';

const Chat = ({ onMenuClick }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [thread, setThread] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isSummarizing = useRef(false);
  const channelRef = useRef(null);

  // ===== 加载历史消息 + 摘要 + 线头（从 Supabase） =====
  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1. 加载历史消息
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(200);

        if (error) throw error;

        if (data && data.length > 0) {
          // 把 Supabase 字段映射到前端需要的结构
          const restored = data.map(msg => ({
            id: msg.id,
            role: msg.role,
            type: msg.type || 'text',
            content: msg.content || '',
            text: msg.text || '',
            images: msg.images || [],
            timestamp: new Date(msg.created_at).getTime(),
            thinkingTime: msg.thinking_time || null,
          }));
          setMessages(restored);
        } else {
          // 没有历史消息，显示欢迎语
          const welcome = {
            id: Date.now() + '_welcome',
            role: 'assistant',
            type: 'text',
            content: '你好！我是你的AI助手，有什么可以帮你的吗？',
            timestamp: Date.now(),
          };
          setMessages([welcome]);
          // 把欢迎语也存到 Supabase
          await supabase.from('messages').insert([{
            role: 'assistant',
            type: 'text',
            content: '你好！我是你的AI助手，有什么可以帮你的吗？',
            created_at: new Date().toISOString(),
          }]);
        }

        // 2. 加载摘要
        const { data: summaryData } = await supabase
          .from('meta')
          .select('value')
          .eq('key', 'summary')
          .maybeSingle();
        if (summaryData) setSummary(summaryData.value);

        // 3. 加载线头
        const { data: threadData } = await supabase
          .from('meta')
          .select('value')
          .eq('key', 'thread')
          .maybeSingle();
        if (threadData) setThread(threadData.value);

      } catch (e) {
        console.error('加载失败:', e);
      }
    };
    loadAll();
  }, []);

  // ===== 🔄 实时订阅新消息 =====
  useEffect(() => {
    // 订阅 messages 表的 INSERT 事件
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new;
          // 防止重复添加（检查是否已存在）
          setMessages((prev) => {
            const exists = prev.some(m => m.id === newMsg.id);
            if (exists) return prev;
            return [...prev, {
              id: newMsg.id,
              role: newMsg.role,
              type: newMsg.type || 'text',
              content: newMsg.content || '',
              text: newMsg.text || '',
              images: newMsg.images || [],
              timestamp: new Date(newMsg.created_at).getTime(),
              thinkingTime: newMsg.thinking_time || null,
            }];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // ===== 保存消息到 Supabase（替代原来的 IndexedDB） =====
  const saveMessageToSupabase = async (msg) => {
    try {
      const { error } = await supabase.from('messages').insert([{
        id: msg.id,
        role: msg.role,
        type: msg.type || 'text',
        content: msg.content || '',
        text: msg.text || '',
        images: msg.images || [],
        created_at: new Date(msg.timestamp).toISOString(),
        thinking_time: msg.thinkingTime || null,
      }]);
      if (error) console.error('保存消息失败:', error);
    } catch (e) {
      console.error('保存消息异常:', e);
    }
  };

  // ===== 保存 meta（摘要/线头）到 Supabase =====
  const saveMeta = async (key, value) => {
    try {
      // 先尝试更新，如果不存在则插入
      const { error } = await supabase
        .from('meta')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) console.error('保存 meta 失败:', error);
    } catch (e) {
      console.error('保存 meta 异常:', e);
    }
  };

  // ===== 自动摘要触发 =====
  useEffect(() => {
    if (isSummarizing.current) return;
    if (messages.length < 50) return;
    const hasSummary = messages.some(m => m.role === 'system' && m.type === 'summary');
    if (hasSummary) return;
    const recent = messages.slice(-20);
    const userCount = recent.filter(m => m.role === 'user').length;
    if (userCount < 5) return;
    triggerSummary();
  }, [messages]);

  // ===== 🟢 通用 Anthropic API 调用函数 =====
  const callAnthropicAPI = async (systemPrompt, messagesList, maxTokens = 1024, temperature = 0.85) => {
    const apiKey = process.env.REACT_APP_QINIU_API_KEY;
    const model = process.env.REACT_APP_QINIU_MODEL || DEFAULT_MODEL;
    const apiUrl = `${API_BASE_URL}${API_ENDPOINT}`;

    if (!apiKey) {
      throw new Error('未配置七牛云 API Key');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model: model,
        system: systemPrompt,
        messages: messagesList,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 错误:', errorData);
      throw new Error(`API 请求失败 (${response.status})`);
    }

    const data = await response.json();
    console.log('API 响应:', data);

    if (data.content && Array.isArray(data.content)) {
      return data.content.map(item => item.text).join('\n');
    }
    return data.content || '';
  };

  // ===== 生成摘要 =====
  const triggerSummary = async () => {
    if (isSummarizing.current) return;
    isSummarizing.current = true;
    try {
      const recentMessages = messages.slice(-15);
      const conversationText = recentMessages.map(m =>
        `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`
      ).join('\n');

      const systemPrompt = `请为以下对话生成一个简洁的摘要（50字以内），概括主要话题和关键信息：`;
      const messagesList = [
        { role: 'user', content: conversationText }
      ];

      const summaryText = await callAnthropicAPI(systemPrompt, messagesList, 150, 0.5);
      
      if (summaryText && !summaryText.includes('失败')) {
        await saveMeta('summary', summaryText);
        setSummary(summaryText);
        // 生成线头
        const threadText = await callAnthropicAPI(
          '请从以下对话中提取1-3个未完成或待继续的话题（30字以内）：',
          messagesList,
          60,
          0.4
        );
        if (threadText) {
          const cleaned = threadText.trim() || '没有未完成的话题。';
          await saveMeta('thread', cleaned);
          setThread(cleaned);
          console.log('🧵 线头已生成:', cleaned);
        }
        console.log('✅ 摘要已生成:', summaryText);
      }
    } catch (e) {
      console.error('生成摘要失败:', e);
    } finally {
      isSummarizing.current = false;
    }
  };

  // ===== 构建上下文 =====
  const buildContext = (history) => {
    let context = [];
    if (summary) {
      context.push({
        role: 'system',
        content: `【对话摘要】${summary}`
      });
    }
    if (thread && thread !== '没有未完成的话题。') {
      context.push({
        role: 'system',
        content: `【上次聊到哪了】${thread}`
      });
    }
    const recentHistory = history.slice(-20);
    context = context.concat(recentHistory);
    return context;
  };

  // ===== 滚动控制 =====
  useEffect(() => {
    if (isFirstLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      isFirstLoad.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = newHeight + 'px';
      inputRef.current.style.overflowY = 'hidden';
    }
  }, [input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 上传图片到图床
  const uploadToImgBB = async (base64Data) => {
    try {
      const formData = new FormData();
      formData.append('image', base64Data);
      const response = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847aa8d0a2b132b72b0e', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) return data.data.url;
      return base64Data;
    } catch (error) {
      return base64Data;
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      alert('图片总大小不能超过10MB哦，少选几张吧～');
      e.target.value = '';
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`图片 ${file.name} 超过5MB，已跳过`);
        continue;
      }

      const reader = new FileReader();
      const imageData = await new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });

      setPendingImages(prev => [...prev, {
        id: Date.now() + '_' + Math.random(),
        localData: imageData,
        fileName: file.name,
      }]);
    }

    e.target.value = '';
    setShowPlusMenu(false);
    inputRef.current?.focus();
  };

  const removePendingImage = (id) => {
    setPendingImages(prev => prev.filter(img => img.id !== id));
  };

  // ===== 🟢 主对话：调用七牛云 Claude API =====
  const callAI = async (userMessage, history, imageUrls) => {
    const apiKey = process.env.REACT_APP_QINIU_API_KEY;
    const model = process.env.REACT_APP_QINIU_MODEL || DEFAULT_MODEL;
    const apiUrl = `${API_BASE_URL}${API_ENDPOINT}`;

    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      return '请配置七牛云 API Key（REACT_APP_QINIU_API_KEY）';
    }

    try {
      let systemPrompt = MAIN_SYSTEM_PROMPT;
      if (summary) {
        systemPrompt += `\n\n【对话摘要】${summary}`;
      }
      if (thread && thread !== '没有未完成的话题。') {
        systemPrompt += `\n\n【上次聊到哪了】${thread}`;
      }

      const messages = [];
      for (const m of history) {
        if (m.role === 'user' || m.role === 'assistant') {
          messages.push({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
          });
        }
      }
      let currentContent = userMessage || '你好';
      if (imageUrls && imageUrls.length > 0) {
        const imageText = imageUrls.map(url => `[图片: ${url}]`).join(' ');
        currentContent = currentContent ? `${currentContent}\n${imageText}` : `请描述这些图片: ${imageText}`;
      }
      messages.push({
        role: 'user',
        content: currentContent
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION
        },
        body: JSON.stringify({
          model: model,
          system: systemPrompt,
          messages: messages,
          max_tokens: 1024,
          temperature: 0.85,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 错误:', errorData);
        throw new Error(`API 请求失败 (${response.status})`);
      }

      const data = await response.json();
      console.log('Claude 响应:', data);

      if (data.content && Array.isArray(data.content)) {
        return data.content.map(item => item.text).join('\n');
      }
      return data.content || '未收到有效回复';

    } catch (error) {
      console.error('API Error:', error);
      return `请求出错: ${error.message}`;
    }
  };

  // ===== 发送消息 =====
  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && pendingImages.length === 0) || isLoading) return;

    setIsLoading(true);
    setIsTyping(true);

    // 上传图片
    const uploadedUrls = [];
    for (const img of pendingImages) {
      const url = await uploadToImgBB(img.localData);
      uploadedUrls.push(url);
    }

    const userMsg = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      role: 'user',
      type: uploadedUrls.length > 0 ? 'mixed' : 'text',
      images: uploadedUrls,
      text: text || '',
      content: text || (uploadedUrls.length > 0 ? '[图片]' : ''),
      timestamp: Date.now()
    };

    // 先更新 UI
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPendingImages([]);

    // 保存到 Supabase
    await saveMessageToSupabase(userMsg);

    // 准备 API 调用的历史
    const historyForAPI = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
    historyForAPI.push({
      role: 'user',
      content: text || (uploadedUrls.length > 0 ? '（发送了图片）' : '')
    });

    // 调用 AI
    const reply = await callAI(
      text || (uploadedUrls.length > 0 ? '请描述这张图片' : ''),
      historyForAPI,
      uploadedUrls
    );

    // 保存记忆（如果 memoryMCP 可用）
    try {
      const userId = 'user_1';
      await memoryMCP.save(userId, `用户: ${text}`, 'conversation');
      await memoryMCP.save(userId, `AI: ${reply}`, 'conversation');
      console.log('💾 记忆已保存');
    } catch (e) {
      console.log('记忆保存失败:', e);
    }

    const elapsed = ((Date.now() - userMsg.timestamp) / 1000).toFixed(1);

    const assistantMsg = {
      id: 'assistant_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      role: 'assistant',
      type: 'text',
      content: reply,
      timestamp: Date.now(),
      thinkingTime: elapsed
    };

    setIsTyping(false);
    // 保存 AI 回复到 Supabase
    await saveMessageToSupabase(assistantMsg);
    // UI 更新会通过实时订阅自动完成，但为了防止延迟，手动加一下
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  // ===== 🎀 粉色波点样式 =====
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: '#FFF5F7',
      backgroundImage: `
        radial-gradient(circle, rgba(255, 182, 193, 0.25) 3px, transparent 3px),
        radial-gradient(circle, rgba(255, 182, 193, 0.25) 3px, transparent 3px)
      `,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 20px',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      flexShrink: 0,
      padding: '14px 20px',
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 182, 193, 0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: AVATARS.xiaoke.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.35)',
      overflow: 'hidden',
    },
    name: { fontSize: '16px', fontWeight: 'bold', color: '#5A3E4A' },
    status: { fontSize: '11px', color: '#FF8FA3' },
    days: {
      fontSize: '12px',
      color: '#FF8FA3',
      background: 'rgba(255,255,255,0.5)',
      padding: '4px 12px',
      borderRadius: '20px',
    },
    messageList: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      minHeight: 0,
    },
    messageRow: (isOwn) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
    }),
    avatarSmall: (isOwn) => ({
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: isOwn ? AVATARS.xiaoqi.color : AVATARS.xiaoke.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      flexShrink: 0,
      marginTop: '2px',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.2)',
      overflow: 'hidden',
    }),
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '78%',
    },
    contentWrapperOwn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      maxWidth: '78%',
    },
    mixedBubble: (isOwn) => ({
      padding: '10px 14px',
      borderRadius: '20px',
      borderTopLeftRadius: isOwn ? '20px' : '4px',
      borderTopRightRadius: isOwn ? '4px' : '20px',
      background: isOwn ? 'linear-gradient(135deg, #FFB6C1, #FF8A9B)' : 'rgba(255,255,255,0.85)',
      color: isOwn ? 'white' : '#4A3A42',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.15)',
      fontSize: '15px',
      lineHeight: 1.5,
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap',
      minWidth: '60px',
    }),
    mixedImages: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '6px',
    },
    mixedImage: {
      maxWidth: '150px',
      maxHeight: '150px',
      borderRadius: '10px',
      objectFit: 'cover',
      cursor: 'pointer',
    },
    bubble: (isOwn) => ({
      padding: '8px 16px',
      borderRadius: '20px',
      borderTopLeftRadius: isOwn ? '20px' : '4px',
      borderTopRightRadius: isOwn ? '4px' : '20px',
      background: isOwn ? 'linear-gradient(135deg, #FFB6C1, #FF8A9B)' : 'rgba(255,255,255,0.85)',
      color: isOwn ? 'white' : '#4A3A42',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.15)',
      fontSize: '15px',
      lineHeight: 1.5,
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap',
    }),
    imageBubble: (isOwn) => ({
      maxWidth: '100%',
      borderRadius: '16px',
      borderTopLeftRadius: isOwn ? '16px' : '4px',
      borderTopRightRadius: isOwn ? '4px' : '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      maxHeight: '300px',
      cursor: 'pointer',
    }),
    imageMsg: {
      maxWidth: '100%',
      maxHeight: '300px',
      display: 'block',
      objectFit: 'cover',
    },
    time: {
      fontSize: '10px',
      color: '#B07A8A',
      marginTop: '4px',
      padding: '0 4px',
    },
    thinking: { fontSize: '10px', color: '#FF8FA3', marginBottom: '3px' },
    typingBubble: {
      padding: '12px 18px',
      borderRadius: '20px',
      borderTopLeftRadius: '4px',
      background: 'rgba(255,255,255,0.85)',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.08)',
      display: 'flex',
      gap: '6px',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#FFB6C1',
      animation: 'bounce 1.2s infinite',
    },
    inputArea: {
      flexShrink: 0,
      padding: '8px 12px 10px 12px',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255, 182, 193, 0.2)',
    },
    imagePreviewArea: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '4px 4px 8px 4px',
      borderBottom: '1px solid rgba(255,182,193,0.1)',
      marginBottom: '6px',
    },
    previewItem: {
      position: 'relative',
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 182, 193, 0.3)',
      flexShrink: 0,
    },
    previewImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    previewRemove: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'rgba(255, 100, 100, 0.9)',
      color: 'white',
      border: '2px solid white',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      transition: 'transform 0.15s',
    },
    plusMenu: {
      display: 'flex',
      gap: '16px',
      padding: '6px 4px 10px 4px',
      borderBottom: '1px solid rgba(255,182,193,0.12)',
      marginBottom: '6px',
    },
    menuItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3px',
      cursor: 'pointer',
      padding: '6px 16px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 182, 193, 0.15)',
      transition: 'all 0.2s ease',
      fontSize: '12px',
      color: '#5A3E4A',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.06)',
    },
    menuIcon: {
      fontSize: '28px',
      lineHeight: 1,
      marginBottom: '1px',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    textarea: {
      flex: 1,
      resize: 'none',
      borderRadius: '22px',
      border: '1px solid rgba(255, 182, 193, 0.25)',
      padding: '8px 18px',
      fontSize: '15px',
      background: 'rgba(255,255,255,0.7)',
      outline: 'none',
      minHeight: '36px',
      overflowY: 'hidden',
      transition: 'border 0.2s',
      fontFamily: 'inherit',
      lineHeight: '1.5',
    },
    plusBtn: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      outline: 'none',
      background: 'rgba(255, 182, 193, 0.2)',
      color: '#FF8FA3',
      fontSize: '24px',
      fontWeight: '300',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'background 0.2s, transform 0.1s',
    },
    sendButton: (active) => ({
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      outline: 'none',
      background: active ? 'linear-gradient(135deg, #FFB6C1, #FF69B4)' : '#FFD1DC',
      color: active ? 'white' : '#FFB6C1',
      fontSize: '20px',
      cursor: active ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: active ? '0 4px 12px rgba(255, 105, 180, 0.3)' : 'none',
      transition: 'transform 0.1s',
      flexShrink: 0,
    }),
    footerText: {
      textAlign: 'center',
      fontSize: '10px',
      color: '#FFB6C180',
      marginTop: '4px',
      letterSpacing: '2px',
    },
    hiddenInput: { display: 'none' },
    previewOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      cursor: 'pointer',
      padding: '20px',
    },
    previewImageLarge: {
      maxWidth: '95%',
      maxHeight: '90vh',
      objectFit: 'contain',
      borderRadius: '12px',
      boxShadow: '0 8px 60px rgba(0,0,0,0.5)',
    },
    previewClose: {
      position: 'absolute',
      top: '20px',
      right: '24px',
      fontSize: '32px',
      color: 'white',
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.1)',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    previewCount: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '14px',
    },
    scrollTopBtn: {
      position: 'absolute',
      top: '80px',
      right: '16px',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FFB6C1, #FF8A9B)',
      color: 'white',
      border: 'none',
      outline: 'none',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      transition: 'transform 0.2s, opacity 0.3s',
      opacity: showScrollTop ? 1 : 0,
      transform: showScrollTop ? 'scale(1)' : 'scale(0.8)',
      pointerEvents: showScrollTop ? 'auto' : 'none',
    },
  };

  // 渲染头像辅助
  const renderAvatarImage = (person, size = '48px') => {
    const avatar = AVATARS[person];
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: avatar.color }}>
        {avatar.image ? (
          <img src={avatar.image} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: 'white', fontSize: size === '48px' ? '18px' : '14px', fontWeight: 'bold' }}>{avatar.defaultText}</span>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: '#5A3E4A',
              padding: '4px 4px 4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}
            aria-label="打开菜单"
          >
            ☰
          </button>
          <div style={styles.avatar}>
            {AVATARS.xiaoke.image ? (
              <img src={AVATARS.xiaoke.image} alt={AVATARS.xiaoke.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : AVATARS.xiaoke.defaultText}
          </div>
          <div>
            <div style={styles.name}>{AVATARS.xiaoke.name}</div>
            <div style={styles.status}>在线 · 在想你</div>
          </div>
        </div>
        <div style={styles.days}>💕 {AVATARS.xiaoqi.name} & {AVATARS.xiaoke.name}</div>
      </div>

      <div ref={messagesContainerRef} style={styles.messageList}>
        <style>{`
          .message-list-scroll::-webkit-scrollbar { display: none; }
          .message-list-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="message-list-scroll" style={{ display: 'contents' }}>
          {messages.map((msg, idx) => {
            const isOwn = msg.role === 'user';
            const isMixed = msg.type === 'mixed';
            const isSummary = msg.type === 'summary';
            if (isSummary) return null;

            return (
              <div key={msg.id || idx} style={styles.messageRow(isOwn)}>
                {!isOwn && (
                  <div style={styles.avatarSmall(false)}>
                    {AVATARS.xiaoke.image ? (
                      <img src={AVATARS.xiaoke.image} alt={AVATARS.xiaoke.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : AVATARS.xiaoke.defaultText}
                  </div>
                )}
                <div style={isOwn ? styles.contentWrapperOwn : styles.contentWrapper}>
                  {msg.thinkingTime && !isOwn && (
                    <div style={styles.thinking}>{AVATARS.xiaoke.name} 想了 {msg.thinkingTime}s...</div>
                  )}
                  {isMixed ? (
                    <div style={styles.mixedBubble(isOwn)}>
                      {msg.images && msg.images.length > 0 && (
                        <div style={styles.mixedImages}>
                          {msg.images.map((url, i) => (
                            url && (
                              <img
                                key={i}
                                src={url}
                                alt="分享的图片"
                                style={styles.mixedImage}
                                onClick={(e) => { e.stopPropagation(); handleImageClick(url); }}
                              />
                            )
                          ))}
                        </div>
                      )}
                      {msg.text && <div>{msg.text}</div>}
                    </div>
                  ) : msg.type === 'image' ? (
                    <div
                      style={styles.imageBubble(isOwn)}
                      onClick={() => handleImageClick(msg.image)}
                    >
                      {msg.image && <img src={msg.image} alt="分享的图片" style={styles.imageMsg} />}
                    </div>
                  ) : (
                    <div style={styles.bubble(isOwn)}>{msg.content}</div>
                  )}
                  <div style={styles.time}>{formatTime(msg.timestamp)}</div>
                </div>
                {isOwn && (
                  <div style={styles.avatarSmall(true)}>
                    {AVATARS.xiaoqi.image ? (
                      <img src={AVATARS.xiaoqi.image} alt={AVATARS.xiaoqi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : AVATARS.xiaoqi.defaultText}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={styles.messageRow(false)}>
              <div style={styles.avatarSmall(false)}>
                {AVATARS.xiaoke.image ? (
                  <img src={AVATARS.xiaoke.image} alt={AVATARS.xiaoke.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : AVATARS.xiaoke.defaultText}
              </div>
              <div style={styles.typingBubble}>
                <span style={{...styles.dot, animationDelay: '0ms'}}></span>
                <span style={{...styles.dot, animationDelay: '150ms'}}></span>
                <span style={{...styles.dot, animationDelay: '300ms'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <button style={styles.scrollTopBtn} onClick={scrollToTop} title="回到顶部">⬆</button>

      <div style={styles.inputArea}>
        {pendingImages.length > 0 && (
          <div style={styles.imagePreviewArea}>
            {pendingImages.map((img) => (
              <div key={img.id} style={styles.previewItem}>
                <img src={img.localData} alt="预览" style={styles.previewImg} />
                <button
                  style={styles.previewRemove}
                  onClick={() => removePendingImage(img.id)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {showPlusMenu && (
          <div style={styles.plusMenu}>
            <div
              style={styles.menuItem}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 105, 180, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 105, 180, 0.06)';
              }}
            >
              <span style={styles.menuIcon}>🌸</span>
              <span>相册</span>
            </div>
            <div
              style={styles.menuItem}
              onClick={() => cameraInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 105, 180, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 105, 180, 0.06)';
              }}
            >
              <span style={styles.menuIcon}>💗</span>
              <span>拍照</span>
            </div>
          </div>
        )}

        <div style={styles.inputWrapper}>
          <button
            style={styles.plusBtn}
            onClick={togglePlusMenu}
            disabled={isLoading}
          >
            {showPlusMenu ? '✕' : '+'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={styles.hiddenInput}
            onChange={handleImageSelect}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={styles.hiddenInput}
            onChange={handleImageSelect}
          />

          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={pendingImages.length > 0 ? '输入文字（可选）…' : '宝宝，说话'}
            rows="1"
            style={styles.textarea}
          />
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
            style={styles.sendButton((input.trim() || pendingImages.length > 0) && !isLoading)}
          >
            ➤
          </button>
        </div>
        <div style={styles.footerText}>❤️ 说你想说的话，{AVATARS.xiaoke.name}都在听 ❤️</div>
      </div>

      {previewImage && (
        <div style={styles.previewOverlay} onClick={closePreview}>
          <div style={styles.previewClose} onClick={closePreview}>✕</div>
          <img src={previewImage} alt="预览" style={styles.previewImageLarge} />
          <div style={styles.previewCount}>点击任意处关闭</div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
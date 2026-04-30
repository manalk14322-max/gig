import { useRef, useState } from 'react';

const initialConversations = [
  {
    id: 'chat-1',
    name: 'Manal Khan',
    status: 'Online',
    tag: 'Project chat',
    lastMessage: 'I will send the first draft today.',
    messages: [
      {
        id: 'm-1',
        type: 'text',
        from: 'them',
        text: 'Thanks for sharing the brief. I will send the first draft today.',
        time: '9:22 PM',
      },
      {
        id: 'm-2',
        type: 'text',
        from: 'me',
        text: 'Perfect, looking forward to it.',
        time: '9:24 PM',
      },
    ],
  },
  {
    id: 'chat-2',
    name: 'Sana Zahra',
    status: 'Replies in minutes',
    tag: 'Logo design',
    lastMessage: 'Please share the color palette.',
    messages: [
      { id: 'm-3', type: 'text', from: 'them', text: 'Please share the color palette.', time: '8:10 PM' },
    ],
  },
  {
    id: 'chat-3',
    name: 'Ayaan Malik',
    status: 'Away',
    tag: 'Website',
    lastMessage: 'The homepage draft is ready.',
    messages: [
      { id: 'm-4', type: 'text', from: 'them', text: 'The homepage draft is ready.', time: '7:45 PM' },
    ],
  },
];

function nowTime() {
  return new Date().toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit' });
}

function VoiceBubble({ message }) {
  return (
    <div className="min-w-[220px] space-y-2">
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-full ${message.from === 'me' ? 'bg-white/20' : 'bg-primary/10'}`}>
          <span className="h-3 w-3 rounded-full bg-current" />
        </span>
        <div className="flex-1">
          <audio controls src={message.audioUrl} className="h-9 w-full min-w-0" />
        </div>
      </div>
      <p className={`text-[11px] ${message.from === 'me' ? 'text-white/70' : 'text-muted'}`}>
        Voice message {message.duration ? `- ${message.duration}s` : ''}
      </p>
    </div>
  );
}

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [messageText, setMessageText] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState('');
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  const activeChat = conversations.find((chat) => chat.id === activeId) || conversations[0];

  const updateActiveChat = (updater) => {
    setConversations((prev) => prev.map((chat) => (chat.id === activeId ? updater(chat) : chat)));
  };

  const sendText = () => {
    const text = messageText.trim();
    if (!text) return;
    const nextMessage = {
      id: `text-${Date.now()}`,
      type: 'text',
      from: 'me',
      text,
      time: nowTime(),
    };
    updateActiveChat((chat) => ({
      ...chat,
      lastMessage: text,
      messages: [...chat.messages, nextMessage],
    }));
    setMessageText('');
  };

  const startRecording = async () => {
    setRecordingError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setRecordingError('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (!audioBlob.size) return;
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = secondsRef.current || 1;
        const voiceMessage = {
          id: `voice-${Date.now()}`,
          type: 'voice',
          from: 'me',
          audioUrl,
          duration,
          time: nowTime(),
        };
        updateActiveChat((chat) => ({
          ...chat,
          lastMessage: 'Voice message',
          messages: [...chat.messages, voiceMessage],
        }));
        setRecordingSeconds(0);
      };

      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordingSeconds(0);
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setRecordingSeconds(secondsRef.current);
      }, 1000);
    } catch {
      setRecordingError('Microphone permission is needed to send a voice message.');
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || recorderRef.current.state === 'inactive') return;
    recorderRef.current.stop();
    setRecording(false);
  };

  const cancelRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.onstop = null;
      recorderRef.current.stream?.getTracks().forEach((track) => track.stop());
      recorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    chunksRef.current = [];
    secondsRef.current = 0;
    setRecording(false);
    setRecordingSeconds(0);
  };

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Messages</h1>
            <p className="text-sm text-muted">Text and voice notes for Pakistani project conversations.</p>
          </div>
          <button className="btn-primary text-sm" type="button">
            New message
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="card hide-scrollbar flex gap-3 overflow-x-auto p-3 lg:block lg:space-y-3 lg:overflow-visible">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              className={`min-w-[240px] rounded-2xl border px-4 py-3 text-left transition lg:w-full lg:min-w-0 ${
                activeId === chat.id
                  ? 'border-primary bg-soft'
                  : 'border-border-color bg-card-bg hover:border-primary/40'
              }`}
              onClick={() => setActiveId(chat.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{chat.name}</p>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-primary">
                  {chat.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{chat.lastMessage}</p>
            </button>
          ))}
        </div>

        <div className="card flex min-h-[560px] flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-border-color pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">{activeChat.name}</p>
              <p className="text-xs text-muted">{activeChat.status}</p>
            </div>
            <span className="tag w-fit">{activeChat.tag}</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
            {activeChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-[22px] px-4 py-3 shadow-soft sm:max-w-[70%] ${
                    message.from === 'me' ? 'bg-primary text-white' : 'bg-soft text-muted'
                  }`}
                >
                  {message.type === 'voice' ? <VoiceBubble message={message} /> : <p>{message.text}</p>}
                  <p className={`mt-2 text-[10px] ${message.from === 'me' ? 'text-white/65' : 'text-muted'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {recording && (
            <div className="flex flex-col gap-3 rounded-[22px] border border-primary/20 bg-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Recording voice message</p>
                <p className="text-xs text-muted">{recordingSeconds}s recorded</p>
              </div>
              <div className="grid gap-2 sm:flex">
                <button className="btn-ghost text-sm" type="button" onClick={cancelRecording}>
                  Cancel
                </button>
                <button className="btn-primary text-sm" type="button" onClick={stopRecording}>
                  Send voice
                </button>
              </div>
            </div>
          )}

          {recordingError && <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-700">{recordingError}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-full border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="Type a message"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendText();
              }}
            />
            <div className="grid grid-cols-[auto,1fr] gap-3 sm:flex">
              <button
                className={`grid h-12 w-12 place-items-center rounded-full border text-sm font-bold transition ${
                  recording ? 'border-primary bg-primary text-white' : 'border-border-color bg-white text-primary'
                }`}
                type="button"
                onClick={recording ? stopRecording : startRecording}
                aria-label={recording ? 'Stop voice recording' : 'Record voice message'}
              >
                Mic
              </button>
              <button className="btn-primary text-sm" type="button" onClick={sendText}>
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

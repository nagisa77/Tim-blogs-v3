import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Code2,
  MapPin,
  MousePointer2,
  Music2,
  Rotate3D,
  Sparkles,
  X,
} from "lucide-react";
import { Suspense, useMemo, useRef, useState, type ReactNode } from "react";
import type { Group } from "three";
import snapshotJson from "./generated/articles.json";
import type { Article, ArticleSnapshot, FocusId } from "./types";

const snapshot = snapshotJson as ArticleSnapshot;

type FocusRecord = {
  kicker: string;
  title: string;
  description: string;
  meta: string[];
  href?: string;
  cta?: string;
  accent: string;
};

const content: Record<FocusId, FocusRecord> = {
  threadlight: {
    kicker: "NOW BUILDING · AGENT RUNTIME",
    title: "Threadlight",
    description: "让一个 Agent，真正变成一支工程团队。一个可观察、可恢复、provider-neutral 的多 Agent Runtime、桌面工作台与远程 Host。",
    meta: ["TypeScript", "Open source", "v1.0"],
    href: "https://threadlight.xyz/",
    cta: "进入 Threadlight",
    accent: "#8fbfff",
  },
  openisle: {
    kicker: "AN ISLAND THAT STAYED",
    title: "OpenIsle",
    description: "做了，但凉凉了。它仍是一套真实运行过的全栈社区：注册、发帖、嵌套评论、消息、搜索与 Bot 集成，一个人也能把岛造出来。",
    meta: ["689 stars", "132 forks", "Spring Boot + Vue 3"],
    href: "https://github.com/nagisa77/OpenIsle",
    cta: "查看开源仓库",
    accent: "#67c7a3",
  },
  blues: {
    kicker: "LEARNING IN PUBLIC · STAGE 7/8",
    title: "Blues Practice",
    description: "练习留下声音，声音成为证据。最近在练 Key to the Highway：rhythm 一轮，接第一、二段 lead，再准时回到 rhythm。",
    meta: ["23 份记录", "8 首曲目", "最近录音 00:56"],
    href: "https://nagisa77.github.io/Blues/",
    cta: "打开练习档案",
    accent: "#4f86ba",
  },
  articles: {
    kicker: `PRIVATE REPO SNAPSHOT · ${snapshot.articles.length} NOTES`,
    title: "Field Notes",
    description: "关于产品、系统、AI 与那些亲手踩过的坑。文章在每次部署前从私密仓库同步，线上只留下适合展示的标题与摘要。",
    meta: ["Deploy-time sync", "Markdown", "GitHub private"],
    cta: "翻开文章抽屉",
    accent: "#d58b59",
  },
  github: {
    kicker: "PUBLIC WORKBENCH",
    title: "nagisa77",
    description: "Tim，坐标深圳。喜欢 coding，也喜欢把还不成熟的想法先做成能运行的东西。公开仓库里有 Agent、社区、播放器、流媒体和许多小实验。",
    meta: ["44 repositories", "Tencent", "Shenzhen"],
    href: "https://github.com/nagisa77",
    cta: "去 GitHub 逛逛",
    accent: "#b493d6",
  },
  wechat: {
    kicker: "SAY HELLO",
    title: "nagisa12321",
    description: "如果你也在做 Agent、社区产品，或者只是想聊聊 Blues，欢迎加微信。备注你从这个房间来，我就知道了。",
    meta: ["WeChat", "UTC+8", "Open to ideas"],
    cta: "复制微信号",
    accent: "#72bf76",
  },
};

function Interactive({
  id,
  children,
  onSelect,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  id: FocusId;
  children: ReactNode;
  onSelect: (id: FocusId) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const handleEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handleLeave = () => {
    setHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={hovered ? 1.035 : 1}
      onPointerOver={handleEnter}
      onPointerOut={handleLeave}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
    >
      {children}
    </group>
  );
}

function Screen({ position, glow, wide = false }: { position: [number, number, number]; glow: string; wide?: boolean }) {
  const width = wide ? 2.05 : 1.65;
  return (
    <group position={position}>
      <RoundedBox args={[width, 1.04, 0.12]} radius={0.07} smoothness={3} castShadow>
        <meshStandardMaterial color="#16191e" roughness={0.48} />
      </RoundedBox>
      <mesh position={[0, 0, 0.066]}>
        <planeGeometry args={[width - 0.22, 0.82]} />
        <meshStandardMaterial color="#101820" emissive={glow} emissiveIntensity={0.2} />
      </mesh>
      {[0.25, 0.02, -0.21].map((y, index) => (
        <mesh key={y} position={[-0.28 + index * 0.08, y, 0.073]}>
          <planeGeometry args={[width * (0.52 - index * 0.06), 0.045]} />
          <meshBasicMaterial color={index === 0 ? glow : "#72808d"} />
        </mesh>
      ))}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.12]} />
        <meshStandardMaterial color="#272b31" />
      </mesh>
      <mesh position={[0, -0.88, 0]}>
        <boxGeometry args={[0.68, 0.05, 0.33]} />
        <meshStandardMaterial color="#272b31" />
      </mesh>
    </group>
  );
}

function ThreadlightDesk({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="threadlight" onSelect={onSelect} position={[0.35, 0, -0.15]}>
      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[4.25, 0.18, 1.52]} />
        <meshStandardMaterial color="#a96f4e" roughness={0.63} />
      </mesh>
      {[[-1.75, 0.65, -0.54], [1.75, 0.65, -0.54], [-1.75, 0.65, 0.54], [1.75, 0.65, 0.54]].map((p, i) => (
        <mesh key={i} castShadow position={p as [number, number, number]}>
          <boxGeometry args={[0.15, 1.35, 0.15]} />
          <meshStandardMaterial color="#684331" roughness={0.78} />
        </mesh>
      ))}
      <Screen position={[-0.98, 2.05, -0.08]} glow="#8fbfff" wide />
      <Screen position={[1.02, 2.03, -0.08]} glow="#ca9bea" />
      <mesh position={[0.08, 1.52, 0.47]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.55, 0.07, 0.48]} />
        <meshStandardMaterial color="#25282e" />
      </mesh>
      <mesh position={[-1.5, 1.55, 0.38]}>
        <cylinderGeometry args={[0.16, 0.18, 0.31, 20]} />
        <meshStandardMaterial color="#eee8dd" />
      </mesh>
      <mesh position={[-1.5, 1.74, 0.38]}>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#6e4934" />
      </mesh>
    </Interactive>
  );
}

function OpenIsleTerminal({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="openisle" onSelect={onSelect} position={[-3.65, 0.12, -1.1]} rotation={[0, 0.1, 0]}>
      <RoundedBox args={[1.7, 1.15, 0.78]} radius={0.09} smoothness={3} position={[0, 0.62, 0]} castShadow>
        <meshStandardMaterial color="#24282b" roughness={0.72} />
      </RoundedBox>
      <mesh position={[0, 0.73, 0.397]}>
        <planeGeometry args={[1.3, 0.66]} />
        <meshStandardMaterial color="#152927" emissive="#52c79b" emissiveIntensity={0.16} />
      </mesh>
      {[0.22, 0, -0.22].map((y, index) => (
        <mesh key={y} position={[-0.18 + index * 0.08, y + 0.72, 0.405]}>
          <planeGeometry args={[0.72 - index * 0.08, 0.045]} />
          <meshBasicMaterial color={index === 0 ? "#67c7a3" : "#6c837c"} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.08, 0.13]}>
        <boxGeometry args={[1.85, 0.14, 1]} />
        <meshStandardMaterial color="#454a4c" />
      </mesh>
      <mesh position={[0, 0.19, 0.39]} rotation={[-0.07, 0, 0]}>
        <boxGeometry args={[1.38, 0.05, 0.5]} />
        <meshStandardMaterial color="#1b1f21" />
      </mesh>
    </Interactive>
  );
}

function Guitar({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="blues" onSelect={onSelect} position={[3.7, 0.48, -1.25]} rotation={[0.04, 0, -0.16]}>
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.12, 2.3, 0.11]} />
        <meshStandardMaterial color="#6a3c28" roughness={0.73} />
      </mesh>
      <mesh position={[0.03, 0.15, 0]} scale={[0.8, 1.07, 0.23]} castShadow>
        <sphereGeometry args={[0.63, 26, 18]} />
        <meshStandardMaterial color="#2f6a9b" roughness={0.38} metalness={0.18} />
      </mesh>
      <mesh position={[-0.37, -0.06, 0]} scale={[0.63, 0.75, 0.23]} castShadow>
        <sphereGeometry args={[0.52, 24, 18]} />
        <meshStandardMaterial color="#2f6a9b" roughness={0.38} metalness={0.18} />
      </mesh>
      <mesh position={[0.08, 0.2, 0.17]}>
        <cylinderGeometry args={[0.14, 0.14, 0.025, 24]} />
        <meshBasicMaterial color="#11171c" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.31, 0.46, 0.14]} />
        <meshStandardMaterial color="#503025" />
      </mesh>
      <mesh position={[0.1, -0.62, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.045, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#23272a" />
      </mesh>
    </Interactive>
  );
}

function ArticleCabinet({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="articles" onSelect={onSelect} position={[-3.55, 0, 1.8]} rotation={[0, 0.06, 0]}>
      <RoundedBox args={[1.8, 2.28, 1]} radius={0.07} smoothness={3} position={[0, 1.14, 0]} castShadow>
        <meshStandardMaterial color="#b96f4e" roughness={0.78} />
      </RoundedBox>
      {[0.55, 1.12, 1.69].map((y, index) => (
        <group key={y}>
          <mesh position={[0, y, 0.515]}>
            <boxGeometry args={[1.52, 0.45, 0.06]} />
            <meshStandardMaterial color={index === 2 ? "#d58b59" : "#a85e42"} />
          </mesh>
          <mesh position={[0, y, 0.56]}>
            <boxGeometry args={[0.42, 0.08, 0.06]} />
            <meshStandardMaterial color="#493b34" metalness={0.38} />
          </mesh>
        </group>
      ))}
      <Float speed={1.2} floatIntensity={0.16} rotationIntensity={0.05}>
        <mesh position={[0.25, 2.52, 0.08]} rotation={[0, 0.08, -0.08]}>
          <boxGeometry args={[0.95, 0.68, 0.05]} />
          <meshStandardMaterial color="#efd479" />
        </mesh>
      </Float>
    </Interactive>
  );
}

function WallGitHub({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="github" onSelect={onSelect} position={[-2.45, 2.72, -3.51]}>
      <RoundedBox args={[1.45, 1.08, 0.08]} radius={0.04} smoothness={3}>
        <meshStandardMaterial color="#1b1d21" />
      </RoundedBox>
      <mesh position={[0, 0.06, 0.05]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#d7c7ea" emissive="#9e71d0" emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[0, -0.37, 0.05]}>
        <planeGeometry args={[0.82, 0.06]} />
        <meshBasicMaterial color="#c8b3dd" />
      </mesh>
    </Interactive>
  );
}

function WeChatPhone({ onSelect }: { onSelect: (id: FocusId) => void }) {
  return (
    <Interactive id="wechat" onSelect={onSelect} position={[2.15, 1.52, 0.22]} rotation={[-1.43, 0, 0.08]}>
      <RoundedBox args={[0.5, 0.86, 0.07]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial color="#15171b" />
      </RoundedBox>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[0.42, 0.72]} />
        <meshStandardMaterial color="#153a28" emissive="#72bf76" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[-0.09, 0.05, 0.047]}>
        <circleGeometry args={[0.1, 20]} />
        <meshBasicMaterial color="#d9f2dc" />
      </mesh>
      <mesh position={[0.09, -0.07, 0.047]}>
        <circleGeometry args={[0.09, 20]} />
        <meshBasicMaterial color="#d9f2dc" />
      </mesh>
    </Interactive>
  );
}

function Chair() {
  return (
    <group position={[0.45, 0.2, 1.8]} rotation={[0, -0.1, 0]}>
      <RoundedBox args={[1.05, 1.2, 0.2]} radius={0.14} smoothness={3} position={[0, 1.08, 0.18]} castShadow>
        <meshStandardMaterial color="#25282c" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.05, 0.18, 0.9]} radius={0.12} smoothness={3} position={[0, 0.65, -0.1]} castShadow>
        <meshStandardMaterial color="#292c31" />
      </RoundedBox>
      <mesh position={[0, 0.28, -0.08]}>
        <cylinderGeometry args={[0.08, 0.08, 0.58, 12]} />
        <meshStandardMaterial color="#3c4146" metalness={0.35} />
      </mesh>
      {[0, 1.256, 2.512, 3.768, 5.024].map((r) => (
        <mesh key={r} position={[Math.cos(r) * 0.38, 0.08, Math.sin(r) * 0.38]} rotation={[0, -r, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#3c4146" />
        </mesh>
      ))}
    </group>
  );
}

function Room({ onSelect }: { onSelect: (id: FocusId) => void }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.018 - 0.34;
  });

  return (
    <group ref={group} position={[0, -0.34, 0]}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[10.2, 0.16, 7.7]} />
        <meshStandardMaterial color="#cfc0a9" roughness={0.96} />
      </mesh>
      <mesh receiveShadow position={[0, 1.9, -3.78]}>
        <boxGeometry args={[10.2, 3.96, 0.12]} />
        <meshStandardMaterial color="#e8dfd1" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[-5.04, 1.9, 0]}>
        <boxGeometry args={[0.12, 3.96, 7.7]} />
        <meshStandardMaterial color="#e2d7c6" roughness={1} />
      </mesh>
      {[[-3.4, 0.035, -0.5], [0, 0.038, 0.35], [3.35, 0.036, -0.6]].map((p, index) => (
        <mesh key={index} position={p as [number, number, number]} rotation={[-Math.PI / 2, 0, index * 0.06]} receiveShadow>
          <planeGeometry args={index === 1 ? [5.2, 3.65] : [2.6, 2.8]} />
          <meshStandardMaterial color={index === 1 ? "#a87961" : "#b88d69"} roughness={0.98} />
        </mesh>
      ))}

      <ThreadlightDesk onSelect={onSelect} />
      <OpenIsleTerminal onSelect={onSelect} />
      <Guitar onSelect={onSelect} />
      <ArticleCabinet onSelect={onSelect} />
      <WallGitHub onSelect={onSelect} />
      <WeChatPhone onSelect={onSelect} />
      <Chair />

      {[-0.55, 0.2, 0.95].map((x, index) => (
        <mesh key={x} position={[x, 2.83 - index * 0.08, -3.7]} rotation={[0, 0, (index - 1) * 0.06]}>
          <boxGeometry args={[0.56, 0.7, 0.04]} />
          <meshStandardMaterial color={["#f0cf72", "#d88863", "#8bb2c2"][index]} />
        </mesh>
      ))}
      <mesh position={[2.75, 2.7, -3.69]}>
        <boxGeometry args={[1.55, 1.12, 0.05]} />
        <meshStandardMaterial color="#f3efe6" />
      </mesh>
      <mesh position={[2.75, 2.78, -3.655]}>
        <planeGeometry args={[1.02, 0.06]} />
        <meshBasicMaterial color="#31353a" />
      </mesh>
      {[2.98, 2.72, 2.46].map((y, index) => (
        <mesh key={y} position={[2.7 + index * 0.08, y - 0.42, -3.653]}>
          <planeGeometry args={[0.74 - index * 0.1, 0.035]} />
          <meshBasicMaterial color={index === 0 ? "#d88863" : "#96918a"} />
        </mesh>
      ))}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.28} scale={14} blur={2.6} far={5.5} />
    </group>
  );
}

function LoadingRoom() {
  return <div className="room-loader"><span /><p>ASSEMBLING THE ROOM</p></div>;
}

function DetailPanel({
  active,
  onOpenArticles,
  onCopyWechat,
  copied,
}: {
  active: FocusId;
  onOpenArticles: () => void;
  onCopyWechat: () => void;
  copied: boolean;
}) {
  const item = content[active];
  const isArticles = active === "articles";
  const isWechat = active === "wechat";

  return (
    <aside className="detail-card" style={{ "--focus-accent": item.accent } as React.CSSProperties} aria-live="polite">
      <div className="detail-index">0{Object.keys(content).indexOf(active) + 1}</div>
      <p className="detail-kicker"><span />{item.kicker}</p>
      <h2>{item.title}</h2>
      <p className="detail-copy">{item.description}</p>
      <ul>{item.meta.map((meta) => <li key={meta}>{meta}</li>)}</ul>
      {item.href ? (
        <a className="detail-action" href={item.href} target="_blank" rel="noreferrer">
          {item.cta}<ArrowUpRight size={16} />
        </a>
      ) : isArticles ? (
        <button className="detail-action" onClick={onOpenArticles}>{item.cta}<BookOpen size={16} /></button>
      ) : isWechat ? (
        <button className="detail-action" onClick={onCopyWechat}>{copied ? "已复制" : item.cta}{copied ? <Check size={16} /> : <Copy size={16} />}</button>
      ) : null}
    </aside>
  );
}

function ArticleDrawer({ articles, onClose }: { articles: Article[]; onClose: () => void }) {
  const [selected, setSelected] = useState<Article | null>(articles[0] ?? null);
  const synced = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(snapshot.syncedAt));

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="article-drawer" role="dialog" aria-modal="true" aria-labelledby="article-drawer-title">
        <header>
          <div>
            <p><Sparkles size={13} /> DEPLOY SNAPSHOT · {synced}</p>
            <h2 id="article-drawer-title">Field Notes</h2>
          </div>
          <button onClick={onClose} aria-label="关闭文章抽屉"><X size={20} /></button>
        </header>
        <div className="drawer-grid">
          <div className="article-list" role="list">
            {articles.map((article, index) => (
              <button key={article.sha} className={selected?.sha === article.sha ? "active" : ""} onClick={() => setSelected(article)} role="listitem">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{article.title}</strong><small>{article.date || "UNDATED"}</small></div>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
          <article className="article-preview">
            {selected ? (
              <>
                <p>{selected.date || "UNDATED"} · {selected.path}</p>
                <h3>{selected.title}</h3>
                <blockquote>{selected.excerpt}</blockquote>
                <div className="article-source-note">正文保存在私密仓库；本站在部署时同步标题与摘要。</div>
                <a href={selected.sourceUrl} target="_blank" rel="noreferrer">在 GitHub 打开原文 <ArrowUpRight size={15} /></a>
              </>
            ) : <p>尚无文章。</p>}
          </article>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<FocusId>("threadlight");
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const orderedIds = useMemo(() => Object.keys(content) as FocusId[], []);

  const copyWechat = async () => {
    await navigator.clipboard.writeText("nagisa12321");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#room" aria-label="Tim 的 3D 数字工作室首页"><span />TIM / ROOM_77</a>
        <div className="top-meta"><span><MapPin size={13} /> SHENZHEN · UTC+8</span><a href="https://github.com/nagisa77" target="_blank" rel="noreferrer"><Code2 size={15} /> GITHUB</a></div>
      </header>

      <section className="room-stage" id="room" aria-label="Tim 的可交互 3D 工作室">
        <Suspense fallback={<LoadingRoom />}>
          <Canvas shadows orthographic camera={{ position: [8.6, 7.4, 9.5], zoom: 73, near: 0.1, far: 100 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#eee5d8"]} />
            <ambientLight intensity={1.7} />
            <directionalLight castShadow position={[5, 9, 6]} intensity={2.15} color="#fff0d7" shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-3.3, 3.8, 1.5]} intensity={15} distance={8.5} color="#86bfff" />
            <pointLight position={[3.4, 3.2, -1]} intensity={10} distance={7} color="#e0a36b" />
            <Room onSelect={setActive} />
            <OrbitControls enablePan={false} minZoom={55} maxZoom={92} minPolarAngle={0.73} maxPolarAngle={1.28} minAzimuthAngle={-0.76} maxAzimuthAngle={0.76} />
          </Canvas>
        </Suspense>

        <div className="hero-copy">
          <p>TIM’S DIGITAL STUDIO · 2026</p>
          <h1>把正在做的事，<br /><em>留在房间里。</em></h1>
          <span>Developer at Tencent. Building agents, communities, and a better blues solo.</span>
        </div>

        <div className="room-controls"><span><MousePointer2 size={14} /> 点击物件</span><span><Rotate3D size={14} /> 拖动视角</span></div>

        <div className="object-nav" aria-label="选择房间物件">
          {orderedIds.map((id, index) => (
            <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)} aria-label={`查看 ${content[id].title}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>{content[id].title}
            </button>
          ))}
        </div>

        <DetailPanel active={active} onOpenArticles={() => setArticlesOpen(true)} onCopyWechat={copyWechat} copied={copied} />
      </section>

      <footer className="mobile-footer">
        <div><Music2 size={15} /><span>Key to the Highway · Practice continues</span></div>
        <a href="https://threadlight.xyz/">CURRENTLY BUILDING <ArrowRight size={14} /></a>
      </footer>

      {articlesOpen && <ArticleDrawer articles={snapshot.articles} onClose={() => setArticlesOpen(false)} />}
    </main>
  );
}
